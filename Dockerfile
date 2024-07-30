# 使用 Node.js v20 作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /src

# 复制 package.json 和 package-lock.json（如果有）
COPY package*.json /src/

# 安装全局 supervisor 和应用依赖
RUN npm install -g supervisor && npm install

# 复制所有源文件
COPY . /src

# 暴露应用端口
EXPOSE 3000

# 启动应用程序
CMD ["supervisor", "-w", ".", "app.js"]



