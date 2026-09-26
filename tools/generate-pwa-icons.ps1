param(
  [string]$OutputDirectory = (Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\icons')
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

if (-not (Test-Path $OutputDirectory)) {
  New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
}

function New-QyIcon {
  param(
    [string]$Path,
    [int]$Size,
    [bool]$Maskable
  )

  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $bounds = New-Object System.Drawing.Rectangle(0, 0, $Size, $Size)
  $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $bounds,
    [System.Drawing.Color]::FromArgb(255, 255, 145, 66),
    [System.Drawing.Color]::FromArgb(255, 255, 74, 48),
    90
  )
  $graphics.FillRectangle($background, $bounds)

  $sunBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 255, 241, 166))
  $sunSize = [int]($Size * 0.19)
  $graphics.FillEllipse($sunBrush, [int]($Size * 0.64), [int]($Size * 0.17), $sunSize, $sunSize)

  $inset = if ($Maskable) { [int]($Size * 0.18) } else { [int]($Size * 0.08) }
  $farColor = [System.Drawing.Color]::FromArgb(255, 69, 105, 82)
  $farBrush = New-Object System.Drawing.SolidBrush($farColor)
  $farPoints = @(
    (New-Object System.Drawing.Point($inset, [int]($Size * 0.67))),
    (New-Object System.Drawing.Point([int]($Size * 0.34), [int]($Size * 0.39))),
    (New-Object System.Drawing.Point([int]($Size * 0.50), [int]($Size * 0.53))),
    (New-Object System.Drawing.Point([int]($Size * 0.68), [int]($Size * 0.32))),
    (New-Object System.Drawing.Point(($Size - $inset), [int]($Size * 0.64))),
    (New-Object System.Drawing.Point(($Size - $inset), $Size)),
    (New-Object System.Drawing.Point($inset, $Size))
  )
  $graphics.FillPolygon($farBrush, $farPoints)

  $nearBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 23, 52, 43))
  $nearPoints = @(
    (New-Object System.Drawing.Point($inset, [int]($Size * 0.76))),
    (New-Object System.Drawing.Point([int]($Size * 0.28), [int]($Size * 0.54))),
    (New-Object System.Drawing.Point([int]($Size * 0.48), [int]($Size * 0.72))),
    (New-Object System.Drawing.Point([int]($Size * 0.72), [int]($Size * 0.46))),
    (New-Object System.Drawing.Point(($Size - $inset), [int]($Size * 0.70))),
    (New-Object System.Drawing.Point(($Size - $inset), $Size)),
    (New-Object System.Drawing.Point($inset, $Size))
  )
  $graphics.FillPolygon($nearBrush, $nearPoints)

  $routePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 247, 201, 72), [Math]::Max(4, [int]($Size * 0.018)))
  $routePen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
  $routePoints = @(
    (New-Object System.Drawing.Point($inset, [int]($Size * 0.82))),
    (New-Object System.Drawing.Point([int]($Size * 0.38), [int]($Size * 0.72))),
    (New-Object System.Drawing.Point([int]($Size * 0.61), [int]($Size * 0.78))),
    (New-Object System.Drawing.Point(($Size - $inset), [int]($Size * 0.63)))
  )
  $graphics.DrawCurve($routePen, $routePoints)

  $dotBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 247, 218))
  $dotSize = [Math]::Max(5, [int]($Size * 0.025))
  foreach ($point in $routePoints) {
    $graphics.FillEllipse($dotBrush, $point.X - [int]($dotSize / 2), $point.Y - [int]($dotSize / 2), $dotSize, $dotSize)
  }

  $path = [System.IO.Path]::GetFullPath($Path)
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

  $dotBrush.Dispose()
  $routePen.Dispose()
  $nearBrush.Dispose()
  $farBrush.Dispose()
  $sunBrush.Dispose()
  $background.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

New-QyIcon -Path (Join-Path $OutputDirectory 'icon-192.png') -Size 192 -Maskable $false
New-QyIcon -Path (Join-Path $OutputDirectory 'icon-512.png') -Size 512 -Maskable $false
New-QyIcon -Path (Join-Path $OutputDirectory 'maskable-512.png') -Size 512 -Maskable $true
New-QyIcon -Path (Join-Path $OutputDirectory 'apple-touch-icon.png') -Size 180 -Maskable $false

Write-Output "Generated PWA icons in $OutputDirectory"