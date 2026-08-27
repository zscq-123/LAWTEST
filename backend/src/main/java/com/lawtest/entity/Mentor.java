package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/** 实务导师 */
@Data
@TableName("mentor")
public class Mentor {

    @TableId(type = IdType.AUTO)
    private Long id;
    private Long careerId;
    private String name;
    private String title;
    private String contact;
    private String bookingUrl;
}
