package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.entity.Mentor;
import com.lawtest.service.MentorService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 导师接口 */
@RestController
@RequestMapping("/api/mentors")
@RequiredArgsConstructor
@Validated
public class MentorController {

    private final MentorService mentorService;

    /** 获取对应职业的导师列表 */
    @GetMapping
    public ApiResponse<List<Mentor>> listByCareerId(
            @NotNull(message = "careerId不能为空") @RequestParam Long careerId) {
        return ApiResponse.success(mentorService.listByCareerId(careerId));
    }
}
