package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.CareerVO;
import com.lawtest.service.CareerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 职业与词库接口 */
@RestController
@RequestMapping("/api/careers")
@RequiredArgsConstructor
public class CareerController {

    private final CareerService careerService;

    /** 获取全部职业及词库（含核心词标记） */
    @GetMapping
    public ApiResponse<List<CareerVO>> listCareers() {
        return ApiResponse.success(careerService.listCareers());
    }
}
