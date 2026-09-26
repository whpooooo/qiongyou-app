param(
  [string]$Owner = 'whpooooo',
  [string]$Repository = 'qiongyou-app'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$git = 'D:\Git\cmd\git.exe'

$env:HTTP_PROXY = ''
$env:HTTPS_PROXY = ''
$env:ALL_PROXY = ''
$env:GIT_HTTP_PROXY = ''
$env:GIT_HTTPS_PROXY = ''

$clipboard = Get-Clipboard -Raw -ErrorAction SilentlyContinue
$token = if ($clipboard) { $clipboard.Trim() } else { '' }
if ($token -notmatch '^(gh[pousr]_[A-Za-z0-9_]+|github_pat_[A-Za-z0-9_]+)$') {
  throw '剪贴板中没有有效的 GitHub 令牌，请先重新复制令牌。'
}

$headers = @{
  Authorization = "Bearer $token"
  Accept = 'application/vnd.github+json'
  'User-Agent' = 'Qiongyou-PWA-Deploy'
}

function Invoke-GitHub {
  param(
    [string]$Method,
    [string]$Uri,
    [object]$Body
  )

  $attempt = 0
  while ($true) {
    $attempt += 1
    try {
      $params = @{
        Uri = $Uri
        Method = $Method
        Headers = $headers
        TimeoutSec = 60
      }
      if ($null -ne $Body) {
        $params.ContentType = 'application/json'
        $params.Body = ($Body | ConvertTo-Json -Depth 30 -Compress)
      }
      return Invoke-RestMethod @params
    } catch {
      if ($attempt -ge 3) { throw }
      Start-Sleep -Seconds (2 * $attempt)
    }
  }
}

try {
  $initialContent = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes('Qiongyou PWA initialization'))
  Invoke-GitHub -Method 'PUT' -Uri "https://api.github.com/repos/$Owner/$Repository/contents/.qiongyou-initialized" -Body @{
    message = 'chore: initialize repository'
    content = $initialContent
    branch = 'main'
  } | Out-Null

  $mainRef = Invoke-GitHub -Method 'GET' -Uri "https://api.github.com/repos/$Owner/$Repository/git/ref/heads/main" -Body $null
  $parentSha = $mainRef.object.sha

  $files = & $git -C $root ls-files
  if ($LASTEXITCODE -ne 0 -or -not $files) {
    throw '无法读取 Git 文件列表。'
  }

  Write-Output "Uploading $($files.Count) files to $Owner/$Repository..."
  $treeEntries = New-Object System.Collections.Generic.List[object]
  $index = 0

  foreach ($relativePath in $files) {
    $index += 1
    $fullPath = Join-Path $root ($relativePath.Replace('/', [IO.Path]::DirectorySeparatorChar))
    if (-not (Test-Path $fullPath -PathType Leaf)) { continue }

    $bytes = [IO.File]::ReadAllBytes($fullPath)
    $base64 = [Convert]::ToBase64String($bytes)
    $blob = Invoke-GitHub -Method 'POST' -Uri "https://api.github.com/repos/$Owner/$Repository/git/blobs" -Body @{
      content = $base64
      encoding = 'base64'
    }
    $treeEntries.Add(@{
      path = $relativePath
      mode = '100644'
      type = 'blob'
      sha = $blob.sha
    })
    Write-Output "[$index/$($files.Count)] $relativePath"
  }

  $tree = Invoke-GitHub -Method 'POST' -Uri "https://api.github.com/repos/$Owner/$Repository/git/trees" -Body @{
    tree = $treeEntries
  }

  $commit = Invoke-GitHub -Method 'POST' -Uri "https://api.github.com/repos/$Owner/$Repository/git/commits" -Body @{
    message = 'feat: deploy qiongyou PWA'
    tree = $tree.sha
    parents = @($parentSha)
  }

  Invoke-GitHub -Method 'PATCH' -Uri "https://api.github.com/repos/$Owner/$Repository/git/refs/heads/main" -Body @{
    sha = $commit.sha
    force = $false
  } | Out-Null

  $pagesBody = @{
    source = @{
      branch = 'main'
      path = '/'
    }
  }

  try {
    $pages = Invoke-GitHub -Method 'POST' -Uri "https://api.github.com/repos/$Owner/$Repository/pages" -Body $pagesBody
  } catch {
    $pages = Invoke-GitHub -Method 'PUT' -Uri "https://api.github.com/repos/$Owner/$Repository/pages" -Body $pagesBody
  }

  Start-Sleep -Seconds 5
  $status = Invoke-GitHub -Method 'GET' -Uri "https://api.github.com/repos/$Owner/$Repository/pages" -Body $null

  Write-Output "commit=$($commit.sha)"
  Write-Output "pages_status=$($status.status)"
  Write-Output "pages_url=$($status.html_url)"
} finally {
  $token = $null
  $clipboard = $null
  $headers = $null
}