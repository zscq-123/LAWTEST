package com.lawtest.dto;

import lombok.Data;

/** 职业得分与匹配度 */
@Data
public class CareerScoreDTO {

    private Long careerId;
    private String name;
    private String colorName;
    private String colorCode;
    private String slogan;
    private Integer score;
    /** 匹配度（0-100 整数百分比） */
    private Integer matchRate;
}
