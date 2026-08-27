package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/** 参与者身份登记（学号去重） */
@Data
@TableName("participant")
public class Participant {

    @TableId(type = IdType.AUTO)
    private Long id;
    /** 姓名（辅助校验，不用于去重） */
    private String name;
    /** 学号：唯一去重键 */
    private String studentNo;
    /** 登记入口：screen-大屏 / mobile-手机 */
    private String source;
    /** IN_PROGRESS-进行中 / FINISHED-已完成 */
    private String status;
    /** 最近心跳时间（判定手机端活跃，90s 内视为在线） */
    private LocalDateTime lastHeartbeatAt;
    /** 完成后的报告编号（已参加可直接跳转） */
    private String reportCode;
    private LocalDateTime createdAt;
}
