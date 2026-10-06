New-Item -ItemType Directory -Force -Path "$PSScriptRoot\..\assets" | Out-Null
Add-Type -AssemblyName System.Drawing

function Save-Icon {
  param([string]$Path, [int]$R, [int]$G, [int]$B)
  $bmp = New-Object Drawing.Bitmap 81, 81
  $gr = [Drawing.Graphics]::FromImage($bmp)
  $gr.SmoothingMode = 'AntiAlias'
  $gr.Clear([Drawing.Color]::FromArgb(255, $R, $G, $B))
  $brush = New-Object Drawing.SolidBrush ([Drawing.Color]::White)
  $gr.FillEllipse($brush, 20, 20, 41, 41)
  $bmp.Save($Path, [Drawing.Imaging.ImageFormat]::Png)
  $gr.Dispose()
  $bmp.Dispose()
}

$root = Join-Path $PSScriptRoot '..'
Save-Icon (Join-Path $root 'assets\tab-home.png') 153 153 153
Save-Icon (Join-Path $root 'assets\tab-home-active.png') 7 193 96
Save-Icon (Join-Path $root 'assets\tab-chat.png') 153 153 153
Save-Icon (Join-Path $root 'assets\tab-chat-active.png') 7 193 96
Save-Icon (Join-Path $root 'assets\tab-mine.png') 153 153 153
Save-Icon (Join-Path $root 'assets\tab-mine-active.png') 7 193 96
Write-Host 'OK'
