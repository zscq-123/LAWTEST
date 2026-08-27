package com.lawtest.dto;

import lombok.Data;

import java.util.List;

/** 职业视图对象（含特质词库） */
@Data
public class CareerVO {

    private Long id;
    private String name;
    private String colorName;
    private String colorCode;
    private String slogan;
    private Integer sortOrder;
    private List<KeywordVO> keywords;
}
