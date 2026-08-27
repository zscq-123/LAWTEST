package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.AiAnalyzeRequest;
import com.lawtest.dto.AiAnalysisVO;
import com.lawtest.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** AI 深度分析接口：按报告编号生成并缓存（生成一次，扫码可复用） */
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final ReportService reportService;

    /** 基于报告生成 AI 深度分析（已缓存则直接返回） */
    @PostMapping("/analyze")
    public ApiResponse<AiAnalysisVO> analyze(@Valid @RequestBody AiAnalyzeRequest request) {
        return ApiResponse.success(reportService.generateAiAnalysis(request.getCode()));
    }
}
