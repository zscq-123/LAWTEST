package com.lawtest.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/** AI 深度分析请求：基于勾选特质词与匹配职业，让大模型生成个性化解读 */
@Data
public class AiAnalyzeRequest {

    /** 勾选的特质词 ID（1~10 个） */
    @NotEmpty(message = "请至少选择一个特质词")
    @Size(max = 10, message = "最多只能选择10个特质词")
    private List<Long> keywordIds;

    /** 匹配到的职业 ID（第一适配） */
    @NotNull(message = "缺少职业信息")
    private Long careerId;
}
