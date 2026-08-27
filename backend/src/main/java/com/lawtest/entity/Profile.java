package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/** 职业画像内容 */
@Data
@TableName("profile")
public class Profile {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long careerId;
    /** 优势（JSON 字符串数组） */
    private String strengths;
    /** 短板与建议（JSON 字符串数组） */
    private String improvements;
    private String slogan;
}
