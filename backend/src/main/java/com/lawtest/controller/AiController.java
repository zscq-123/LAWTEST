package com.lawtest.controller;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.lawtest.common.ApiResponse;
import com.lawtest.dto.AiAnalyzeRequest;
import com.lawtest.dto.AiAnalysisVO;
import com.lawtest.entity.Career;
import com.lawtest.entity.Keyword;
import com.lawtest.mapper.CareerMapper;
import com.lawtest.mapper.KeywordMapper;
import com.lawtest.service.AiAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

/** AI 深度分析接口：调用大模型解读问卷结果 */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAnalysisService aiAnalysisService;
    private final KeywordMapper keywordMapper;
    private final CareerMapper careerMapper;

    /** 基于勾选特质词生成个性化职业深度分析 */
    @PostMapping("/analyze")
    public ApiResponse<AiAnalysisVO> analyze(@Valid @RequestBody AiAnalyzeRequest request) {
        // 查特质词文本（保持勾选顺序）
        List<Keyword> keywords = keywordMapper.selectList(
                Wrappers.<Keyword>lambdaQuery().in(Keyword::getId, request.getKeywordIds()));
        String keywordWords = keywords.stream()
                .map(Keyword::getWord)
                .distinct()
                .collect(Collectors.joining("、"));

        // 查职业信息
        Career career = careerMapper.selectById(request.getCareerId());
        String careerName = career != null ? career.getName() : "未知职业";
        String careerColorName = career != null ? career.getColorName() : "";

        AiAnalysisVO vo = aiAnalysisService.analyze(
                request.getKeywordIds(), request.getCareerId(),
                keywordWords, careerName, careerColorName);
        return ApiResponse.success(vo);
    }
}
