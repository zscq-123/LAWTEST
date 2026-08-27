-- =====================================================================
-- 增量脚本 03：参与者身份（学号去重）+ 大屏实时概览支撑
-- 执行时机：在 01_schema.sql / 02_data.sql 之后执行一次；本脚本幂等，可重复执行
-- 注意：01_schema.sql 的 DROP 列表已补充 participant，可安全重建整个库
-- =====================================================================
USE lawtest;

-- ---------------------------------------------------------------------
-- 1. participant 参与者身份登记表（姓名 + 学号去重）
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS participant (
    id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    name              VARCHAR(64)     NOT NULL COMMENT '姓名（辅助校验）',
    student_no        VARCHAR(32)     NOT NULL COMMENT '学号（唯一去重键）',
    source            VARCHAR(16)     NOT NULL DEFAULT 'mobile' COMMENT '登记入口：screen-大屏 / mobile-手机',
    status            VARCHAR(16)     NOT NULL DEFAULT 'IN_PROGRESS' COMMENT 'IN_PROGRESS-进行中 / FINISHED-已完成',
    last_heartbeat_at DATETIME        NULL COMMENT '最近心跳时间（判定手机端活跃）',
    report_code       VARCHAR(32)     NULL COMMENT '完成后的报告编号（已参加可直接跳转）',
    created_at        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登记时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_participant_student_no (student_no),
    KEY idx_participant_status_heartbeat (status, last_heartbeat_at),
    CONSTRAINT fk_participant_report FOREIGN KEY (report_code) REFERENCES report (code)
) ENGINE = InnoDB COMMENT ='参与者身份登记（学号去重）';

-- ---------------------------------------------------------------------
-- 2. test_record 关联参与者（幂等：列不存在才加）
--    统计口径：参与人数 = FINISHED 的 participant 数（同一学号重复测试不重复计数）
-- ---------------------------------------------------------------------
SET @col_exists := (
    SELECT COUNT(*) FROM information_schema.columns
    WHERE table_schema = DATABASE() AND table_name = 'test_record' AND column_name = 'participant_id'
);
SET @ddl := IF(@col_exists = 0,
    'ALTER TABLE test_record
        ADD COLUMN participant_id BIGINT UNSIGNED NULL COMMENT ''参与者ID（学号去重关联）'' AFTER result_career_id,
        ADD KEY idx_tr_participant (participant_id),
        ADD CONSTRAINT fk_tr_participant FOREIGN KEY (participant_id) REFERENCES participant (id)',
    'SELECT 1');
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
