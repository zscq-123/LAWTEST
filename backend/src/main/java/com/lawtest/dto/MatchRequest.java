package com.lawtest.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/** 匹配请求：勾选的特质词ID */
@Data
public class MatchRequest {

    @NotEmpty(message = "请至少选择一个特质词")
    @Size(max = 50, message = "选词数量超出上限")
    private List<Long> keywordIds;
}
