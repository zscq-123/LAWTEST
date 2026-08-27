package com.lawtest.service;

import com.lawtest.dto.MatchResultDTO;

import java.util.List;

/** 匹配引擎服务 */
public interface MatchingService {

    /** 按“核心词2分、普通词1分”计算五职业得分并返回第一/第二适配 */
    MatchResultDTO match(List<Long> keywordIds);
}
