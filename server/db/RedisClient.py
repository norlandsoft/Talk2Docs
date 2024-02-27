import redis
from redis.exceptions import ConnectionError, TimeoutError


class RedisClient:
    def __init__(self, host='redis.air', port=6379, password=None, db=0, max_connections=10):
        self.connection = None
        self.connection_timeout = 5  # 连接超时时间
        self.socket_timeout = 5  # 命令超时时间
        self.host = host
        self.port = port
        self.password = password
        self.db = db
        self.max_connections = max_connections
        self.pool = None
        self.connect()

    def connect(self):
        """建立连接池"""
        try:
            self.pool = redis.ConnectionPool(
                host=self.host,
                port=self.port,
                password=self.password,
                db=self.db,
                max_connections=self.max_connections,
                socket_keepalive=True,
                socket_connect_timeout=self.connection_timeout,
                socket_timeout=self.socket_timeout,
                retry_on_timeout=True
            )
            self.connection = redis.Redis(connection_pool=self.pool)
        except ConnectionError as e:
            print(f"Redis 连接错误: {e}")

    def reconnect_if_needed(self):
        """如果连接断开，尝试重新连接"""
        try:
            # 测试连接是否有效
            self.connection.ping()
        except (ConnectionError, TimeoutError):
            print("获取连接失败, 重新连接...")
            self.connect()

    def get(self, key):
        self.reconnect_if_needed()
        return self.connection.get(key)

    def set(self, key, value):
        self.reconnect_if_needed()
        return self.connection.set(key, value)

    def set_with_expire(self, key, value, expire):
        self.reconnect_if_needed()
        return self.connection.setex(key, expire, value)

    def __del__(self):
        """析构函数，确保关闭连接"""
        if self.pool:
            self.pool.disconnect()