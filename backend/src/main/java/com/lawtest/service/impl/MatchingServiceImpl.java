package com.lawtest.service.impl;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.lawtest.common.BusinessException;
import com.lawtest.dto.CareerScoreDTO;
import com.lawtest.dto.MatchResultDTO;
import com.lawtest.entity.Career;
import com.lawtest.entity.CareerKeyword;
import com.lawtest.entity.Keyword;
import com.lawtest.mapper.CareerKeywordMapper;
import com.lawtest.mapper.CareerMapper;
import com.lawtest.mapper.KeywordMapper;
import com.lawtest.service.MatchingService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchingServiceImpl implements MatchingService {

    /** 理论最高分：某职业组内最多10个词全部命中核心词（2分） */
    private static final int MAX_SCORE = 20;
    private static final String DISCLAIMER = "本结果为兴趣初步画像，仅供参考";
    private static final String TIP_FEW_WORDS = "再多选几个词，结果会更准确";
    private static final String TIP_LOW_MATCH = "兴趣线索较弱，建议同时了解第二适配方向";

    private final CareerMapper careerMapper;
    private final KeywordMapper keywordMapper;
    private final CareerKeywordMapper careerKeywordMapper;

    /** 静态配置缓存：career/career_keyword/keyword 活动期间不变，启动时加载一次，match 全程零 DB 查询 */
    private List<Career> careers;
    private List<CareerKeyword> keywordLinks;
    private Map<Long, Keyword> keywordMap;

    @PostConstruct
    void loadConfig() {
        this.careers = careerMapper.selectList(
                Wrappers.<Career>lambdaQuery().orderByAsc(Career::getSortOrder));
        this.keywordLinks = careerKeywordMapper.selectList(null);
        this.keywordMap = keywordMapper.selectList(null).stream()
                .collect(Collectors.toMap(Keyword::getId, k -> k));
    }

    @Override
    public MatchResultDTO match(List<Long> keywordIds) {
        // 1. 参数校验：去重、排序、数量与合法性（用缓存词库校验，不查库）
        List<Long> ids = keywordIds.stream().distinct().sorted().collect(Collectors.toList());
        if (ids.isEmpty()) {
            throw new BusinessException(400, "请至少选择一个特质词");
        }
        if (ids.size() > 50) {
            throw new BusinessException(400, "选词数量超出上限");
        }
        long validCount = ids.stream().filter(keywordMap::containsKey).count();
        if (validCount != ids.size()) {
            throw new BusinessException(400, "包含无效的特质词");
        }
        // 2. 每组（职业）最多选 10 个：按 career_keyword 关联统计各职业命中词数
        //    （跨职业共享词会在其所属的多个组内分别计数）
        Set<Long> selected = Set.copyOf(ids);
        Map<Long, Integer> groupHits = new HashMap<>();
        for (CareerKeyword ck : keywordLinks) {
            if (selected.contains(ck.getKeywordId())) {
                groupHits.merge(ck.getCareerId(), 1, Integer::sum);
            }
        }
        for (Map.Entry<Long, Integer> entry : groupHits.entrySet()) {
            if (entry.getValue() > 10) {
                throw new BusinessException(400, "每组最多只能选择10个特质词");
            }
        }

        // 3. 逐职业累加命中词权重（配置已缓存，零 DB 查询）
        Map<Long, Career> careerMap = careers.stream()
                .collect(Collectors.toMap(Career::getId, c -> c));
        Map<Long, Integer> scores = new LinkedHashMap<>();
        for (Career career : careers) {
            scores.put(career.getId(), 0);
        }
        for (CareerKeyword ck : keywordLinks) {
            if (selected.contains(ck.getKeywordId())) {
                scores.merge(ck.getCareerId(), ck.getWeight(), Integer::sum);
            }
        }

        // 3. 按得分降序、职业ID升序排名
        List<CareerScoreDTO> ranked = scores.entrySet().stream()
                .map(entry -> toScoreDTO(careerMap.get(entry.getKey()), entry.getValue()))
                .sorted(Comparator.comparing(CareerScoreDTO::getScore).reversed()
                        .thenComparing(CareerScoreDTO::getCareerId))
                .collect(Collectors.toList());

        CareerScoreDTO first = ranked.get(0);
        CareerScoreDTO second = ranked.get(1);

        // 4. 并列双适配判定
        List<Long> tieCareerIds = ranked.stream()
                .filter(c -> c.getScore().equals(first.getScore()))
                .map(CareerScoreDTO::getCareerId)
                .collect(Collectors.toList());
        boolean tie = tieCareerIds.size() >= 2;

        // 5. 引导提示
        String tip = null;
        if (ids.size() < 3) {
            tip = TIP_FEW_WORDS;
        } else if (first.getMatchRate() < 40) {
            tip = TIP_LOW_MATCH;
        }

        MatchResultDTO result = new MatchResultDTO();
        result.setKeywordIds(new ArrayList<>(ids));
        result.setScores(scores.entrySet().stream()
                .collect(Collectors.toMap(e -> String.valueOf(e.getKey()), Map.Entry::getValue,
                        (a, b) -> a, LinkedHashMap::new)));
        result.setFirst(first);
        result.setSecond(second);
        result.setTie(tie);
        result.setTieCareerIds(tieCareerIds);
        result.setTip(tip);
        result.setDisclaimer(DISCLAIMER);
        return result;
    }

    private CareerScoreDTO toScoreDTO(Career career, int score) {
        CareerScoreDTO dto = new CareerScoreDTO();
        dto.setCareerId(career.getId());
        dto.setName(career.getName());
        dto.setColorName(career.getColorName());
        dto.setColorCode(career.getColorCode());
        dto.setSlogan(career.getSlogan());
        dto.setScore(score);
        dto.setMatchRate(Math.round(score * 100f / MAX_SCORE));
        return dto;
    }
}
