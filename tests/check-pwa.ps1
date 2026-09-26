$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$failures = New-Object System.Collections.Generic.List[string]

function Add-Failure([string]$message) {
  $failures.Add($message)
}

$manifestPath = Join-Path $root 'manifest.webmanifest'
if (-not (Test-Path $manifestPath)) {
  Add-Failure '缺少 manifest.webmanifest'
} else {
  try {
    $manifest = Get-Content -Raw -Encoding UTF8 $manifestPath | ConvertFrom-Json
    if ($manifest.name -ne '下一站未知') { Add-Failure 'manifest.name 不正确' }
    if ($manifest.short_name -ne '下一站') { Add-Failure 'manifest.short_name 不正确' }
    if ($manifest.start_url -ne './index.html') { Add-Failure 'manifest.start_url 不正确' }
    if ($manifest.display -ne 'standalone') { Add-Failure 'manifest.display 应为 standalone' }
    if ($manifest.icons.Count -lt 3) { Add-Failure 'manifest 至少需要 3 个图标' }
  } catch {
    Add-Failure 'manifest.webmanifest 不是有效 JSON'
  }
}

$icons = @{
  'assets/icons/icon-192.png' = 192
  'assets/icons/icon-512.png' = 512
  'assets/icons/maskable-512.png' = 512
  'assets/icons/apple-touch-icon.png' = 180
}
Add-Type -AssemblyName System.Drawing
foreach ($entry in $icons.GetEnumerator()) {
  $path = Join-Path $root $entry.Key
  if (-not (Test-Path $path)) {
    Add-Failure "缺少图标 $($entry.Key)"
    continue
  }
  try {
    $image = [System.Drawing.Image]::FromFile($path)
    if ($image.Width -ne $entry.Value -or $image.Height -ne $entry.Value) {
      Add-Failure "$($entry.Key) 尺寸应为 $($entry.Value)x$($entry.Value)"
    }
    $image.Dispose()
  } catch {
    Add-Failure "$($entry.Key) 不是有效 PNG 图片"
  }
}

$indexPath = Join-Path $root 'index.html'
$index = if (Test-Path $indexPath) { Get-Content -Raw -Encoding UTF8 $indexPath } else { '' }
$metadataChecks = @(
  @{ Pattern = 'rel="manifest"'; Message = '缺少 manifest 链接' },
  @{ Pattern = 'apple-touch-icon'; Message = '缺少 apple-touch-icon' },
  @{ Pattern = 'mobile-web-app-capable'; Message = '缺少 mobile-web-app-capable' },
  @{ Pattern = 'apple-mobile-web-app-capable'; Message = '缺少 apple-mobile-web-app-capable' },
  @{ Pattern = 'apple-mobile-web-app-status-bar-style'; Message = '缺少 iOS 状态栏配置' }
)
foreach ($check in $metadataChecks) {
  if ($index -notmatch $check.Pattern) { Add-Failure $check.Message }
}

$serviceWorkerPath = Join-Path $root 'service-worker.js'
if (-not (Test-Path $serviceWorkerPath)) {
  Add-Failure '缺少 service-worker.js'
} else {
  $serviceWorker = Get-Content -Raw -Encoding UTF8 $serviceWorkerPath
  $requiredFiles = New-Object System.Collections.Generic.List[string]
  $requiredFiles.Add('index.html')
  $requiredFiles.Add('styles.css')
  $requiredFiles.Add('manifest.webmanifest')
  Get-ChildItem (Join-Path $root 'js') -Recurse -File | ForEach-Object {
    $requiredFiles.Add($_.FullName.Substring($root.Length + 1).Replace('\', '/'))
  }
  Get-ChildItem (Join-Path $root 'assets\images') -File | ForEach-Object {
    $requiredFiles.Add($_.FullName.Substring($root.Length + 1).Replace('\', '/'))
  }
  Get-ChildItem (Join-Path $root 'assets\icons') -File | ForEach-Object {
    $requiredFiles.Add($_.FullName.Substring($root.Length + 1).Replace('\', '/'))
  }
  foreach ($relativePath in $requiredFiles) {
    $needle = './' + $relativePath
    if ($serviceWorker -notmatch [regex]::Escape($needle)) {
      Add-Failure "Service Worker 未缓存 $relativePath"
    }
  }
}

$appPath = Join-Path $root 'js\app.js'
$appSource = if (Test-Path $appPath) { Get-Content -Raw -Encoding UTF8 $appPath } else { '' }
if ($appSource -notmatch 'serviceWorker\.register') {
  Add-Failure '应用没有注册 serviceWorker'
}

if ($failures.Count -gt 0) {
  Write-Output "PWA_CHECKS: FAIL $($failures.Count)"
  $failures | ForEach-Object { Write-Output "- $_" }
  exit 1
}

Write-Output 'PWA_CHECKS: PASS'