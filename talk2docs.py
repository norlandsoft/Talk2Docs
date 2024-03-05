# 启动FastAPI服务，提供聊天机器人服务
import uvicorn
import os
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from server import ChatService, Completion
from server.db.RedisClient import RedisClient
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from werkzeug.utils import secure_filename
app = FastAPI()

class ChatMessage(BaseModel):
    content: str = None

# 提供对话服务
@app.post("/rest/v1/chat/completions")
async def completions(chat: ChatMessage):
    success, chatId = Completion.save_content(chat.content)
    # 返回JSON格式消息
    return {"success": success, "data": chatId}


@app.get("/rest/v1/chat/fetch")
async def fetch_message(task: str, chat: str):
    # 返回客户端内容为SSE流，即服务器推送事件
    return StreamingResponse(Completion.llm_chat(task, chat), media_type="text/event-stream")

#上传文件
@app.post("/rest/v1/chat/file")
async def upload_file(file: UploadFile = File(...)):
    try:
        if file is None:
            return {'message': '没有文件内容'}
        if file.filename == '':
            return {'message': '无选择文件'}
        file_path = os.path.join(os.getcwd(), 'file', file.filename)
        # 检查文件是否已经存在，如果存在则生成新的文件名
        if os.path.exists(file_path):
            file_name, file_extension = os.path.splitext(file_path)
            i = 1
            while os.path.exists(file_path):
                file_path = f'{file_name}_{i}{file_extension}'
                i += 1
                # 确保文件目录存在
        if not os.path.exists(os.path.join(os.getcwd(), 'file')):
            os.makedirs(os.path.join(os.getcwd(), 'file'))
            # 保存文件
        with open(file_path, 'wb') as buffer:
            while content := await file.read(1024):
                buffer.write(content)
        return {'message': 'File uploaded successfully', 'filename': file.filename}
    except Exception as e:
        traceback.print_exc()
        print(f'Error occurred at line {sys.exc_info()[-1].tb_lineno}')
        return {'message': f'Error uploading file: {str(e)}', 'filename': file.filename if file else ''}

if __name__ == "__main__":
    # 初始化平台服务
    # ChatService.init_service()
    uvicorn.run(app, host="0.0.0.0", port=8080)