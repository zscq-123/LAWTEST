package com.lawtest.service;

import com.lawtest.dto.AiAnalysisVO;

import java.util.List;

/** AI 深度分析服务：基于勾选特质词调用大模型生成个性化职业分析 */
public interface AiAnalysisService {

    /**
     * 生成职业深度分析
     *
     * @param keywordIds 勾选的特质词ID
     * @param careerId   匹配职业ID
     * @param keywordWords 特质词文本（如“思辨敏捷、逻辑缜密”）
     * @param careerName  职业名称
     * @param careerColorName 职业色彩名
     */
    AiAnalysisVO analyze(List<Long> keywordIds, Long careerId,
                         String keywordWords, String careerName, String careerColorName);
}
