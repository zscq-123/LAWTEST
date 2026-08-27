package com.lawtest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** 特质词视图对象 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeywordVO {

    private Long id;
    private String word;
    /** 是否为当前职业的核心词 */
    private Boolean core;
}
