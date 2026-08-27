package com.lawtest.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.lawtest.common.BusinessException;
import com.lawtest.dto.LandingQrVO;
import com.lawtest.dto.LiveOverviewVO;
import com.lawtest.dto.ParticipantRegisterRequest;
import com.lawtest.dto.ParticipantVO;
import com.lawtest.entity.Participant;
import com.lawtest.mapper.ParticipantMapper;
import com.lawtest.service.ParticipantService;
import com.lawtest.util.QrCodeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ParticipantServiceImpl implements ParticipantService {

    private final ParticipantMapper participantMapper;

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Value("${app.target-participants:200}")
    private long targetParticipants;

    @Value("${app.live.active-ttl-seconds:90}")
    private long activeTtlSeconds;

    @Override
    public ParticipantVO register(ParticipantRegisterRequest request) {
        String studentNo = request.getStudentNo().trim();
        String name = request.getName().trim();

        Participant exist = participantMapper.selectOne(
                Wrappers.<Participant>lambdaQuery().eq(Participant::getStudentNo, studentNo));
        if (exist != null) {
            // 学号已登记：姓名一致视为同一人（已参加，不重复计数）；不一致提示核对，防止误填
            if (!exist.getName().equals(name)) {
                throw new BusinessException("该学号已登记过其他姓名，请核对");
            }
            ParticipantVO vo = toVO(exist);
            vo.setAlreadyParticipated(true);
            return vo;
        }

        Participant participant = new Participant();
        participant.setName(name);
        participant.setStudentNo(studentNo);
        participant.setSource(request.getSource() == null || request.getSource().isBlank()
                ? "mobile" : request.getSource());
        participant.setStatus("IN_PROGRESS");
        participant.setLastHeartbeatAt(LocalDateTime.now());
        participantMapper.insert(participant);

        ParticipantVO vo = toVO(participant);
        vo.setAlreadyParticipated(false);
        return vo;
    }

    @Override
    public void heartbeat(String studentNo) {
        if (studentNo == null || studentNo.isBlank()) {
            throw new BusinessException("缺少学号");
        }
        Participant update = new Participant();
        update.setLastHeartbeatAt(LocalDateTime.now());
        participantMapper.update(update, Wrappers.<Participant>lambdaUpdate()
                .eq(Participant::getStudentNo, studentNo.trim()));
    }

    @Override
    public LiveOverviewVO overview() {
        long finished = participantMapper.selectCount(
                Wrappers.<Participant>lambdaQuery().eq(Participant::getStatus, "FINISHED"));
        long activeMobile = participantMapper.selectCount(
                Wrappers.<Participant>lambdaQuery()
                        .eq(Participant::getSource, "mobile")
                        .eq(Participant::getStatus, "IN_PROGRESS")
                        .gt(Participant::getLastHeartbeatAt, LocalDateTime.now().minusSeconds(activeTtlSeconds)));
        return new LiveOverviewVO(finished, targetParticipants, activeMobile);
    }

    @Override
    public LandingQrVO landingQr() {
        String url = frontendBaseUrl + "/?from=mobile";
        return new LandingQrVO(url, QrCodeUtil.toBase64DataUrl(url, 320));
    }

    private ParticipantVO toVO(Participant p) {
        ParticipantVO vo = new ParticipantVO();
        vo.setId(p.getId());
        vo.setName(p.getName());
        vo.setStudentNo(p.getStudentNo());
        vo.setSource(p.getSource());
        vo.setStatus(p.getStatus());
        vo.setReportCode(p.getReportCode());
        vo.setCreatedAt(p.getCreatedAt());
        return vo;
    }
}
