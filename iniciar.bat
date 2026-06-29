@echo off
title IFBank - Iniciando...
color 0A

echo ============================================
echo         IFBank - Iniciando Sistema
echo ============================================
echo.

echo [1/5] Liberando portas 8080 e 4200...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080 "') do (
    if not "%%a"=="0" taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4200 "') do (
    if not "%%a"=="0" taskkill /PID %%a /F >nul 2>&1
)
echo  Portas liberadas.

echo.
echo [2/5] Iniciando MySQL...
net start MySQL80 >nul 2>&1
if %errorlevel% equ 0 (
    echo  MySQL80 iniciado.
    goto :deps
)
net start MySQL >nul 2>&1
if %errorlevel% equ 0 (
    echo  MySQL iniciado.
    goto :deps
)
echo  MySQL ja esta rodando ou servico nao encontrado. Continuando...

:deps
echo.
echo [3/5] Verificando dependencias do Frontend...
if not exist "%~dp0frontIfBank\node_modules" (
    echo  node_modules nao encontrado. Instalando dependencias...
    cd /d "%~dp0frontIfBank"
    npm install
    echo  Dependencias instaladas.
) else (
    echo  Dependencias ja instaladas.
)

echo.
echo [4/5] Iniciando Backend (Spring Boot)...
start "IFBank - Backend" cmd /k "cd /d "%~dp0serverIfBank" && gradlew.bat bootRun"
echo  Backend iniciando em http://localhost:8080
echo.

echo [5/5] Iniciando Frontend (Angular)...
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
