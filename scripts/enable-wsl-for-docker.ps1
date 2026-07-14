$ErrorActionPreference = 'Continue'

Write-Host 'Enabling Windows Subsystem for Linux...'
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

Write-Host 'Enabling Virtual Machine Platform...'
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

Write-Host 'Installing/updating WSL package if winget is available...'
if (Get-Command winget.exe -ErrorAction SilentlyContinue) {
    winget.exe install --id Microsoft.WSL -e --accept-package-agreements --accept-source-agreements
}

Write-Host 'Trying WSL install without Linux distribution...'
wsl.exe --install --no-distribution
wsl.exe --set-default-version 2

Write-Host ''
Write-Host 'Done. Reboot Windows, then start Docker Desktop again.'
Read-Host 'Press Enter to close'
