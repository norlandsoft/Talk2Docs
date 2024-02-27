import os

# 获取当前应用的绝对路径
def get_application_path():
    # 获取当前进程运行的路径
    return os.path.dirname(os.path.dirname(os.path.dirname(__file__)))

def get_workspace_path():
    return get_application_path() + "/workspace"