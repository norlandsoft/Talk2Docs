from dotenv import dotenv_values
from server.db.MySQLClient import MySQLClient

# 获取环境变量
mysql_env = dotenv_values(".env")

def init_platform():
    init_db()
    pass

def init_db():
    mysql = MySQLClient(
      host=mysql_env['MYSQL_HOST'],
      port=int(mysql_env['MYSQL_PORT']),
      user=mysql_env['MYSQL_USER'],
      password=mysql_env['MYSQL_PASSWORD'],
      db=mysql_env['MYSQL_DB']
    )

    mysql.execute_query('select 1;')
    pass