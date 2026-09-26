$ErrorActionPreference = 'Stop'
$gh = Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Microsoft\WinGet\Packages\GitHub.cli_*\bin\gh.exe') -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName

if (-not $gh) {
  Write-Host '未找到 GitHub CLI，请先安装 GitHub CLI。' -ForegroundColor Red
  Read-Host '按 Enter 关闭'
  exit 1
}

$env:HTTP_PROXY = ''
$env:HTTPS_PROXY = ''
$env:ALL_PROXY = ''
$env:GIT_HTTP_PROXY = ''
$env:GIT_HTTPS_PROXY = ''

Write-Host ''
Write-Host '请粘贴具有 repo 权限的 GitHub Personal Access Token。' -ForegroundColor Yellow
Write-Host '输入内容不会显示在屏幕上。' -ForegroundColor DarkGray
$secure = Read-Host 'GitHub Token' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)

try {
  $token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  if ([string]::IsNullOrWhiteSpace($token)) {
    throw '没有输入令牌'
  }
  $token | & $gh auth login --hostname github.com --git-protocol https --with-token
  if ($LASTEXITCODE -ne 0) {
    throw "GitHub 登录失败，退出码 $LASTEXITCODE"
  }
  Write-Host ''
  Write-Host 'GitHub 登录成功。你可以关闭此窗口，然后回到 Codex 继续。' -ForegroundColor Green
} finally {
  if ($pointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
  }
  $token = $null
}

Read-Host '按 Enter 关闭'