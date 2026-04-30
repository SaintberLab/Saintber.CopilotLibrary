# DI/IOC Adoption Workflow Guide

## 快速開始

本指南說明如何使用 migration 模組的 DI/IOC 導入工具鏈，將 legacy 專案逐步導入依賴注入（DI/IOC）。

---

## 工作流程概覽

```
1. 參數確認
   ↓
2. 執行盤點 Script
   ↓
3. 驗證盤點品質（雙向抽樣複檢）
   ↓
4. 分批導入 DI/IOC
   ↓
5. 最終驗證（Build + 可選 Smoke Tests）
   ↓
6. 產出釐清文件（若有待釐清項目）
```

---

## 第 1 步：確認參數

在執行盤點前，確認以下參數：

### 必填參數
- **`scan_scope`** (required): 要掃描的檔案/資料夾/模組  
  範例: `MAS_Web/Controllers`, `Mas_Library/Services`
  
- **`modify_scope`** (required): 允許修改的範圍（通常同 scan_scope）  
  範例: `MAS_Web/Controllers`, `Mas_Library`

### 可選參數
- **`depth_mode`** (default: `direct-hit`):
  - `direct-hit`: 只盤點指定範圍內的非 DI 目標
  - `recursive-search`: 遞迴追蹤參考物件，直到沒有新參考
  
- **`validation_mode`** (default: `build-only`):
  - `build-only`: 導入後只做 build 驗證
  - `build-and-smoke`: 導入後做 build + runtime smoke tests

- **`partition_strategy`** (default: `by folder/module`):
  若需 AI 輔助掃描，指定分區規則避免 context 過大

- **`sample_size_table`** / **`sample_size_source`** (optional):
  複檢時的抽樣數量（預設 10-15 件）

---

## 第 2 步：執行盤點

### 2a. 使用 PowerShell Script 盤點（推薦）

獲取樣板腳本：
```powershell
# 從 npm 安裝的 copilot-library
Copy-Item ".\templates\migration\scripts\di-ioc-inventory-script.template.ps1" `
          ".\MAS_Web\di-ioc-inventory.ps1"
```

執行盤點：
```powershell
cd MAS_Web
.\di-ioc-inventory.ps1 `
  -ScanPath "Controllers" `
  -OutputCsv "di-ioc-inventory.csv" `
  -DepthMode "direct-hit" `
  -FilePatterns "*.cs"
```

預期輸出：
- `di-ioc-inventory.csv` - 盤點結果表
- 控制台摘要 - 找到的候選數量

### 2b. 使用 `/migration.adopt-di-ioc` Prompt

若 script 精準度不足或需要 AI 輔助：
```
/migration.adopt-di-ioc
scan_scope: MAS_Web/Controllers
modify_scope: MAS_Web/Controllers
depth_mode: direct-hit
validation_mode: build-only
```

---

## 第 3 步：雙向抽樣複檢

### 複檢 1：盤點表抽樣（檢查誤判）

從產出的 CSV 中隨機抽 10-15 個項目，檢查：
- 該項目是否真的是 DI/IOC 候選？（ProcessingStatus 應為 `Candidate`）
- Code 欄位是否正確反映實際程式碼？
- 是否有誤判（如既有 DI 項目被列為 Candidate）？

若發現誤判，更新 script，重新執行盤點。

### 複檢 2：原始碼抽樣（檢查漏判）

在 `scan_scope` 內隨機抽 5-10 個 C# 檔案，手動掃描：
- 是否有 `new` 實例化未被列入？
- 是否有 static factory / service locator 模式未被列入？
- 是否有隱藏的 DI 實例化（如 reflection、factory method）？

若發現漏判，改善 script pattern，重新執行盤點。

---

## 第 4 步：分批導入 DI/IOC

### 分批策略

將盤點結果按以下優先順序分批：

1. **第一批**：單純的 `new` 實例化，無複雜相依
   - 直接改為 constructor injection
   - 在 DI 容器（如 IServiceCollection）註冊服務

2. **第二批**：有複雜相依的 `new`
   - 建立 factory interface
   - 註冊 factory 至 DI 容器

3. **第三批**：靜態欄位初始化
   - 改為 lazy initialization + DI
   - 或保留靜態，並文件化理由

4. **第四批**：Service Locator 模式
   - 完全移除 ServiceLocator 呼叫
   - 改為 constructor injection 或 factory

### 每批實作步驟

```
1. 選擇一批候選項目（例如第一批）
2. 建立新的 branch（如 `feat/di-ioc-batch1`）
3. 針對每個項目：
   a. 修改目標類別加入 constructor parameter
   b. 更新所有呼叫端傳入依賴
   c. 在 DI 容器註冊服務
   d. 跑 unit tests 確認行為不變
