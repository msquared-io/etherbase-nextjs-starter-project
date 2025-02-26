param(
    [switch]$cleanInstall = $false
)

# Function to log messages with timestamp
function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message"
}

# if clean install, call uninstall_nvm.ps1
if ($cleanInstall) {
    & "$PSScriptRoot\uninstall_nvm.ps1"
}

$minimumNodeVersion = "18.18.0"
$desiredNodeVersion = "22.14.0"

$nodeNotInstalled = $false
$nodeTooOld = $false

# first check if node is installed by checking which node
$nodePath = Get-Command -Name node -ErrorAction SilentlyContinue
if ($null -eq $nodePath) {
    $nodeNotInstalled = $true
} else {
    $nodeVersion = node -v
    $nodeVersion = $nodeVersion.Substring(1)
    Write-Log "Node.js version $nodeVersion is installed, the minimum required version is $minimumNodeVersion."
    if ($nodeVersion -lt $minimumNodeVersion) {
        Write-Log "Node.js version $nodeVersion is less than the minimum required version $minimumNodeVersion."
        $nodeTooOld = $true
    }
}

$nvmPath = Get-Command -Name nvm -ErrorAction SilentlyContinue
if ($null -eq $nvmPath) {
    if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
        Write-Log "Error: This script needs to be run as Administrator. Please restart with elevated privileges."
        exit 1
    }
    try {
        Write-Log "Downloading NVM no-install package..."
        # Define installation directories
        $nvmHome = Join-Path "${env:APPDATA}" "nvm"
        $nvmSymlink = Join-Path "${env:ProgramFiles}" "nodejs"
        
        # Download and extract no-install package
        $zipPath = Join-Path $env:TEMP "nvm-noinstall.zip"
        Invoke-WebRequest -Uri "https://github.com/coreybutler/nvm-windows/releases/latest/download/nvm-noinstall.zip" -OutFile $zipPath
        
        # Create NVM directory if it doesn't exist
        if (-not (Test-Path $nvmHome)) {
            New-Item -ItemType Directory -Path $nvmHome -Force
        }
        
        # Extract the zip
        Write-Log "Extracting NVM to $nvmHome..."
        Expand-Archive -Path $zipPath -DestinationPath $nvmHome -Force
        
        # Create settings.txt
        $settingsContent = @"
root: $([System.IO.Path]::GetFullPath($nvmHome).Replace('\', '/'))
path: $([System.IO.Path]::GetFullPath($nvmSymlink).Replace('\', '/'))
proxy: none
arch: 64
"@
        $settingsContent | Out-File -FilePath (Join-Path $nvmHome "settings.txt") -Encoding UTF8 -Force
        
        # Set environment variables
        Write-Log "Setting environment variables..."
        [System.Environment]::SetEnvironmentVariable("NVM_HOME", $nvmHome, [System.EnvironmentVariableTarget]::Machine)
        [System.Environment]::SetEnvironmentVariable("NVM_SYMLINK", $nvmSymlink, [System.EnvironmentVariableTarget]::Machine)
        
        # Update PATH
        $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
        $newPath = "$currentPath;$nvmHome;$nvmSymlink"
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::Machine)
        
        # Update current session's PATH
        $env:NVM_HOME = $nvmHome
        $env:NVM_SYMLINK = $nvmSymlink
        $env:Path = "$env:Path;$nvmHome;$nvmSymlink"
        
        # Cleanup
        Remove-Item -Path $zipPath -Force
        
        # Verify installation
        $nvmVersion = nvm version
        if ($LASTEXITCODE -eq 0) {
            Write-Log "NVM installed successfully. Version: $nvmVersion"
        } else {
            throw "NVM installation verification failed"
        }
        
    } catch {
        Write-Log "Error: $($_.Exception.Message)"
        exit 1
    }
}

if ($nodeTooOld -or $nodeNotInstalled -or $nvmNotInstalled) {
    try {
        # Install and use node
        Write-Log "Installing Node.js $desiredNodeVersion version..."
        Write-Log "NVM install directory: $env:NVM_HOME"
        Write-Log "NVM symlink directory: $env:NVM_SYMLINK"
        
        
        # Install and use Node.js
        Write-Log "Installing Node.js..."
        nvm root $env:NVM_HOME
        nvm install $desiredNodeVersion
        if ($LASTEXITCODE -ne 0) {
            throw "Node.js $desiredNodeVersion installation failed"
        }
        
        Write-Log "Switching to Node.js $desiredNodeVersion..."
        nvm use $desiredNodeVersion
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to switch to Node.js $desiredNodeVersion"
        }
        
        # Verify Node.js installation
        $nodeVersion = node -v
        Write-Log "Node.js version $nodeVersion installed successfully"
        
    } catch {
        Write-Log "Error: $($_.Exception.Message)"
        exit 1
    }
}

# Install Next.js with error handling
Write-Log "Installing Next.js..."
try {
    npm install next
    if ($LASTEXITCODE -ne 0) {
        throw "Next.js installation failed"
    }
    Write-Log "Next.js installed succesnsfully"
} catch {
    Write-Log "Error installing Next.js: $($_.Exception.Message)"
    exit 1
}


# Start the development server
Write-Log "Starting development server..."
try {
    $projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
    Write-Log "Starting development server at $projectRoot"
    npm -C $projectRoot run dev
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to start development server"
    }
} catch {
    Write-Log "Error starting development server: $($_.Exception.Message)"
    exit 1
}