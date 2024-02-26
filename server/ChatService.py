from dotenv import dotenv_values
from server.db.MySQLClient import MySQLClient

# 获取环境变量
mysql_env = dotenv_values(".env")

def init_platform():
    pass

def init_db():
    mysql = MySQLClient(
      host=mysql_env['mysql_host'],
      port=int(mysql_env['mysql_port']),
      user=mysql_env['mysql_user'],
      password=mysql_env['mysql_password'],
      db=mysql_env['mysql_db']
    )

    mysql.execute_query('select 1;')
    pass