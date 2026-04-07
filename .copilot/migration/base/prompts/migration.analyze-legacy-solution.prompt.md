---
description: 分析舊版 .NET Framework MVC solution 並產出遷移待辦清單。
agent: migration.solution-architect
---

Analyze the selected solution/module for migration from .NET Framework 4.7 ASP.NET MVC to .NET 8 ASP.NET Core MVC.

Produce:
1. current architecture summary
2. dependency hotspots
3. migration blockers
4. recommended migration phases
5. module-level backlog
6. key risks and validation strategy

Assume:
- frontend uses MVC + Kendo UI
- backend database moves from SQL Server to PostgreSQL
- new platform includes Redis, Seq, Cloud Logging, and GCS

Be concrete at project/folder/module level.
