---
description: MAS_2026 產品程式碼的技術棧、專案結構與程式碼風格慣例。
applyTo: "MAS_Batch/**,MAS_Web/**,Mas_Library/**,MAS_Bst/**,MAS_Gov/**,MAS_DataBase/**,Packages/**"
---

# Purpose
Provide Copilot with the current technology stack, project structure, and code style facts so it can generate contextually accurate code when working on product source files.

# Active Technologies
- C# / .NET 9（新架構後端：Pic.Mas.* 專案群）+ .NET Framework 4.7（過渡期 PL 層：PIC.MAS.WEB, PIC.MAS.BIZLIBRARY）(001-poc-sit-test)
- ASP.NET MVC（PIC.MAS.WEB，過渡期 Controller/View）+ Pic.Mas.Bll.Abstractions, Pic.Mas.Bll, Pic.Mas.InfraStructure.Abstractions, Pic.Mas.Infrastructure（新架構後端層）(001-poc-sit-test)
- MasDbContext（Pic.Mas.Persistence.EF.SqlServer）、StackExchange.Redis、Google.Cloud.Storage.V1、FluentFTP、SSH.NET、System.Net.Http、System.ServiceModel（SOAP）、System.Net.Mail (001-poc-sit-test)
- DBCMManager（過渡期系統參數存取，透過 ConfigurationRepository 包裝）(001-poc-sit-test)
- C#（.NET Framework 4.7 + .NET 8/9 過渡） + `Microsoft.Extensions.Logging`、Serilog、Entity Framework Core、NLog（舊系統相容） (002-project-logging)
- PostgreSQL、SQL Server、File、Seq、GCP Cloud Logging (002-project-logging)
- .NET 9（`Pic.Mas.Pl.Web`）+ .NET 4.7.2（`PIC.MAS.WEB`、`MAS_Batch`，過渡期橋接） + `Microsoft.Extensions.Logging`（ILogger 抽象層）、Serilog、`Serilog.Extensions.Logging`、ADO.NET（DB Sink 直寫） (002-project-logging)
- PostgreSQL（`masdb` schema，目標）+ SQL Server（過渡期並存）；Log 資料表：`masdb.core_log`、`masdb.ad_job_log`、`masdb.ad_trace_log` (002-project-logging)

# Project Structure

```text
MAS_Batch/       — 批次作業專案群（.NET Framework 4.7）
MAS_Web/         — Web 前端（過渡期）
Mas_Library/     — 新架構共用程式庫（Pic.Mas.* .NET 9）
MAS_Bst/         — 基礎設施服務群
MAS_Gov/         — 治理相關服務
MAS_DataBase/    — 資料庫專案
Packages/        — NuGet 套件
```

# Code Style
- C# / .NET Framework 4.7（既有 PIC.MAS.BatchApi 專案）: Follow standard conventions

# Recent Changes
- 002-project-logging: Added .NET 9（`Pic.Mas.Pl.Web`）+ .NET 4.7.2（`PIC.MAS.WEB`、`MAS_Batch`，過渡期橋接） + `Microsoft.Extensions.Logging`（ILogger 抽象層）、Serilog、`Serilog.Extensions.Logging`、ADO.NET（DB Sink 直寫）
- 002-project-logging: Added C#（.NET Framework 4.7 + .NET 8/9 過渡） + `Microsoft.Extensions.Logging`、Serilog、Entity Framework Core、NLog（舊系統相容）
- 001-poc-sit-test: Updated to new Pic.Mas.* architecture (C# / .NET 9) — BLL/InfraStructure/DAL in Mas_Library/ new arch projects; Controller stays in PIC.MAS.WEB (transition period)
