package com.lawtest.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lawtest.common.BusinessException;
import com.lawtest.dto.CareerVO;
import com.lawtest.dto.MatchResultDTO;
import com.lawtest.dto.ProfileVO;
import com.lawtest.dto.ReportVO;
import com.lawtest.entity.Career;
import com.lawtest.entity.FitnessPlan;
import com.lawtest.entity.FitnessRequirement;
import com.lawtest.entity.Mentor;
import com.lawtest.entity.Profile;
import com.lawtest.entity.Report;
import com.lawtest.entity.TestRecord;
import com.lawtest.mapper.CareerMapper;
import com.lawtest.mapper.FitnessPlanMapper;
import com.lawtest.mapper.FitnessRequirementMapper;
import com.lawtest.mapper.MentorMapper;
import com.lawtest.mapper.ProfileMapper;
import com.lawtest.mapper.ReportMapper;
import com.lawtest.mapper.TestRecordMapper;
import com.lawtest.service.MatchingService;
import com.lawtest.service.ReportService;
import com.lawtest.util.QrCodeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
    private final MatchingService matchingService;
    private final ObjectMapper objectMapper;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Override
    public ReportVO createReport(List<Long> keywordIds) {
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
        return vo;
    }

    private String generateCode() {
        return "LW" + LocalDateTime.now().format(CODE_FORMATTER)
                + String.format("%04d", RANDOM.nextInt(10000));
    }
}
