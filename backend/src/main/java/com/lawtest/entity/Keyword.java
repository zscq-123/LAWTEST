package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/** 特质词 */
@Data
@TableName("keyword")
public class Keyword {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String word;
    /** 是否为（任一职业的）核心词 */
    private Boolean core;
}
