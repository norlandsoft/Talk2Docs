from dotenv import dotenv_values
from server.db.MySQLClient import MySQLClient

# 获取环境变量
mysql_env = dotenv_values(".env")


def init_service():
    init_db()
    pass


def init_db():
    # 初始化数据库连接，如果mysql为空，则初始化
    mysql = MySQLClient(
        host=mysql_env["MYSQL_HOST"],
        port=int(mysql_env["MYSQL_PORT"]),
        user=mysql_env["MYSQL_USER"],
        password=mysql_env["MYSQL_PASSWORD"],
        db=mysql_env["MYSQL_DB"],
    )

    mysql.execute_query("select 1;")
    return mysql


# 获取数据库连接
def get_db():
    return init_db()
