from dotenv import dotenv_values

# 获取环境变量
mysql_env = dotenv_values(".env")
# mysql_env['mysql_user']

# 启动文档对话服务，提供数据库等服务
class ChatService:
  def init(self):
    # 初始化MySQL数据库连接
    
    pass