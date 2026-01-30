# ==========================================
# PowerShell Deployment Script (Safe Version)
# ==========================================

SERVER= '服务器地址' # "root@47.86.87.137"
REMOTE_PATH= '部署路径' # "/www/taotao/web/"
$ZIP_NAME = "dist.zip"
$LOCAL_DIST = "dist"

Write-Host "[1/5] Starting deployment..." -ForegroundColor Green

# 1. Check local dist
if (-not (Test-Path $LOCAL_DIST)) {
    Write-Host "Error: Local $LOCAL_DIST directory not found!" -ForegroundColor Red
    exit
}

# 2. Compress
Write-Host "[2/5] Compressing $LOCAL_DIST..." -ForegroundColor Green
if (Test-Path $ZIP_NAME) { 
    Remove-Item $ZIP_NAME -Force 
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($LOCAL_DIST, $ZIP_NAME)

# 3. Upload
Write-Host "[3/5] Uploading $ZIP_NAME..." -ForegroundColor Green
scp $ZIP_NAME "$($SERVER):$($REMOTE_PATH)"

# 4. Remote extract
Write-Host "[4/5] Extracting on server into 'dist' folder..." -ForegroundColor Green
# Create dist folder if not exists, and extract contents into it
$remoteCmd = "cd $REMOTE_PATH ; rm -rf dist ; mkdir -p dist ; unzip -o $ZIP_NAME -d dist ; rm $ZIP_NAME"
ssh $SERVER $remoteCmd

# 5. Cleanup
Write-Host "[5/5] Cleaning up..." -ForegroundColor Green
if (Test-Path $ZIP_NAME) {
    Remove-Item $ZIP_NAME -Force
}

Write-Host "--------------------------------" -ForegroundColor Green
Write-Host "      Deployment Successful!    " -ForegroundColor Green
Write-Host "--------------------------------" -ForegroundColor Green
