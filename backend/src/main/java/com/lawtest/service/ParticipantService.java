package com.lawtest.service;

import com.lawtest.dto.LandingQrVO;
import com.lawtest.dto.LiveOverviewVO;
import com.lawtest.dto.ParticipantRegisterRequest;
import com.lawtest.dto.ParticipantVO;

/** 参与者身份与实时概览服务 */
public interface ParticipantService {

    /** 登记身份：学号唯一，已登记且姓名一致时返回 alreadyParticipated=true（不重复计数） */
    ParticipantVO register(ParticipantRegisterRequest request);

    /** 刷新心跳（手机端答题页每 30s 调用，保持活跃） */
    void heartbeat(String studentNo);

    /** 大屏实时概览（3s 轮询） */
    LiveOverviewVO overview();

    /** 落地二维码（扫码进入手机端测试） */
    LandingQrVO landingQr();
}
