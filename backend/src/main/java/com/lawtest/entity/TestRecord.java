package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/** 测试记录 */
@Data
@TableName("test_record")
public class TestRecord {

    @TableId(type = IdType.AUTO)
    private Long id;
    /** 所选特质词ID数组（JSON） */
    private String selectedKeywords;
    /** 五职业得分（JSON，key为职业ID） */
    private String scores;
    private Long resultCareerId;
    private LocalDateTime createdAt;
}
