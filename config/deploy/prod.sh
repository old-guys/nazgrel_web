#!/bin/bash

echo "##### "
echo "##### deploy bi web 正式环境"
echo "#####"

# 同步打包好的文件到服务器相应目录
WWW_DIR="www/"
TARGET_DIR="/ishanggang/apps/nazgrel_web_production"
RELEASES_DIR="/ishanggang/apps/nazgrel_web_releases_production"
rsync -avz -e 'ssh -p 40022' $WWW_DIR ishanggang_dev@106.14.159.184:$TARGET_DIR

# 生成部署时的标记文件，以当前部署的日期为标记
ssh -p 40022 ishanggang_dev@106.14.159.184 -C "/bin/bash -s" < ./config/releases/tag.sh $RELEASES_DIR

# 执行回收资源sh文件
ssh -p 40022 ishanggang_dev@106.14.159.184 -C "/bin/bash -s" < ./config/releases/release.sh $TARGET_DIR $RELEASES_DIR 60
