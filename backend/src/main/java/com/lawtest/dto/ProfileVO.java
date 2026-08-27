package com.lawtest.dto;

import lombok.Data;

import java.util.List;

/** 职业画像视图对象 */
@Data
public class ProfileVO {

    private String slogan;
    private List<String> strengths;
    private List<String> improvements;
}
