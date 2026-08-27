package com.lawtest.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** AI 深度分析请求：按报告编号生成（结果缓存到该报告，生成一次后扫码可复用） */
@Data
public class AiAnalyzeRequest {

    /** 报告编号 */
    @NotBlank(message = "缺少报告编号")
    private String code;
}
