package com.lawtest.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/** 报告生成请求 */
@Data
public class ReportRequest {

    @NotEmpty(message = "请至少选择一个特质词")
    @Size(max = 10, message = "最多只能选择10个特质词")
    private List<Long> keywordIds;
}
