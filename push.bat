@echo off
setlocal EnableExtensions
title Push na GitHub - growth-cinematic
cd /d "%~dp0"

set "REPO_URL=https://github.com/pavlemitrovic01/growth-cinematic.git"

rem ---- Provera: git postoji? ----
where git >nul 2>&1
if errorlevel 1 (
  echo [GRESKA] Git nije instaliran ili nije u PATH-u. Instaliraj ga sa https://git-scm.com
  goto :kraj
)

rem ---- Provera: ovo je git repo? ----
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [GRESKA] Ovaj folder nije git repozitorijum.
  goto :kraj
)

rem ---- Ime i email autora, ako nisu podeseni ----
set "GNAME="
set "GMAIL="
for /f "delims=" %%A in ('git config user.name 2^>nul') do set "GNAME=%%A"
for /f "delims=" %%A in ('git config user.email 2^>nul') do set "GMAIL=%%A"
if not defined GNAME git config user.name "pavlemitrovic01"
if not defined GMAIL git config user.email "pavlemitrovic01@gmail.com"

rem ---- Remote origin ----
git remote get-url origin >nul 2>&1
if errorlevel 1 git remote add origin %REPO_URL%

rem ---- Trenutna grana ----
set "GRANA="
for /f "delims=" %%B in ('git rev-parse --abbrev-ref HEAD') do set "GRANA=%%B"
if /i "%GRANA%"=="HEAD" (
  echo [GRESKA] Nisi ni na jednoj grani - detached HEAD. Prvo uradi: git checkout master
  goto :kraj
)

echo.
echo ==============================================
echo  Repo:  github.com/pavlemitrovic01/growth-cinematic
echo  Grana: %GRANA%
echo ==============================================
echo.
echo ---- Izmene u folderu ----
git status --short
echo.

rem ---- Commit, ako ima izmena ----
git add -A
git diff --cached --quiet
if not errorlevel 1 goto :nema_izmena

set "PORUKA="
set /p "PORUKA=Kratak opis izmena - Enter za automatski opis: "
if not defined PORUKA set "PORUKA=Izmene %date% %time:~0,5%"
git commit -m "%PORUKA%"
if errorlevel 1 (
  echo [GRESKA] Commit nije uspeo.
  goto :kraj
)
goto :push

:nema_izmena
echo Nema novih izmena za commit - saljem ono sto je vec commitovano.

:push
echo.
echo ---- Saljem na GitHub ----
git push -u origin "%GRANA%"
if errorlevel 1 (
  echo.
  echo [GRESKA] Push nije uspeo.
  echo  - Ako je trazio prijavu: uloguj se kao pavlemitrovic01 u prozoru koji se otvori.
  echo  - Ako pise "rejected" ili "fetch first": na GitHubu ima novijih izmena.
  echo    Pokreni:  git pull --rebase origin %GRANA%
  echo    pa ponovo pokreni ovaj fajl.
  goto :kraj
)

echo.
echo [OK] Kod je na GitHubu: https://github.com/pavlemitrovic01/growth-cinematic/tree/%GRANA%

:kraj
echo.
pause
endlocal
