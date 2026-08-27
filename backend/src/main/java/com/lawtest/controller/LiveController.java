package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.LandingQrVO;
import com.lawtest.dto.LiveOverviewVO;
import com.lawtest.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** 大屏实时同步接口 */
@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveController {

    private final ParticipantService participantService;

    /** 实时概览（大屏 3s 轮询）：完成人数/目标/手机端活跃 */
    @GetMapping("/overview")
    public ApiResponse<LiveOverviewVO> overview() {
        return ApiResponse.success(participantService.overview());
    }

    /** 手机端心跳（答题页每 30s 调用，保持活跃） */
    @PostMapping("/heartbeat")
    public ApiResponse<Void> heartbeat(@RequestBody Map<String, String> body) {
        participantService.heartbeat(body.get("studentNo"));
        return ApiResponse.success();
    }

    /** 落地二维码（扫码进入手机端测试） */
    @GetMapping("/landing-qr")
    public ApiResponse<LandingQrVO> landingQr() {
        return ApiResponse.success(participantService.landingQr());
    }
}
