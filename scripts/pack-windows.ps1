# Builds a Windows folder users can unzip and double-click.
# Output: ../release/CrimsonLedger-windows.zip
# That zip is not part of the git project.
$ErrorActionPreference = 'Stop'

$app = Split-Path $PSScriptRoot -Parent
$release = Join-Path (Split-Path $app -Parent) 'release'
$cache = Join-Path $release 'cache'
$stage = Join-Path $release 'stage\CrimsonLedger'
$zip = Join-Path $release 'CrimsonLedger-windows.zip'
$nodeVersion = '24.12.0'
$nodeZip = Join-Path $cache "node-v$nodeVersion-win-x64.zip"
$nodeUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-win-x64.zip"

New-Item -ItemType Directory -Force -Path $cache | Out-Null
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stage | Out-Null

Write-Host "Building the journal pages..."
Push-Location $app
npm run build
if ($LASTEXITCODE -ne 0) { throw "The page build failed." }
Pop-Location

if (-not (Test-Path $nodeZip)) {
  Write-Host "Downloading Node.js $nodeVersion..."
  curl.exe -L --fail -o $nodeZip $nodeUrl
  if ($LASTEXITCODE -ne 0) { throw "Could not download Node.js." }
}

Write-Host "Packing the app..."
$nodeExtract = Join-Path $cache "node-v$nodeVersion-win-x64"
if (-not (Test-Path (Join-Path $nodeExtract 'node.exe'))) {
  if (Test-Path $nodeExtract) { Remove-Item $nodeExtract -Recurse -Force }
  tar.exe -xf $nodeZip -C $cache
}
New-Item -ItemType Directory -Force -Path (Join-Path $stage 'runtime') | Out-Null
Copy-Item (Join-Path $nodeExtract '*') (Join-Path $stage 'runtime') -Recurse

Copy-Item (Join-Path $app 'dist') (Join-Path $stage 'dist') -Recurse
New-Item -ItemType Directory -Force -Path (Join-Path $stage 'server') | Out-Null
Copy-Item (Join-Path $app 'server\index.js') (Join-Path $stage 'server\index.js')
Copy-Item (Join-Path $app 'server\db.js') (Join-Path $stage 'server\db.js')
New-Item -ItemType Directory -Force -Path (Join-Path $stage 'src\lib\journal') | Out-Null
Copy-Item (Join-Path $app 'src\lib\journal\constants.js') (Join-Path $stage 'src\lib\journal\constants.js')
New-Item -ItemType Directory -Force -Path (Join-Path $stage 'data\uploads') | Out-Null
New-Item -ItemType File -Force -Path (Join-Path $stage 'data\uploads\.gitkeep') | Out-Null

@'
{
  "name": "crimson-ledger",
  "private": true,
  "type": "module",
  "dependencies": {
    "express": "4.21.2",
    "multer": "1.4.5-lts.2"
  }
}
'@ | Set-Content -Path (Join-Path $stage 'package.json') -Encoding ascii

Push-Location $stage
npm install --omit=dev --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "Could not install the server libraries." }
Pop-Location

@'
Set shell = CreateObject("Wscript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
root = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = root
url = "http://127.0.0.1:3001/"

up = False
On Error Resume Next
Set http = CreateObject("MSXML2.XMLHTTP")
http.Open "GET", "http://127.0.0.1:3001/api/health", False
http.Send
If Err.Number = 0 Then
  If http.Status = 200 Then up = True
End If
On Error GoTo 0

If up Then
  shell.Run url, 1, False
Else
  cmd = """" & root & "\runtime\node.exe"" --disable-warning=ExperimentalWarning """ & root & "\server\index.js"" --serve-ui --desktop"
  shell.Run cmd, 0, False
End If
'@ | Set-Content -Path (Join-Path $stage 'Crimson Ledger.vbs') -Encoding ascii

@'
Crimson Ledger

1. Unzip this folder anywhere on the computer.
2. Double-click "Crimson Ledger.vbs".
3. The journal opens in your browser. No terminal window stays open.

You do not need to install Node.js.

Close the browser tab to stop the journal.
Click Crimson Ledger.vbs again when you want to open it.
Trades and screenshots are saved in the data folder beside this file.
Keep that folder if you move the app or install a newer copy.
'@ | Set-Content -Path (Join-Path $stage 'README.txt') -Encoding ascii

if (Test-Path $zip) { Remove-Item $zip -Force }
tar.exe -a -c -f $zip -C (Join-Path $release 'stage') CrimsonLedger
Write-Host "Wrote $zip"
