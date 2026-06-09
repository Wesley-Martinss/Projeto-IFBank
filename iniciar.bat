@echo off
title IFBank - Iniciando...
color 0A

echo ============================================
echo         IFBank - Iniciando Sistema
echo ============================================
echo.

echo [1/3] Iniciando MySQL...
net start MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    echo  MySQL80 iniciado.
    goto :backend
)
net start MySQL >nul 2>&1
if %errorlevel% equ 0 (
    echo  MySQL iniciado.
    goto :backend
)
echo  MySQL ja esta rodando ou servico nao encontrado. Continuando...

:backend
echo.
echo [2/3] Iniciando Backend (Spring Boot)...
start "IFBank - Backend" cmd /k "cd /d "%~dp0serverIfBank" && gradlew.bat bootRun"
echo  Backend iniciando em http://localhost:8080
echo.

echo [3/3] Iniciando Frontend (Angular)...
start "IFBank - Frontend" cmd /k "cd /d "%~dp0frontIfBank" && npm start"
echo  Frontend iniciando em http://localhost:4200
echo.

echo Aguardando servicos iniciarem (20s)...
timeout /t 20 /nobreak >nul

echo Abrindo navegador...
start http://localhost:4200

echo.
echo ============================================
echo  Tudo iniciado!
echo  Backend:  http://localhost:8080
echo  Frontend: http://localhost:4200
echo ============================================
echo.
pause
