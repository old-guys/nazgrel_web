if [ $# == 0 ]; then
  echo '参数不正确, 请传入部署目录、标记文件目录、时间天数, 例如: release.sh /dyne/apps/nazgrel_web /dyne/apps/nazgrel_web_releases 1'
  exit
fi

deploy_path=$1
releases_path=$2
days=$3

if [ ! -d $deploy_path ]; then
  echo "参数传入错误, 部署目录$deploy_path不存在"
  exit
fi

if [ ! -d $releases_path ]; then
  echo "参数传入错误, 标记文件目录$releases_path不存在"
  exit
fi

if [[ $days != *[0-9]* ]]; then
  echo "参数传入错误, 时间天数应该为数字"
  exit
fi

function get_tag() {
  # tag=`date '+%Y%m%d'`;
  tag=`date -d -${days}days +%Y%m%d`
  echo "当前开始回收的参照标记为: ${tag}"
}

function start_release() {
  file_name=$1
  echo "开始回收标记为: ${file_name}的资源文件"

  echo "step 1 执行命令: find ${deploy_path} -name "\"*.${file_name}*\"" | xargs rm -rf"
  find ${deploy_path} -name ""*.${file_name}*"" | xargs rm -rf;

  code=$?
  if [ $code == 0 ]; then
    echo "step 1 执行成功"
  else
    echo "step 1 执行失败，回收失败"
    return 1
  fi

  echo "step 2 执行命令: rm -rf ${releases_path}/${file_name}"
  rm -rf ${releases_path}/${file_name}

  code=$?
  if [ $code == 0 ]; then
    echo "step 2 执行成功"
  else
    echo "step 2 执行失败，回收失败"
    return 1
  fi

  echo "结束回收标记为: ${file_name}的资源，回收成功"
}

function loop_releases() {
  for file_path in ${releases_path}/*; do
    file_name=`basename $file_path`
    if [[ $file_name = "*" ]];then
      continue
    fi

    if [[ $file_name < $tag ]]; then
      start_release $file_name
    fi
  done
}

function perform() {
  echo "===========start: 开始根据${releases_path}下的标记文件回收资源=========="
  get_tag
  loop_releases
  echo "===========end: 结束根据${releases_path}下的标记文件回收资源=========="
}

perform
