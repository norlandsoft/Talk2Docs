# 启动FastAPI服务，提供聊天机器人服务
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from server import ChatService, Completion
from server.db.RedisClient import RedisClient

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

if __name__ == "__main__":
    # 初始化平台服务
    # ChatService.init_service()
    uvicorn.run(app, host="0.0.0.0", port=8080)