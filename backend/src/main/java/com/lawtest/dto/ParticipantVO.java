package com.lawtest.dto;

import lombok.Data;

import java.time.LocalDateTime;

/** 参与者登记结果 */
@Data
public class ParticipantVO {

    private Long id;
    private String name;
    private String studentNo;
    private String source;
    private String status;
    /** 学号已登记过（同一人再次登记） */
    private boolean alreadyParticipated;
    /** 已完成时的报告编号（可直接跳转） */
    private String reportCode;
    private LocalDateTime createdAt;
}
