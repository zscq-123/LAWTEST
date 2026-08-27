package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.MatchRequest;
import com.lawtest.dto.MatchResultDTO;
import com.lawtest.service.MatchingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 匹配引擎接口 */
@RestController
@RequestMapping("/api/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final MatchingService matchingService;

    /** 提交勾选词，返回第一/第二适配职业与匹配度 */
    @PostMapping
    public ApiResponse<MatchResultDTO> match(@Valid @RequestBody MatchRequest request) {
        return ApiResponse.success(matchingService.match(request.getKeywordIds()));
    }
}
