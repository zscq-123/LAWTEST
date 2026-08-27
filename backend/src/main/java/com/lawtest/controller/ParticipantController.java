package com.lawtest.controller;

import com.lawtest.common.ApiResponse;
import com.lawtest.dto.ParticipantRegisterRequest;
import com.lawtest.dto.ParticipantVO;
import com.lawtest.service.ParticipantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 参与者身份接口 */
@RestController
@RequestMapping("/api/participants")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;

    /** 登记身份（学号去重；已登记且姓名一致 → alreadyParticipated=true） */
    @PostMapping("/register")
    public ApiResponse<ParticipantVO> register(@Valid @RequestBody ParticipantRegisterRequest request) {
        return ApiResponse.success(participantService.register(request));
    }
}
