package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/** 身体素质达标要求 */
@Data
@TableName("fitness_requirement")
public class FitnessRequirement {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long careerId;
    private Integer seq;
    private String content;
}
