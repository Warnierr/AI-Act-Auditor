param (
    [string]$Name = "nouveau-bug"
)

$Year = Get-Date -Format "yyyy"
$MonthNum = Get-Date -Format "MM"
$MonthName = Get-Date -Format "MMMM"
$Day = Get-Date -Format "yyyy-MM-dd"

$TargetDir = "archive/$Year/$MonthNum-$MonthName"
$FileName = "$Day`_$Name.md"
$FullPath = Join-Path $TargetDir $FileName

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force
}

if (Test-Path $FullPath) {
    Write-Host "⚠️ Le fichier $FullPath existe déjà." -ForegroundColor Yellow
} else {
    Copy-Item "templates/bug-template.md" $FullPath
    
    # Remplacer {{date}} par la date du jour
    $Content = Get-Content $FullPath
    $Content = $Content -replace '\{\{date\}\}', $Day
    $Content | Set-Content $FullPath
    
    Write-Host "✅ Nouveau bug archivé : $FullPath" -ForegroundColor Green
}
