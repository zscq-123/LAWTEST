@echo off
rem 五彩法途系统一键启动（Windows）
cd /d "%~dp0"

echo ==^> 启动五彩法途系统（首次构建镜像可能需要几分钟）...
docker compose up -d --build

echo ==^> 启动完成，浏览器访问：
echo      http://localhost
echo      如需修改端口/二维码地址，请设置环境变量后重新执行本脚本
pause
