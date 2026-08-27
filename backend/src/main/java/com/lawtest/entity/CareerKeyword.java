package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/** 职业-特质词关联 */
@Data
@TableName("career_keyword")
public class CareerKeyword {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long careerId;
    private Long keywordId;
    private Integer weight;
}
