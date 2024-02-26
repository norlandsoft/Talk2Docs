# 启动FastAPI服务，提供聊天机器人服务
import os
from dotenv import load_dotenv

import uvicorn
import asyncio

from fastapi import FastAPI
from pydantic import BaseModel
from zhipuai import ZhipuAI
from starlette.responses import StreamingResponse

from server import ChatService

app = FastAPI()

# 从.env中读取环境变量
load_dotenv()
zhipu_api_key = os.getenv('qianwen_api_key')

client = ZhipuAI(api_key=zhipu_api_key)

class ChatMessage(BaseModel):
    content: str = None

async def send_message(content: str):
    response = client.chat.completions.create(
        model="GLM-4",  # 需要调用的模型名称
        messages=[
            {"role": "system", "content": "你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。"},
            {"role": "user", "content": content},
        ],
        stream=True,
        max_tokens=4096,
    )

    for chunk in response:
        print(chunk.choices[0].delta.content)
        yield f"{chunk.choices[0].delta.content}"
        await asyncio.sleep(0)

@app.post("/v1/chat/completions")
async def completions(chat: ChatMessage):
    return StreamingResponse(send_message(chat.content), media_type="text/event-stream")

if __name__ == "__main__":
    ChatService.init_db()
    uvicorn.run(app, host="0.0.0.0", port=8080)