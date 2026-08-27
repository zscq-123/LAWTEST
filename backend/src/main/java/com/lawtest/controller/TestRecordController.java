package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.TestRecordRequest;
import com.lawtest.dto.TestRecordVO;
import com.lawtest.service.TestRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 测试记录接口 */
@RestController
@RequestMapping("/api/test-records")
@RequiredArgsConstructor
public class TestRecordController {

    private final TestRecordService testRecordService;

    /** 保存一次测试记录（统计用） */
    @PostMapping
    public ApiResponse<TestRecordVO> save(@Valid @RequestBody TestRecordRequest request) {
        return ApiResponse.success(testRecordService.save(request.getKeywordIds()));
    }
}
