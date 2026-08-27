package com.lawtest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 大屏实时概览（3s 轮询） */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LiveOverviewVO {

    /** 已完成人数（学号去重） */
    private long finishedCount;
    /** 目标人数 */
    private long targetCount;
    /** 手机端活跃答题人数（心跳 90s 内） */
    private long activeMobileCount;
}
