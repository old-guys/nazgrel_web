Welcome To Nazgrel Web!

## 介绍
它是 Nazgrel 的 web 端项目, 基于 CoreUI + react + webpack 实现

Dependencies can be handled by **npm**.

## 安装
- **npm i** - to install dependencies

### 构建 docker 开发环境

```shell
# 构建镜像只是在 npm, 或者 Dockerfile 发生了变化才需要执行
docker build -t nazgrel_web-dev .

docker run -it \
  -v /usr/src/app/node_modules \
  -v ${PWD}:/usr/src/app \
  -p 9001:9001 \
  --rm \
  nazgrel_web-dev
```

更多参见 `wiki/docker.md`

## 脚本
- **npm start** for developing (it runs webpack-dev-server)
- **npm run build** to run a dev build
- **npm run clean** to clean build dir
- **npm run dev** to run a dev build with watching filesystem for changes

## See also

- [Changelog](./CHANGELOG.md)
- [Application Architecture](./wiki/app_architecture.md)
- [CoreUI-React](https://github.com/mrholek/CoreUI-React)
- [Public Project Guideline](https://github.com/wearehive/project-guidelines)
