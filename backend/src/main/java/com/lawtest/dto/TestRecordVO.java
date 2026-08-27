package com.lawtest.dto;

import lombok.Data;

/** 测试记录保存结果 */
@Data
public class TestRecordVO {

    private Long recordId;
    private Long resultCareerId;
    private MatchResultDTO result;
}
