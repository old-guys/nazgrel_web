#!/bin/bash

echo "##### "
echo "##### deploy bi web dev环境"
echo "#####"

# 同步打包好的文件到服务器相应目录
WWW_DIR="www/"
TARGET_DIR="/dyne/apps/nazgrel_web"
RELEASES_DIR="/dyne/apps/nazgrel_web_releases"
rsync -avz -e 'ssh -p 40022' $WWW_DIR lihui@10.211.55.3:$TARGET_DIR

# 生成部署时的标记文件，以当前部署的日期为标记
ssh lihui@10.211.55.3 -C "/bin/bash -s" < ./config/releases/tag.sh $RELEASES_DIR

# 执行回收资源sh文件
ssh lihui@10.211.55.3 -C "/bin/bash -s" < ./config/releases/release.sh $TARGET_DIR $RELEASES_DIR 1
