# code Module Guide

`code` 用於產品程式碼規範、技術棧與遷移準則。

## Instructions
### 產品程式碼規則（Scoped: 原始碼目錄）
套用範圍：`MAS_Batch/**`, `MAS_Web/**`, `Mas_Library/**`, `MAS_Bst/**`, `MAS_Gov/**`, `MAS_DataBase/**`, `Packages/**`

- `code.tech-stack.instructions.md`
  - 用途：定義當前技術棧（.NET 8 / .NET 4.7 過渡期）、專案結構、程式碼風格。
- `code.migration-conventions.instructions.md`
  - 用途：定義 .NET 4.7 -> .NET 8 遷移慣例、禁止事項、輸出行為要求、必要的計畫先行流程。

## 使用情境
- 團隊需要統一命名、分層、程式風格時。
- 遷移實作過程中需要遵循一致規範與禁止事項時。

## 補充
本模組主要由 Instructions 自動套用，不以 slash command 為主；若要調整規範內容，請透過 `/copilot.maintain` 維護對應 instruction。
