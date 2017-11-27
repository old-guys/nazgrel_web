#!/bin/bash

echo "##### "
echo "##### deploy bi web 测试环境"
echo "#####"

WWW_DIR="www/"
TARGET_DIR="/ishanggang/app/nazgrel_web_qa"

rsync -avz -e 'ssh -p 40022' $WWW_DIR ishanggang_dev@106.14.159.184:$TARGET_DIR