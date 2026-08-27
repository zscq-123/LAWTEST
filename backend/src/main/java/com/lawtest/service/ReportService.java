package com.lawtest.service;

import com.lawtest.dto.AiAnalysisVO;
import com.lawtest.dto.ReportVO;

import java.util.List;

/** 报告服务 */
public interface ReportService {

    /** 生成报告（保存测试记录+报告编号+二维码） */
    ReportVO createReport(List<Long> keywordIds);

    /** 生成报告并关联参与者（学号已登记则标记完成，同一人重复测试不重复计数） */
    ReportVO createReport(List<Long> keywordIds, String studentNo);

    /** 按报告编号查询完整报告 */
    ReportVO getByCode(String code);

    /**
     * 生成并缓存 AI 深度分析
     *
     * @param code 报告编号
     * @return 生成的 AI 分析（已缓存到报告，重复调用直接返回缓存）
     */
    AiAnalysisVO generateAiAnalysis(String code);
}
