@echo off
title Aurolith 80-Unit Overnight Asset Generator
color 0A

echo =========================================================================
echo       AUROLITH: 80-UNIT LOCAL AI HIGH-QUALITY OVERNIGHT GENERATOR
echo =========================================================================
echo.
echo Mode: High Quality Optimized (17 Steps DPM++ 2M Karras, Native 512x768)
echo Checkpoint: DreamShaper 8 (D:\LocalAI\Models\DreamShaper_8_pruned.safetensors)
echo Target Directory: C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Units
echo Audit Protocol: Automated BBox, Centering ^& Jev AI Consensus
echo.

:: 1. Verify if SD WebUI is listening on port 7860
echo [1/3] Checking Stable Diffusion WebUI status on port 7860...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:7860/sdapi/v1/progress' -TimeoutSec 2; exit 0 } catch { exit 1 }"
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Stable Diffusion WebUI is NOT detected on port 7860!
    echo Attempting to automatically launch webui-user.bat in a background window...
    start "SD WebUI Daemon" /min cmd /c "d:\LocalAI\stable-diffusion-webui\webui-user.bat"
    echo Waiting for WebUI server to initialize (this may take 45-60 seconds on CPU)...
    
    :wait_loop
    timeout /t 5 /nobreak >nul
    powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:7860/sdapi/v1/progress' -TimeoutSec 2; exit 0 } catch { exit 1 }"
    if %ERRORLEVEL% NEQ 0 (
        echo Still waiting for WebUI on port 7860...
        goto wait_loop
    )
    echo [SUCCESS] WebUI is now ONLINE!
) else (
    echo [SUCCESS] WebUI is already running and ready!
)

echo.
echo [2/3] Launching Overnight High-Quality Batch Generation...
echo Output will be displayed live and logged to Assets\Gen\overnight_generation.log
echo.

python -u "C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen\scriptgen\batch_generate_80_units.py" 2>&1 | powershell -Command "$input | Tee-Object -FilePath 'C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen\overnight_generation.log'"

echo.
echo [3/3] Running Full-Roster Quality ^& Integrity Scan...
python "C:\Users\s0846\Desktop\Files\ExGame\Aurolith\Assets\Gen\scriptgen\scan_all_units.py"

echo.
echo =========================================================================
echo  BATCH RUN COMPLETE! Review Assets\Gen\QUALITY_AUDIT_REPORT.md
echo =========================================================================
pause
