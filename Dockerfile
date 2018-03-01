# base image
FROM node:9.6.1

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json

# install and cache app dependencies
# https://npm.taobao.org/
RUN npm install -g cnpm --silent --registry=https://registry.npm.taobao.org
RUN cnpm install --silent
RUN cnpm install react-scripts -g --silent

# start app
CMD ["npm", "start"]
