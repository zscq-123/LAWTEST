package com.lawtest.service;

import com.lawtest.entity.Mentor;

import java.util.List;

/** 导师服务 */
public interface MentorService {

    List<Mentor> listByCareerId(Long careerId);
}
