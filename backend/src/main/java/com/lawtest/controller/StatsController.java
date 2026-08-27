package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.StatsSummaryVO;
import com.lawtest.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 数据统计接口 */
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final StatsService statsService;

    /** 统计汇总：参与人数、职业分布、高频词 */
    @GetMapping("/summary")
    public ApiResponse<StatsSummaryVO> summary() {
        return ApiResponse.success(statsService.summary());
    }
}
