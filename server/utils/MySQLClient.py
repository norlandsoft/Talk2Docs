import pymysql
from pymysql.cursors import DictCursor
from pymysql.err import OperationalError
from dbutils.pooled_db import PooledDB

# MySQLClient类用于与MySQL数据库进行交互
class MySQLClient:
    def __init__(self, host, port, user, password, db, pool_size=5):
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.db = db
        self.pool = PooledDB(
            pymysql,
            mincached=pool_size,  # 这里可能需要根据pool_size调整为合适的值，mincached表示初始时在连接池中创建的空闲连接数
            maxcached=pool_size,  # 如果希望pool_size表示最大连接数，这里应保持一致
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            db=self.db,
            cursorclass=DictCursor
        )

    def _reconnect(self):
        try:
            self.conn.ping(reconnect=True)
        except OperationalError as e:
            print(f"Error while reconnecting: {e}")
            raise

    def _get_connection(self):
        try:
            self.conn = self.pool.connection()
        except OperationalError as e:
            print(f"Error while getting connection from pool: {e}")
            raise
        return self.conn

    def execute_query(self, query, params=None):
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                result = cursor.fetchall()
        except Exception as e:
            print(f"Error executing query: {e}")
            raise
        finally:
            conn.close()
        return result

    def execute_update(self, query, params=None):
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                conn.commit()
                result = cursor.rowcount
        except Exception as e:
            conn.rollback()
            print(f"Error executing update: {e}")
            raise
        finally:
            conn.close()
        return result

    def execute_insert(self, query, params=None):
        return self.execute_update(query, params)

    def execute_delete(self, query, params=None):
        return self.execute_update(query, params)

# 示例用法
if __name__ == "__main__":
    # 假设有一个本地MySQL数据库
    HOST = 'localhost'
    PORT = 3306
    USER = 'your_username'
    PASSWORD = 'your_password'
    DB = 'your_database'

    mysql_client = MySQLClient(HOST, PORT, USER, PASSWORD, DB)

    # 查询示例
    query = "SELECT * FROM your_table"
    results = mysql_client.execute_query(query)
    print("Query Results:")
    for row in results:
        print(row)

    # 插入示例
    insert_query = "INSERT INTO your_table (column1, column2) VALUES (%s, %s)"
    insert_data = ('value1', 'value2')
    rows_affected = mysql_client.execute_insert(insert_query, insert_data)
    print(f"Rows Inserted: {rows_affected}")

    # 更新示例
    update_query = "UPDATE your_table SET column1 = %s WHERE column2 = %s"
    update_data = ('new_value', 'value2')
    rows_affected = mysql_client.execute_update(update_query, update_data)
    print(f"Rows Updated: {rows_affected}")

    # 删除示例
    delete_query = "DELETE FROM your_table WHERE column1 = %s"
    delete_data = ('new_value',)
    rows_affected = mysql_client.execute_delete(delete_query, delete_data)
    print(f"Rows Deleted: {rows_affected}")
