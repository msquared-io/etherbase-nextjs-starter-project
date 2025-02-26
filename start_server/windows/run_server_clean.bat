@echo off

REM Execute PowerShell script with bypass execution policy and clean install parameter
powershell -ExecutionPolicy Bypass -File "%~dp0run_server.ps1" -cleanInstall

REM Pause if there's an error
if %errorLevel% neq 0 (
    echo.
    echo An error occurred during execution.
    pause
) 