#!/bin/bash

echo "##### "
echo "##### deploy bi web 正式环境"
echo "#####"

WWW_DIR="www/"
TARGET_DIR="/ishanggang/app/nazgrel_web_production"

rsync -avz -e 'ssh -p 40022' $WWW_DIR ishanggang_dev@106.14.159.184:$TARGET_DIR
