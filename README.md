# Talk2Docs

## 运行环境
> 服务器已安装git、python、miniconda、docker、nodejs环境

```shell
# 运行环境
conda create --name talk python=3.10
conda activate talk

# 应用
git clone https://github.com/norlandsoft/Talk2Docs.git
cd Talk2Docs
pip install -r requirements.txt

# 前端
cd frontend
npm install
```

## 启动基础服务
### MySQL
> 关系型数据库
```shell
docker run -d -it -p 3306:3306 \
            -e MYSQL_DATABASE=<数据库名称> \
            -e MYSQL_ROOT_PASSWORD=<ROOT用户访问密码> \
            --name mysql-8.1 mysql:8.1 \
            --character-set-server=utf8mb4 \
            --collation-server=utf8mb4_unicode_ci \
            --default-time_zone='+8:00' \
            --lower_case_table_names=1
```
### Chrome
> 向量数据库
```shell
```

## 运行环境设置
- 将.env-template文件更名为.env
- 设置数据库连接及语言模型API KEY

## 启动服务
```shell
# 启动服务
python web_start.py
# 启动前端
cd frontend && npm start
```