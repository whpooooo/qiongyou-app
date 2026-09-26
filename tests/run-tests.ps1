param(
  [string]$EdgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$testPage = Join-Path $PSScriptRoot 'test-runner.html'
$uri = [System.Uri]::new((Resolve-Path $testPage).Path).AbsoluteUri
$output = Join-Path $env:TEMP ('qy-tests-' + [guid]::NewGuid().ToString('N') + '.html')
$errorOutput = Join-Path $env:TEMP ('qy-tests-' + [guid]::NewGuid().ToString('N') + '.log')
$profile = Join-Path $env:TEMP ('qy-edge-' + [guid]::NewGuid().ToString('N'))

try {
  $arguments = @(
    '--headless=new',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--no-first-run',
    '--no-default-browser-check',
    '--force-device-scale-factor=1',
    '--window-size=520,1500',
    "--user-data-dir=$profile",
    '--dump-dom',
    $uri
  )
  $process = Start-Process -FilePath $EdgePath -ArgumentList $arguments -Wait -PassThru -WindowStyle Hidden -RedirectStandardOutput $output -RedirectStandardError $errorOutput
  $dom = Get-Content -Raw -Encoding UTF8 $output
  $summary = [regex]::Match($dom, 'TEST_RESULTS: PASS \d+ FAIL \d+').Value
  $failures = [regex]::Match($dom, '<pre id="test-failures">(?<body>.*?)</pre>', 'Singleline')
  if ($summary) { Write-Output $summary }
  if ($failures.Success) { Write-Output $failures.Groups['body'].Value }
  if ($process.ExitCode -ne 0 -or -not $summary -or $summary -notmatch 'FAIL 0') { exit 1 }
  exit 0
} finally {
  Remove-Item -LiteralPath $output, $errorOutput -ErrorAction SilentlyContinue
  $tempRoot = [System.IO.Path]::GetFullPath($env:TEMP).TrimEnd('\') + '\'
  $profileFull = [System.IO.Path]::GetFullPath($profile)
  if ($profileFull.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase) -and (Split-Path -Leaf $profileFull).StartsWith('qy-edge-')) {
    Remove-Item -LiteralPath $profileFull -Recurse -Force -ErrorAction SilentlyContinue
  }
}