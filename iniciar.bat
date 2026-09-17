@echo off
title Promobile Concesionaria - Servidor Web
color 0C
echo ========================================================
echo     PROMOBILE CONCESIONARIA - SANTA FE
echo     Iniciando Servidor Web y Catalogo Interactivo...
echo ========================================================
echo.

cd /d "C:\promobile-web"

if not exist "node_modules\" (
    echo [i] No se encontraron modulos. Instalando dependencias...
    call npm.cmd install
)

echo [i] Abriendo navegador en http://localhost:3000 ...
echo [i] Presiona CTRL+C en esta ventana para cerrar el servidor.
echo.

call npm.cmd run dev

pause
