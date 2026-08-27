package com.lawtest.service;

import com.lawtest.dto.ReportVO;

import java.util.List;

/** 报告服务 */
public interface ReportService {

    /** 生成报告（保存测试记录+报告编号+二维码） */
    ReportVO createReport(List<Long> keywordIds);

    /** 按报告编号查询完整报告 */
    ReportVO getByCode(String code);
}
