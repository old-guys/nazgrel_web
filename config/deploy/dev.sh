#!/bin/bash

echo "##### "
echo "##### deploy bi web dev环境"
echo "#####"

WWW_DIR="www/"
TARGET_DIR="/dyne/apps/nazgrel_web"

rsync -avz -e 'ssh -p 40022' $WWW_DIR lihui@10.211.55.3:$TARGET_DIR
