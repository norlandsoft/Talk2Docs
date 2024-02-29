FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /usr/share/nginx/html

# 暴露 Nginx 默认的端口
EXPOSE 8000

# 在容器启动时执行的命令，这里是启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
