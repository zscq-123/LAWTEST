package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.ReportRequest;
import com.lawtest.dto.ReportVO;
import com.lawtest.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 报告接口 */
@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /** 生成报告（保存测试记录+编号+二维码），可选携带学号关联参与者 */
    @PostMapping
    public ApiResponse<ReportVO> createReport(@Valid @RequestBody ReportRequest request) {
        return ApiResponse.success(reportService.createReport(request.getKeywordIds(), request.getStudentNo()));
    }

    /** 按报告编号查询完整报告（手机扫码使用） */
    @GetMapping("/{code}")
    public ApiResponse<ReportVO> getByCode(@PathVariable String code) {
        return ApiResponse.success(reportService.getByCode(code));
    }
}
