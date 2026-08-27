package com.lawtest.service;

import com.lawtest.dto.TestRecordVO;

import java.util.List;

/** 测试记录服务 */
public interface TestRecordService {

    TestRecordVO save(List<Long> keywordIds);
}
