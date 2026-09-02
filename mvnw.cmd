@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@if "%DEBUG%" == "" @echo off
@classworlds.conf.location=%CLASSWORLDS_CONF%

set ERROR_CODE=0

@REM Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" @setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set MAVEN_PROJECTBASEDIR=%DIRNAME%

IF NOT "%JAVACMD%"=="" goto javastart
IF NOT "%JAVA_HOME%"=="" goto javaHomeSet

set JAVACMD=java
where java >NUL 2>&1
if %ERRORLEVEL% EQU 0 goto javastart

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.
echo.
goto error

:javaHomeSet
set JAVACMD=%JAVA_HOME%\bin\java.exe

:javastart
if "%MAVEN_BATCH_ECHO%" == "on"  echo %JAVACMD%

@REM Execute Maven
if exist "%DIRNAME%\.mvn\wrapper\maven-wrapper.jar" (
    "%JAVACMD%" -jar "%DIRNAME%\.mvn\wrapper\maven-wrapper.jar" %*
) else (
    echo Maven wrapper jar missing. Please install Maven or run via IDE (IntelliJ IDEA / VS Code).
)

if "%ERRORLEVEL%"=="0" goto end
set ERROR_CODE=%ERRORLEVEL%
goto end

:error
set ERROR_CODE=1

:end
@if "%OS%"=="Windows_NT" endlocal & set ERROR_CODE=%ERROR_CODE%
cmd /C exit /B %ERROR_CODE%
