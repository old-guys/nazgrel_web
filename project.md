## 项目（nazgrel_web）

### 概述

本项目主要为芝麻管家提供后台管理

### 涉及功能

1. 渠道管理（新增、编辑、冻结）
2. 渠道管理员（新增、编辑、冻结、删除、修改密码）
3. 报表（渠道新增店主、渠道店主行为、店主ECN）

### 技术栈
react + es6 + react-router-dom + react-redux + reactstrap + webpack

### 代码仓库
http://gitlab.99zmall.com/bi/nazgrel_web

### 服务器环境
测试: 106.14.159.184 /ishanggang/apps/nazgrel_web_qa

正式: 106.14.159.184 /ishanggang/apps/nazgrel_web_production

### 部署

部署采用npm命令, 命令在项目文件package.json中

测试：npm run deploy-test

正式：npm run deploy-prod

### 七牛CDN
正式：bi.admin.99zmall.com