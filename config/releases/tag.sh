if [ $# == 0 ]; then
  echo '参数不正确, 请传入标记文件目录, 例如: tag.sh /dyne/apps/nazgrel_web_releases'
  exit
fi

tag=`date '+%Y%m%d'`
releases_dir=$1

if [ ! -d $releases_dir ]; then
  echo "标记文件目录不存在, 开始创建标记文件目录, 命令为: mkdir $releases_dir"
  mkdir $releases_dir

  code=$?
  if [ $code == 0 ]; then
    echo "标记文件目录创建成功"
  else
    echo "标记文件目录创建失败, 失败原因: ${code}"
    exit
  fi
fi

echo "开始创建回收标记文件, 命令为: touch ${releases_dir}/${tag}"
touch $releases_dir/$tag

code=$?
if [ $code == 0 ] ; then
  echo "回收标记文件创建成功"
else

  echo "回收标记文件创建失败, 失败原因: ${code}"
fi
