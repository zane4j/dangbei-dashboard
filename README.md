# Dangbei Overseas Dashboard · 看板工作流

本仓库用于维护**海外经营看板**的可复用开发流程、指标定义、更新操作说明、质量检查清单，以及可供运行的**脱敏演示版 HTML**。

> **数据安全：**本仓库当前为公开（public）仓库。原始 Excel 模板、历史业务快照 HTML 和含经营数据的 Word 对比报告未上传；演示页面仅包含明确标记的虚构示例数据。正式运营数据应存储在受控的私有仓库或企业数据平台。

## 从这里开始

- [看板更新 Skill](.agents/skills/dangbei-dashboard/SKILL.md)：供 Codex/代码助手复用的操作规程
- [完整更新流程](docs/workflow.md)：模板接收 → 映射 → 校验 → 更新 HTML → 测试 → 归档
- [字段与指标口径](docs/metrics.md)：N3 MAX、EOL、售后仓及在途库存
- [每次提交的检查清单](docs/qa-checklist.md)：数据质量、口径、UI、回归测试
- [双快照对比方法](docs/comparison-guide.md)：1109 与 1116 对比报告提炼的方法
- [历史文件目录](docs/source-inventory.md)：1109 / 1116 / 1123 原始文件清单及受限状态
- [脱敏演示页](examples/dashboard-demo.html)：浏览器直接打开
- [示例数据](examples/sample-snapshot.json)：全为**虚构数据**
- [数据检查脚本](scripts/validate-snapshot.mjs)：`node scripts/validate-snapshot.mjs examples/sample-snapshot.json`

## 实际使用

1. 取得当期 Excel（`新品N3 MAX` 与 `EOL` 工作表）；备份原始 HTML 与数据。
2. 根据 [指标口径](docs/metrics.md) 检查表头、国家/SKU 粒度、金额与汇总。
3. 更新源 HTML 的 `DATA` 内容和 `meta` 日期，保留现有布局和交互；不修改现有 KPI 口径，除非有明确要求。
4. 使用 [QA 清单](docs/qa-checklist.md) 核对值和实际页面；输出一个带日期的新版本，保留上一版。
5. 同时维护变更记录、数据源文件名、对比说明。发布前检查是否包含真实敏感业务数据。

## 历史背景

2026-11-09、2026-11-16、2026-11-23 存在多版海外综合看板以及对应更新模板。源文件说明和访问限制见 [source-inventory](docs/source-inventory.md)。本仓库只归档可以安全公开的操作知识与脱敏样例，并非所有原始经营数据文件的镜像。
