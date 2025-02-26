function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message"
}
function Uninstall-NVM {
    param (
        [switch]$Force
    )
    
    if (-not $Force) {
        $confirm = Read-Host "Are you sure you want to uninstall NVM and all Node.js versions? (y/N)"
        if ($confirm -ne "y") {
            Write-Log "Uninstall cancelled"
            return
        }
    }
    
    try {
        $nvmHome = [System.Environment]::GetEnvironmentVariable("NVM_HOME", [System.EnvironmentVariableTarget]::Machine)
        $nvmSymlink = [System.Environment]::GetEnvironmentVariable("NVM_SYMLINK", [System.EnvironmentVariableTarget]::Machine)
        
        # Remove directories
        if (Test-Path $nvmHome) {
            Write-Log "Removing NVM installation directory..."
            Remove-Item -Path $nvmHome -Recurse -Force
        }
        if (Test-Path $nvmSymlink) {
            Write-Log "Removing Node.js symlink directory..."
            Remove-Item -Path $nvmSymlink -Recurse -Force
        }
        
        # Remove environment variables
        Write-Log "Removing environment variables..."
        [System.Environment]::SetEnvironmentVariable("NVM_HOME", $null, [System.EnvironmentVariableTarget]::Machine)
        [System.Environment]::SetEnvironmentVariable("NVM_SYMLINK", $null, [System.EnvironmentVariableTarget]::Machine)
        
        # Update PATH
        $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)
        $newPath = ($currentPath.Split(';') | Where-Object { 
            $_ -ne $nvmHome -and $_ -ne $nvmSymlink 
        }) -join ';'
        [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::Machine)
        
        Write-Log "NVM has been successfully uninstalled"
    } catch {
        Write-Log "Error during uninstall: $($_.Exception.Message)"
    }
}

Uninstall-NVM -Force