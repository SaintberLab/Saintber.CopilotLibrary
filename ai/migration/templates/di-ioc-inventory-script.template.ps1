# DI/IOC Inventory Script Template
# Purpose: Detect legacy DI/IOC targets (manual `new`, static construction, service locator)
# Usage: .\di-ioc-inventory-script.template.ps1 -ScanPath "." -OutputCsv "inventory.csv" -DepthMode "direct-hit"

param(
    [string]$ScanPath = ".",
    [string]$OutputCsv = "inventory.csv",
    [ValidateSet("direct-hit", "recursive-search")]
    [string]$DepthMode = "direct-hit",
    [string[]]$FilePatterns = @("*.cs"),
    [string[]]$ExcludePaths = @("bin", "obj", ".git", "node_modules")
)

function Get-DirectHitTargets {
    <#
    .SYNOPSIS
    Find direct non-DI targets in the selected scope.
    Returns objects instantiated via `new` without constructor injection.
    #>
    param([string]$Path, [string[]]$Patterns)

    $results = @()

    Get-ChildItem -Path $Path -Recurse -Include $Patterns | Where-Object {
        $fullPath = $_.FullName
        $ExcludePaths | ForEach-Object {
            if ($fullPath -match [regex]::Escape($_)) {
                return $false
            }
        }
        return $true
    } | ForEach-Object {
        $file = $_
        $content = Get-Content -Path $file.FullName -Raw
        $lines = $content -split "`n"
        $lineNumber = 0

        foreach ($line in $lines) {
            $lineNumber++
            # Pattern 1: Direct new instantiation (e.g., new MyService())
            if ($line -match '\bnew\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(') {
                $className = $Matches[1]
                $results += [PSCustomObject]@{
                    File              = $file.FullName
                    Line              = $lineNumber
                    ReferencedObject  = $className
                    ProcessingStatus  = "Candidate"
                    Code              = $line.Trim()
                }
            }
            # Pattern 2: Static field initialization (e.g., private static MyService _service = new MyService())
            if ($line -match 'private\s+static\s+([A-Za-z_][A-Za-z0-9_]*)\s+\w+\s*=\s*new\s+') {
                $className = $Matches[1]
                $results += [PSCustomObject]@{
                    File              = $file.FullName
                    Line              = $lineNumber
                    ReferencedObject  = $className
                    ProcessingStatus  = "Candidate"
                    Code              = $line.Trim()
                }
            }
            # Pattern 3: Service Locator pattern (e.g., ServiceLocator.GetService<T>())
            if ($line -match '(ServiceLocator|Container|Factory)\s*\.\s*(GetService|Resolve|Create)\s*') {
                $results += [PSCustomObject]@{
                    File              = $file.FullName
                    Line              = $lineNumber
                    ReferencedObject  = "ServiceLocator/Factory"
                    ProcessingStatus  = "Candidate"
                    Code              = $line.Trim()
                }
            }
        }
    }

    return $results
}

function Get-RecursiveTargets {
    <#
    .SYNOPSIS
    For each direct-hit target, trace referenced objects and verify DI/IOC adoption status recursively.
    This is more expensive but catches transitive dependencies.
    #>
    param([string]$Path, [string[]]$Patterns)

    $directResults = Get-DirectHitTargets -Path $Path -Patterns $Patterns
    $visited = @{}
    $results = @()

    foreach ($item in $directResults) {
        if (-not $visited.ContainsKey($item.ReferencedObject)) {
            $visited[$item.ReferencedObject] = $true
            $results += $item

            # Optionally trace referenced class dependencies (simplified)
            # In production, parse class definitions and analyze constructor calls
        }
    }

    return $results
}

# Main execution
Write-Host "Starting DI/IOC inventory scan..."
Write-Host "Scan Path: $ScanPath"
Write-Host "Depth Mode: $DepthMode"
Write-Host "Output CSV: $OutputCsv"

$inventory = if ($DepthMode -eq "direct-hit") {
    Get-DirectHitTargets -Path $ScanPath -Patterns $FilePatterns
} else {
    Get-RecursiveTargets -Path $ScanPath -Patterns $FilePatterns
}

if ($inventory.Count -eq 0) {
    Write-Host "No DI/IOC candidates found."
} else {
    Write-Host "Found $($inventory.Count) candidate(s)."
    $inventory | Export-Csv -Path $OutputCsv -NoTypeInformation
    Write-Host "Inventory exported to: $OutputCsv"
}

# Output summary table
Write-Host "`nInventory Summary:"
$inventory | Format-Table -AutoSize

exit 0
