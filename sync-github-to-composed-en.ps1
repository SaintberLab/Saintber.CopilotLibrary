# Sync all artifacts from .github/ to ai/composed/en/
# This script copies any missing files and creates required directory structure

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$githubDir = Join-Path $repoRoot ".github"
$composedEnDir = Join-Path $repoRoot "ai/composed/en"

# Artifact types to process
$artifactTypes = @("instructions", "agents", "prompts", "skills", "scripts", "docs")

# Mapping of .github files to module/type paths
# Pattern: .github/[type]/[namespace].[artifact-name].[type].md
# -> ai/composed/en/[module]/[type]/[namespace].[artifact-name].[type].md

$filesProcessed = 0
$filesCopied = 0
$fileExists = 0

Write-Host "🔄 Starting sync from .github/ to ai/composed/en/" -ForegroundColor Cyan

# Process each artifact type directory
foreach ($type in $artifactTypes) {
    $typeDir = Join-Path $githubDir $type
    
    if (-not (Test-Path $typeDir)) {
        Write-Host "⏭️  Directory not found: $typeDir" -ForegroundColor Yellow
        continue
    }
    
    # Get all markdown files in this type directory
    $files = Get-ChildItem -Path $typeDir -Name "*.md" -ErrorAction SilentlyContinue
    
    if ($null -eq $files) {
        continue
    }
    
    # Ensure it's iterable (single file returns string, multiple return array)
    if ($files -is [string]) {
        $files = @($files)
    }
    
    foreach ($file in $files) {
        $filesProcessed++
        $sourceFile = Join-Path $typeDir $file
        
        # Extract module from filename
        # Format: namespace.name.type.md or namespace.subnamespace.name.type.md
        $nameParts = $file -split '\.'
        
        # Determine module from namespace
        $namespace = $nameParts[0]
        $module = switch -Regex ($namespace) {
            "^code" { "code"; break }
            "^copilot" { "copilot"; break }
            "^docs" { "docs"; break }
            "^kb" { "kb"; break }
            "^migration" { "migration"; break }
            "^speckit" { "speckit"; break }
            default { "unknown" }
        }
        
        if ($module -eq "unknown") {
            Write-Host "⚠️  Unknown module for: $file" -ForegroundColor Yellow
            continue
        }
        
        # Construct target path
        $targetTypeDir = Join-Path $composedEnDir "$module/$type"
        $targetFile = Join-Path $targetTypeDir $file
        
        # Create directory if it doesn't exist
        if (-not (Test-Path $targetTypeDir)) {
            New-Item -ItemType Directory -Path $targetTypeDir -Force | Out-Null
            Write-Host "📁 Created directory: $targetTypeDir" -ForegroundColor Green
        }
        
        # Copy file if it doesn't exist
        if (-not (Test-Path $targetFile)) {
            Copy-Item -Path $sourceFile -Destination $targetFile -Force
            $filesCopied++
            Write-Host "✅ Copied: $file → $module/$type/" -ForegroundColor Green
        } else {
            $fileExists++
            # Optional: Uncomment to verify content match
            # $sourceContent = Get-Content -Path $sourceFile -Raw
            # $targetContent = Get-Content -Path $targetFile -Raw
            # if ($sourceContent -ne $targetContent) {
            #     Write-Host "⚠️  Content mismatch: $file (needs update)" -ForegroundColor Yellow
            # }
        }
    }
}

Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   Total files scanned:  $filesProcessed"
Write-Host "   Files copied:         $filesCopied"
Write-Host "   Files already exist:  $fileExists"
Write-Host ""
Write-Host "✨ Sync complete!" -ForegroundColor Green
