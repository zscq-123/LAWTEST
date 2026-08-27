package com.lawtest.mapper;

import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
 * 统计聚合 SQL（把原本 Java 侧的全表扫描 + JSON 逐条解析，下沉到数据库执行）
 */
public interface StatsMapper {

    /** 总测试记录数 */
    @Select("SELECT COUNT(*) FROM test_record")
    long countRecords();

    /** 职业分布：按第一适配职业分组计数 */
    @Select("SELECT result_career_id AS careerId, COUNT(*) AS cnt " +
            "FROM test_record GROUP BY result_career_id ORDER BY cnt DESC")
    List<Map<String, Object>> countByCareer();

    /** 高频勾选词 Top10：JSON_TABLE 展开 selected_keywords 数组后分组计数 */
    @Select("SELECT kt.keyword_id AS keywordId, k.word AS word, COUNT(*) AS cnt " +
            "FROM test_record t " +
            "JOIN JSON_TABLE(t.selected_keywords, '$[*]' COLUMNS (keyword_id BIGINT PATH '$')) AS kt " +
            "LEFT JOIN keyword k ON k.id = kt.keyword_id " +
            "GROUP BY kt.keyword_id, k.word ORDER BY cnt DESC LIMIT 10")
    List<Map<String, Object>> topKeywords();
}
