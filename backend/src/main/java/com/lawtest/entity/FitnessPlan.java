package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/** 大学四年锻炼计划 */
@Data
@TableName("fitness_plan")
public class FitnessPlan {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long careerId;
    private String yearStage;
    private String content;
}
