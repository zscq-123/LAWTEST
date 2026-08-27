package com.lawtest.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/** 职业配置 */
@Data
@TableName("career")
public class Career {

    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String colorName;
    private String colorCode;
    private String slogan;
    private Integer sortOrder;
}