4. 提交 PR 並進行 code review
5. 合併至主線
```

### 範例：直接 `new` 改為 Constructor Injection

**Before:**
```csharp
public class OrderService
{
    private ILogger _logger = new Logger();
    private IDatabase _db = new Database();

    public void ProcessOrder(int orderId) { ... }
}
```

**After:**
```csharp
public class OrderService
{
    private readonly ILogger _logger;
    private readonly IDatabase _db;

    public OrderService(ILogger logger, IDatabase db)
    {
        _logger = logger;
        _db = db;
    }

    public void ProcessOrder(int orderId) { ... }
}
```

**DI 容器註冊** (in Startup.cs or Program.cs):
```csharp
services.AddScoped<ILogger, Logger>();
services.AddScoped<IDatabase, Database>();
services.AddScoped<OrderService>();
```

---

## 第 5 步：最終驗證

### Build 驗證
```bash
dotnet build
```

預期：無編譯錯誤。

### Smoke Tests（可選）
```bash
dotnet test --filter "Category=Smoke"
```

預期：所有 smoke tests 通過。

### 手動功能驗證（可選）
1. 在本地執行應用程式
2. 測試主要功能流程
3. 驗證日誌、快取等基礎設施功能正常

---

## 第 6 步：Pending Clarification 項目

若盤點過程中有無法自動判斷的項目，將被標記為 `Pending Clarification`。

### 處理步驟

1. **生成問題釐清文件**：
   複製 [templates/migration/docs/di-ioc-clarification-template.md](./di-ioc-clarification-template.md)  
   填入待釐清的項目

2. **開發人員回覆**：
   領域專家回答每個項目的澄清問題，決定重構策略

3. **AI 補充建議**：
   根據開發人員回覆，AI 提出具體重構方案

4. **實施與驗證**：
   按方案執行重構，然後進入第 5 步驗證

---

## CSV 欄位說明

盤點輸出 CSV 包含以下欄位：

| 欄位 | 說明 | 範例 |
|---|---|---|
| `File` | 檔案路徑 | `MAS_Web/Controllers/OrderController.cs` |
| `Line` | 行號 | `42` |
| `ReferencedObject` | 參考物件名稱 | `OrderService` |
| `ProcessingStatus` | 處理狀態 | `Candidate` / `Pending Clarification` |
| `Code` | 程式碼片段 | `new OrderService()` |

### ProcessingStatus 標準值

- `Candidate`: 已驗證的 DI/IOC 候選項目
- `FalsePositive`: 誤判（實際已採 DI）
- `MissingCandidate`: 漏判（應該列入但未列）
- `ReadyForRefactor`: 已通過複檢，可進行重構
- `InProgress`: 正在進行重構
- `Pending Clarification`: 需要開發人員澄清
- `Completed`: 已完成重構並驗證

---

## 常見問題

**Q: 如果某個 new 是在 factory 類別內，還需要改嗎？**  
A: 通常需要。即使在 factory 內，也應該透過 DI 注入 factory 的依賴，而非 factory 內部 new。

**Q: 靜態欄位的 new 能否保留？**  
A: 盡量避免。若確實必要（如 singleton 工具類），需文件化理由，並在 Pending Clarification 列出。

**Q: 導入 DI 會影響性能嗎？**  
A: 一般不會。constructor injection 的開銷極小。使用 service locator 或 reflection 的舊做法反而可能更慢。

**Q: 可以只改部分模組嗎？**  
A: 可以。DI/IOC 導入可以逐步進行。使用 `scan_scope` / `modify_scope` 參數限制範圍即可。

---

## 參考資料

- migration Prompts: `/migration.adopt-di-ioc`, `/migration.analyze-legacy-solution`
- migration Skills: `migration.di-ioc-adoption`
- Agents: `migration.dotnet-modernizer`, `migration.reviewer`
- [Microsoft.Extensions.DependencyInjection 官方文檔](https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.dependencyinjection)

---

## 支援與反饋

若遇到問題或需要改進建議，請：
1. 在 `/migration.adopt-di-ioc` 或對應 agent 中詳細描述問題
2. 附上實際盤點結果與錯誤訊息
3. 提供目標專案的技術背景（.NET Framework 版本、現有 DI 方案等）
