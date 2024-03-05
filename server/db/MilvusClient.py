# 向量数据库客户端
from functools import wraps
from pymilvus import (
    connections,
    FieldSchema, CollectionSchema, DataType,
    Collection
)


def singleton(cls):
    instances = {}

    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return get_instance


@singleton
class MilvusClient:
    def __init__(self, host='localhost', port='19530', timeout=10, max_retry=3, pool_size=10):
        self.host = host
        self.port = port
        self.timeout = timeout
        self.max_retry = max_retry
        self.pool_size = pool_size
        self._client = None
        self._connect()

    def _connect(self):
        retries = self.max_retry
        while retries > 0:
            try:
                self._client = connections.connect(
                    self.host,
                    self.port,
                    timeout=self.timeout,
                    pool_size=self.pool_size
                )
                break
            except Exception as e:
                print(f"Milvus 连接错误: {e}")
                retries -= 1

    def reconnect_if_needed(self):
        try:
            self._client.ping()
        except Exception as e:
            print(f"Milvus 连接错误: {e}")
            self._connect()

    def create_collection(self, collection_name, dimension, index_file_size=1024, metric_type='L2'):
        if not self._client.has_collection(collection_name):
            field = FieldSchema(name='embedding', dtype=DataType.FLOAT_VECTOR, dim=dimension)
            schema = CollectionSchema(fields=[field], description="collection description")
            self._client.create_collection(collection_name, schema)
            self._client.create_index(collection_name, index_file_size, metric_type)