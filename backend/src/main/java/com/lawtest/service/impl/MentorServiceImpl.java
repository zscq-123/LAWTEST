package com.lawtest.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.lawtest.entity.Mentor;
import com.lawtest.mapper.MentorMapper;
import com.lawtest.service.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorServiceImpl implements MentorService {

    private final MentorMapper mentorMapper;

    @Override
    public List<Mentor> listByCareerId(Long careerId) {
        return mentorMapper.selectList(
                Wrappers.<Mentor>lambdaQuery()
                        .eq(Mentor::getCareerId, careerId)
                        .orderByAsc(Mentor::getId));
    }
}
