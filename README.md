# “五彩法途，筑梦未来”线上职业特质测评系统

法学院迎新活动「五彩职业选择」线上职业特质测评系统：新生在大屏上从 75 个特质词中勾选最多 10 个，系统匹配出适配职业，生成五色主题职业画像，推送身体素质要求与大学四年锻炼计划，支持扫码在手机端查看、保存与收藏，并可对接实务导师。

## 技术栈

| 环节 | 选型 |
| --- | --- |
| 前端 | Vue 3 + TypeScript + Vite + Ant Design Vue + ECharts + html2canvas |
| 后端 | Spring Boot 3（Java 17）+ MyBatis-Plus + MySQL 8（ZXing 二维码） |
| 部署 | Docker + docker-compose + Nginx |

## 目录结构

```
LAWTEST/
├── docs/          # 项目计划书、实施计划书、提示词包
├── sql/           # 建表 SQL 与初始化数据
├── backend/       # Spring Boot 后端
├── frontend/      # Vue 3 前端
└── deploy/        # Docker 部署（compose、nginx、启动脚本、部署手册）
```

## 开发阶段

| 阶段 | 内容 | 状态 |
| --- | --- | --- |
| 0 | 项目初始化（仓库、文档、目录结构） | ✅ |
| 1 | 内容与数据准备 + 数据库设计与初始化 | ⏳ |
| 2 | 后端工程搭建与 API 开发 | ✅ |
| 3 | 前端工程搭建与大屏测试端 | ✅ |
| 4 | 匹配画像联调、手机报告端、扫码、导师模块 | ✅ |
| 5 | Docker 部署与离线方案 | ✅ |
| 6 | 职业形象插画与收尾 | ⏳ |

## 快速开始（开发）

1. 启动 MySQL 8，执行 `sql/schema.sql` 与 `sql/data.sql`。
2. 启动后端：`cd backend && mvn spring-boot:run`（默认端口 8080）。
3. 启动前端：`cd frontend && npm install && npm run dev`（默认端口 5173）。

数据库脚本位于 `sql/`（`01_schema.sql` 建表、`02_data.sql` 初始化数据）；Docker 一键部署详见 `deploy/部署手册.md`。

## 免责声明

测试结果为兴趣初步画像，仅供参考。
