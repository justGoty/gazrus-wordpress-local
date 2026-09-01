[CmdletBinding()]
param(
    [switch]$SkipWeb
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
$requiredDocs = @(
    'COLLEAGUE_ONBOARDING.md',
    'docs/rebuild/OWNER_DECISIONS.md',
    'docs/rebuild/FILTER_MATRIX.md',
    'docs/rebuild/CATALOG_CONTRACT.md',
    'docs/rebuild/LEAD_DELIVERY.md',
    'docs/rebuild/SEO_PAGE_MAP.md',
    'docs/rebuild/SEO_SEMANTIC_CORE.md',
    'docs/rebuild/SEO_CONTENT_STANDARD.md',
    'docs/rebuild/SEO_IMPLEMENTATION.md',
    'docs/rebuild/GAS_CONVERTER_IMPLEMENTATION.md',
    'docs/rebuild/SEO_WEBMASTER_REMEDIATION.md',
    'docs/rebuild/TECH_ARCHITECTURE.md'
)

function Assert-LastExitCode([string]$Step) {
    if ($LASTEXITCODE -ne 0) {
        throw "$Step failed with exit code $LASTEXITCODE"
    }
}

Push-Location $repoRoot
try {
    Write-Host '[1/4] Checking Git diff and forbidden files'
    & git diff --check HEAD --
    Assert-LastExitCode 'git diff --check'

    $trackedFiles = @(& git ls-files)
    Assert-LastExitCode 'git ls-files'

    $forbiddenFiles = @(foreach ($file in $trackedFiles) {
        $normalized = $file.Replace('\', '/')
        $isPrivateEnvironment = $normalized -match '(^|/)\.env($|\.)' -and $normalized -notmatch '\.env\.example$'
        $isPrivateDirectory = $normalized -match '(^|/)(backup|db|output)/'
        $isArchiveOrDump = $normalized -match '\.(sql|sql\.gz|zip|tar|tar\.gz)$'

        if ($isPrivateEnvironment -or $isPrivateDirectory -or $isArchiveOrDump) {
            $file
        }
    })

    if ($forbiddenFiles.Count -gt 0) {
        throw "Forbidden files are tracked:`n$($forbiddenFiles -join "`n")"
    }

    Write-Host '[2/4] Checking required docs and local Markdown links'
    foreach ($requiredDoc in $requiredDocs) {
        if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $requiredDoc))) {
            throw "Required document is missing: $requiredDoc"
        }
    }

    $missingLinks = [System.Collections.Generic.List[string]]::new()
    $markdownFiles = $trackedFiles | Where-Object { $_ -like '*.md' }

    foreach ($markdownFile in $markdownFiles) {
        $absoluteMarkdownPath = Join-Path $repoRoot $markdownFile
        $content = Get-Content -LiteralPath $absoluteMarkdownPath -Raw -Encoding utf8
        $matches = [regex]::Matches($content, '!?' + '\[[^\]]*\]\((?<target>[^)]+)\)')

        foreach ($match in $matches) {
            $target = $match.Groups['target'].Value.Trim().Trim('<', '>')
            if ($target -match '^(https?://|mailto:|#)' -or [string]::IsNullOrWhiteSpace($target)) {
                continue
            }

            $pathPart = [System.Uri]::UnescapeDataString(($target -split '#', 2)[0])
            if ([string]::IsNullOrWhiteSpace($pathPart)) {
                continue
            }

            $markdownDirectory = Split-Path -Parent $absoluteMarkdownPath
            $resolvedPath = [System.IO.Path]::GetFullPath((Join-Path $markdownDirectory $pathPart))
            if (-not (Test-Path -LiteralPath $resolvedPath)) {
                $missingLinks.Add("$markdownFile -> $target")
            }
        }
    }

    if ($missingLinks.Count -gt 0) {
        throw "Missing local Markdown links:`n$($missingLinks -join "`n")"
    }

    Write-Host '[3/4] Checking the new application structure'
    foreach ($path in @('web/package.json', 'web/pnpm-lock.yaml', 'web/content/catalog', 'web/content/seo', 'web/public/robots.txt', 'web/src/app')) {
        if (-not (Test-Path -LiteralPath (Join-Path $repoRoot $path))) {
            throw "Required path is missing: $path"
        }
    }

    $productSeoRows = @(Get-ChildItem -LiteralPath (Join-Path $repoRoot 'web/content/catalog/products') -Filter '*.json' | ForEach-Object {
        $product = Get-Content -LiteralPath $_.FullName -Raw -Encoding utf8 | ConvertFrom-Json
        [pscustomobject]@{
            File = $_.Name
            Title = $product.seo.title.Trim().ToLowerInvariant()
            Description = $product.seo.description.Trim().ToLowerInvariant()
        }
    })

    foreach ($field in @('Title', 'Description')) {
        $duplicates = @($productSeoRows | Group-Object -Property $field | Where-Object { $_.Count -gt 1 })
        if ($duplicates.Count -gt 0) {
            $details = $duplicates | ForEach-Object { "$field duplicate: $($_.Group.File -join ', ')" }
            throw "Duplicate product SEO fields:`n$($details -join "`n")"
        }
    }

    if (-not $SkipWeb) {
        Write-Host '[4/4] Running converter tests, lint and production build'
        $pnpm = Get-Command pnpm -ErrorAction SilentlyContinue
        if (-not $pnpm) {
            throw 'pnpm was not found in PATH. Install pnpm 11.9.0 or use the configured Codex runtime.'
        }

        Push-Location (Join-Path $repoRoot 'web')
        try {
            & $pnpm.Source 'test:converter'
            Assert-LastExitCode 'pnpm test:converter'
            & $pnpm.Source lint
            Assert-LastExitCode 'pnpm lint'
            & $pnpm.Source build
            Assert-LastExitCode 'pnpm build'
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Host '[4/4] Web checks skipped by -SkipWeb'
    }

    Write-Host 'All checks passed.' -ForegroundColor Green
}
finally {
    Pop-Location
}
