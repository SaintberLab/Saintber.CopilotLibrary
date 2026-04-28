# speckit Module Guide

`speckit` 用於微軟官方維運基線管理（保留上游基線並支援客製覆蓋重套）。

## 主要用途
- 上游基線：`ai/composed/zh-TW/speckit-backup/`
- 覆蓋工具：`/copilot.apply-speckit-customizations`
- 執行角色：`copilot.speckit-customizer`

## 使用情境
- Speckit 上游版本升級後，將既有客製需求重套至新版本。
- 需要保持上游可更新性，同時保留專案客製規範。

## 使用案例
### 案例：套用 Speckit 客製 overlay
```text
/copilot.apply-speckit-customizations
<貼上你希望保留的客製需求>
```

## 注意事項
- 優先保留上游相容性。
- 客製需求應以 overlay 疊加，避免直接破壞上游基線結構。
