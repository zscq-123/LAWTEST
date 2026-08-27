package com.lawtest.service;

import com.lawtest.dto.CareerVO;

import java.util.List;

/** 职业内容服务 */
public interface CareerService {

    /** 返回全部职业及词库（含核心词标记） */
    List<CareerVO> listCareers();
}
