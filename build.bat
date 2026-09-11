npm run build
mkdir output 2>nul
xcopy /Y /Q /S dist\* output\dist\* 2>nul
pkg . --targets node18-win-x64 --out-path output --no-bytecode
