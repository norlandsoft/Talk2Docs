# 启动FastAPI服务，提供聊天机器人服务
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from server import ChatService, Completion

app = FastAPI()

class ChatMessage(BaseModel):
    content: str = None

# 提供对话服务
@app.post("/v1/chat/completions")
async def completions(chat: ChatMessage):
    return StreamingResponse(Completion.send_message(chat.content), media_type="text/event-stream")

if __name__ == "__main__":
    # 初始化平台服务
    ChatService.init_service()
    uvicorn.run(app, host="0.0.0.0", port=8080)