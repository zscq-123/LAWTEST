package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/** 报告 */
@Data
@TableName("report")
public class Report {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long recordId;
    private String code;
    /** 二维码内容（报告页URL） */
    private String qrUrl;
    /** AI 深度分析结果（JSON 序列化，生成一次后缓存） */
    private String aiAnalysis;
    private LocalDateTime createdAt;
}
