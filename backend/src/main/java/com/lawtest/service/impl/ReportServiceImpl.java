package com.lawtest.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawtest.common.BusinessException;
import com.lawtest.dto.AiAnalysisVO;
import com.lawtest.dto.CareerVO;
import com.lawtest.dto.MatchResultDTO;
import com.lawtest.dto.ProfileVO;
import com.lawtest.dto.ReportVO;
import com.lawtest.entity.Career;
import com.lawtest.entity.FitnessPlan;
import com.lawtest.entity.FitnessRequirement;
import com.lawtest.entity.Keyword;
import com.lawtest.entity.Mentor;
import com.lawtest.entity.Participant;
import com.lawtest.entity.Profile;
import com.lawtest.entity.Report;
import com.lawtest.entity.TestRecord;
import com.lawtest.mapper.CareerMapper;
import com.lawtest.mapper.FitnessPlanMapper;
import com.lawtest.mapper.FitnessRequirementMapper;
import com.lawtest.mapper.KeywordMapper;
import com.lawtest.mapper.MentorMapper;
import com.lawtest.mapper.ParticipantMapper;
import com.lawtest.mapper.ProfileMapper;
import com.lawtest.mapper.ReportMapper;
import com.lawtest.mapper.TestRecordMapper;
import com.lawtest.service.AiAnalysisService;
import com.lawtest.service.MatchingService;
import com.lawtest.service.ReportService;
import com.lawtest.util.QrCodeUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private static final DateTimeFormatter CODE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ReportMapper reportMapper;
    private final TestRecordMapper testRecordMapper;
    private final CareerMapper careerMapper;
    private final ProfileMapper profileMapper;
    private final FitnessRequirementMapper fitnessRequirementMapper;
    private final FitnessPlanMapper fitnessPlanMapper;
    private final MentorMapper mentorMapper;
    private final KeywordMapper keywordMapper;
    private final ParticipantMapper participantMapper;
    private final MatchingService matchingService;
    private final AiAnalysisService aiAnalysisService;
    private final ObjectMapper objectMapper;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Override
    public ReportVO createReport(List<Long> keywordIds) {
        return createReport(keywordIds, null);
    }

    @Override
    public ReportVO createReport(List<Long> keywordIds, String studentNo) {
        MatchResultDTO match = matchingService.match(keywordIds);

        TestRecord record = new TestRecord();
        try {
            record.setSelectedKeywords(objectMapper.writeValueAsString(match.getKeywordIds()));
            record.setScores(objectMapper.writeValueAsString(match.getScores()));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("测试记录序列化失败", e);
        }
        record.setResultCareerId(match.getFirst().getCareerId());
        testRecordMapper.insert(record);

        String code = generateCode();
        String qrUrl = frontendBaseUrl + "/report/" + code;
        Report report = new Report();
        report.setRecordId(record.getId());
        report.setCode(code);
        report.setQrUrl(qrUrl);
        reportMapper.insert(report);

        // 关联参与者：学号已登记 → 回写记录并标记完成（同一人重复测试不重复计数）
        if (studentNo != null && !studentNo.isBlank()) {
            Participant participant = participantMapper.selectOne(
                    Wrappers.<Participant>lambdaQuery().eq(Participant::getStudentNo, studentNo.trim()));
            if (participant != null) {
                TestRecord recordUpdate = new TestRecord();
                recordUpdate.setId(record.getId());
                recordUpdate.setParticipantId(participant.getId());
                testRecordMapper.updateById(recordUpdate);

                Participant participantUpdate = new Participant();
                participantUpdate.setId(participant.getId());
                participantUpdate.setStatus("FINISHED");
                participantUpdate.setReportCode(code);
                participantMapper.updateById(participantUpdate);
            }
        }
        // 回查数据库，拿到默认生成时间等完整字段
        report = reportMapper.selectById(report.getId());

        return buildReportVO(report, match);
    }

    @Override
    public ReportVO getByCode(String code) {
        Report report = reportMapper.selectOne(
                Wrappers.<Report>lambdaQuery().eq(Report::getCode, code));
        if (report == null) {
            throw new BusinessException(404, "报告不存在或已过期");
        }
        TestRecord record = testRecordMapper.selectById(report.getRecordId());
        if (record == null) {
            throw new BusinessException(404, "报告数据缺失");
        }
        try {
            List<Long> keywordIds = objectMapper.readValue(
                    record.getSelectedKeywords(), new TypeReference<>() {
                    });
            MatchResultDTO match = matchingService.match(keywordIds);
            return buildReportVO(report, match);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("报告数据解析失败", e);
        }
    }

    @Override
    public AiAnalysisVO generateAiAnalysis(String code) {
        Report report = reportMapper.selectOne(
                Wrappers.<Report>lambdaQuery().eq(Report::getCode, code));
        if (report == null) {
            throw new BusinessException(404, "报告不存在或已过期");
        }

        // 已生成过：直接返回缓存
        if (report.getAiAnalysis() != null && !report.getAiAnalysis().isBlank()) {
            try {
                return objectMapper.readValue(report.getAiAnalysis(), AiAnalysisVO.class);
            } catch (JsonProcessingException e) {
                log.warn("报告 AI 缓存解析失败，重新生成 code={}", code);
            }
        }

        // 未生成：解析测试记录 → 调用 AI → 序列化缓存
        TestRecord record = testRecordMapper.selectById(report.getRecordId());
        if (record == null) {
            throw new BusinessException(404, "报告数据缺失");
        }
        List<Long> keywordIds;
        try {
            keywordIds = objectMapper.readValue(
                    record.getSelectedKeywords(), new TypeReference<>() {
                    });
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("报告数据解析失败", e);
        }
        Long careerId = record.getResultCareerId();
        Career career = careerMapper.selectById(careerId);

        String keywordWords = keywordMapper.selectList(
                        Wrappers.<Keyword>lambdaQuery().in(Keyword::getId, keywordIds))
                .stream().map(Keyword::getWord).distinct()
                .collect(Collectors.joining("、"));
        String careerName = career != null ? career.getName() : "未知职业";
        String careerColorName = career != null ? career.getColorName() : "";

        AiAnalysisVO vo = aiAnalysisService.analyze(
                keywordIds, careerId, keywordWords, careerName, careerColorName);

        // 缓存到报告（生成一次，扫码打开可复用）
        try {
            Report update = new Report();
            update.setId(report.getId());
            update.setAiAnalysis(objectMapper.writeValueAsString(vo));
            reportMapper.updateById(update);
        } catch (JsonProcessingException e) {
            log.error("AI 分析缓存序列化失败 code={}", code, e);
        }
        return vo;
    }

    private ReportVO buildReportVO(Report report, MatchResultDTO match) {
        Long careerId = match.getFirst().getCareerId();
        Career career = careerMapper.selectById(careerId);
        Profile profileEntity = profileMapper.selectOne(
                Wrappers.<Profile>lambdaQuery().eq(Profile::getCareerId, careerId));
        List<FitnessRequirement> requirements = fitnessRequirementMapper.selectList(
                Wrappers.<FitnessRequirement>lambdaQuery()
                        .eq(FitnessRequirement::getCareerId, careerId)
                        .orderByAsc(FitnessRequirement::getSeq));
        List<FitnessPlan> plans = fitnessPlanMapper.selectList(
                Wrappers.<FitnessPlan>lambdaQuery()
                        .eq(FitnessPlan::getCareerId, careerId)
                        .orderByAsc(FitnessPlan::getId));
        List<Mentor> mentors = mentorMapper.selectList(
                Wrappers.<Mentor>lambdaQuery()
                        .eq(Mentor::getCareerId, careerId)
                        .orderByAsc(Mentor::getId));

        ReportVO vo = new ReportVO();
        vo.setCode(report.getCode());
        vo.setCreatedAt(report.getCreatedAt());
        vo.setQrUrl(report.getQrUrl());
        vo.setQrImage(QrCodeUtil.toBase64DataUrl(report.getQrUrl(), 320));
        vo.setMatch(match);

        CareerVO careerVO = new CareerVO();
        BeanUtils.copyProperties(career, careerVO);
        vo.setCareer(careerVO);

        ProfileVO profileVO = new ProfileVO();
        profileVO.setSlogan(profileEntity.getSlogan());
        try {
            profileVO.setStrengths(objectMapper.readValue(
                    profileEntity.getStrengths(), new TypeReference<>() {
                    }));
            profileVO.setImprovements(objectMapper.readValue(
                    profileEntity.getImprovements(), new TypeReference<>() {
                    }));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("画像数据解析失败", e);
        }
        vo.setProfile(profileVO);
        vo.setFitnessRequirements(requirements);
        vo.setFitnessPlans(plans);
        vo.setMentors(mentors);

        // 解析缓存的 AI 深度分析（未生成或解析失败时为 null）
        if (report.getAiAnalysis() != null && !report.getAiAnalysis().isBlank()) {
            try {
                vo.setAiAnalysis(objectMapper.readValue(report.getAiAnalysis(), AiAnalysisVO.class));
            } catch (JsonProcessingException e) {
                log.warn("报告 AI 分析缓存解析失败 code={}", report.getCode());
                vo.setAiAnalysis(null);
            }
        }
        return vo;
    }

    private String generateCode() {
        return "LW" + LocalDateTime.now().format(CODE_FORMATTER)
                + String.format("%04d", RANDOM.nextInt(10000));
    }
}
