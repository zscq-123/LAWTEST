-- =====================================================================
-- “五彩法途，筑梦未来”线上职业特质测评系统 数据库设计
-- MySQL 8.0+ / utf8mb4
-- 执行顺序：先执行本文件（schema.sql），再执行 data.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS lawtest
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lawtest;
SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
-- 1. career 职业配置
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS report;
DROP TABLE IF EXISTS test_record;
DROP TABLE IF EXISTS mentor;
DROP TABLE IF EXISTS fitness_plan;
DROP TABLE IF EXISTS fitness_requirement;
DROP TABLE IF EXISTS profile;
DROP TABLE IF EXISTS career_keyword;
DROP TABLE IF EXISTS keyword;
DROP TABLE IF EXISTS career;

CREATE TABLE career (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    name        VARCHAR(64)     NOT NULL COMMENT '职业名称',
    color_name  VARCHAR(32)     NOT NULL COMMENT '专属色彩名称（如：皓月白）',
    color_code  VARCHAR(16)     NOT NULL COMMENT '专属色彩色值（如：#F5F7FA）',
    slogan      VARCHAR(128)    NOT NULL COMMENT '职业主题口号',
    sort_order  INT             NOT NULL DEFAULT 0 COMMENT '排序（越小越靠前）',
    PRIMARY KEY (id),
    UNIQUE KEY uk_career_name (name)
) ENGINE = InnoDB COMMENT ='职业配置';

-- ---------------------------------------------------------------------
-- 2. keyword 特质词库（词本身唯一，可被多个职业复用）
-- ---------------------------------------------------------------------
CREATE TABLE keyword (
    id     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    word   VARCHAR(32)     NOT NULL COMMENT '特质词',
    core   TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '是否为（任一职业的）核心词：1-是 0-否',
    PRIMARY KEY (id),
    UNIQUE KEY uk_keyword_word (word)
) ENGINE = InnoDB COMMENT ='特质词库';

-- ---------------------------------------------------------------------
-- 3. career_keyword 职业-词关联（权重为核心2分/普通1分）
-- ---------------------------------------------------------------------
CREATE TABLE career_keyword (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    career_id   BIGINT UNSIGNED NOT NULL COMMENT '职业ID',
    keyword_id  BIGINT UNSIGNED NOT NULL COMMENT '特质词ID',
    weight      INT             NOT NULL DEFAULT 1 COMMENT '权重：核心词2，普通词1',
    PRIMARY KEY (id),
    UNIQUE KEY uk_career_keyword (career_id, keyword_id),
    KEY idx_ck_keyword (keyword_id),
    CONSTRAINT fk_ck_career  FOREIGN KEY (career_id)  REFERENCES career (id),
    CONSTRAINT fk_ck_keyword FOREIGN KEY (keyword_id) REFERENCES keyword (id)
) ENGINE = InnoDB COMMENT ='职业-特质词关联';

-- ---------------------------------------------------------------------
-- 4. profile 职业画像内容
-- ---------------------------------------------------------------------
CREATE TABLE profile (
    id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    career_id    BIGINT UNSIGNED NOT NULL COMMENT '职业ID',
    strengths    JSON            NOT NULL COMMENT '性格与能力优势（字符串数组）',
    improvements JSON            NOT NULL COMMENT '潜在短板与提升建议（字符串数组）',
    slogan       VARCHAR(128)    NOT NULL COMMENT '职业画像格言',
    PRIMARY KEY (id),
    UNIQUE KEY uk_profile_career (career_id),
    CONSTRAINT fk_profile_career FOREIGN KEY (career_id) REFERENCES career (id)
) ENGINE = InnoDB COMMENT ='职业画像内容';

-- ---------------------------------------------------------------------
-- 5. fitness_requirement 身体素质达标要求
-- ---------------------------------------------------------------------
CREATE TABLE fitness_requirement (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    career_id  BIGINT UNSIGNED NOT NULL COMMENT '职业ID',
    seq        INT             NOT NULL DEFAULT 1 COMMENT '序号',
    content    VARCHAR(512)    NOT NULL COMMENT '要求内容',
    PRIMARY KEY (id),
    KEY idx_fr_career (career_id),
    CONSTRAINT fk_fr_career FOREIGN KEY (career_id) REFERENCES career (id)
) ENGINE = InnoDB COMMENT ='身体素质达标要求';

-- ---------------------------------------------------------------------
-- 6. fitness_plan 大学四年锻炼计划
-- ---------------------------------------------------------------------
CREATE TABLE fitness_plan (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    career_id   BIGINT UNSIGNED NOT NULL COMMENT '职业ID',
    year_stage  VARCHAR(32)     NOT NULL COMMENT '学年阶段（大一/大二/大三/大四）',
    content     TEXT            NOT NULL COMMENT '锻炼建议',
    PRIMARY KEY (id),
    KEY idx_fp_career (career_id),
    CONSTRAINT fk_fp_career FOREIGN KEY (career_id) REFERENCES career (id)
) ENGINE = InnoDB COMMENT ='大学四年锻炼计划';

-- ---------------------------------------------------------------------
-- 7. mentor 实务导师
-- ---------------------------------------------------------------------
CREATE TABLE mentor (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    career_id   BIGINT UNSIGNED NOT NULL COMMENT '职业ID',
    name        VARCHAR(64)     NOT NULL COMMENT '导师姓名',
    title       VARCHAR(128)    NOT NULL COMMENT '头衔/职业背景',
    contact     VARCHAR(256)    NOT NULL DEFAULT '' COMMENT '联系方式（微信/企业微信）',
    booking_url VARCHAR(512)    NOT NULL DEFAULT '' COMMENT '预约入口地址',
    PRIMARY KEY (id),
    KEY idx_mentor_career (career_id),
    CONSTRAINT fk_mentor_career FOREIGN KEY (career_id) REFERENCES career (id)
) ENGINE = InnoDB COMMENT ='实务导师';

-- ---------------------------------------------------------------------
-- 8. test_record 测试记录（统计用）
-- ---------------------------------------------------------------------
CREATE TABLE test_record (
    id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    selected_keywords  JSON            NOT NULL COMMENT '所选特质词ID数组',
    scores             JSON            NOT NULL COMMENT '五职业得分（key为职业ID）',
    result_career_id   BIGINT UNSIGNED NOT NULL COMMENT '第一适配职业ID',
    created_at         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '测试时间',
    PRIMARY KEY (id),
    KEY idx_tr_result (result_career_id),
    KEY idx_tr_created (created_at),
    CONSTRAINT fk_tr_career FOREIGN KEY (result_career_id) REFERENCES career (id)
) ENGINE = InnoDB COMMENT ='测试记录';

-- ---------------------------------------------------------------------
-- 9. report 报告（编号+二维码）
-- ---------------------------------------------------------------------
CREATE TABLE report (
    id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    record_id  BIGINT UNSIGNED NOT NULL COMMENT '测试记录ID',
    code       VARCHAR(32)     NOT NULL COMMENT '报告编号',
    qr_url     VARCHAR(512)    NOT NULL DEFAULT '' COMMENT '二维码内容（报告页URL）',
    created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '生成时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_report_code (code),
    KEY idx_report_record (record_id),
    CONSTRAINT fk_report_record FOREIGN KEY (record_id) REFERENCES test_record (id)
) ENGINE = InnoDB COMMENT ='报告';
