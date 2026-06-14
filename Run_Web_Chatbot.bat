@echo off
title MedAssist Chatbot Server
cls
echo =================================================================
echo 🩺            STARTING MEDASSIST WEB SERVER...                🩺
echo =================================================================
echo.
echo Launching default browser to http://localhost:8000 ...
start "" "http://localhost:8000"
echo.
echo Starting local web server on port 8000 (Ctrl+C to quit)...
.\python_portable\python.exe -m http.server 8000
echo.
pause
