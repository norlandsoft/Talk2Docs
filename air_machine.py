import uvicorn
import asyncio

from fastapi import FastAPI
from zhipuai import ZhipuAI
from starlette.responses import StreamingResponse
from server.db.RedisClient import RedisClient

app = FastAPI(
    title="AirMachine Server",
    version="1.0",
    description="AirMachine",
)

redis_client = RedisClient()
client = ZhipuAI(api_key="06cd4940767ac97f37f42340ededc7cb.NByo90Rv4FAieZLD")


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
        yield f"{chunk.choices[0].delta.content}"
        await asyncio.sleep(0)

from pydantic import BaseModel

class ChatMessage(BaseModel):
    content: str = None

@app.post("/rest/v1/chat/completions")
async def chat_endpoint1(prompt: ChatMessage):
    print(prompt)
    return {"success": True}


@app.get("/rest/v1/chat/fetch")
async def chat_endpoint2(chat: str):
    print(chat)
    # 通过参数p获取用户输入的对话内容
    # prompt_id = f"CHAT_PROMPT_" + chat
    # prompt = redis_client.get(prompt_id)
    # return StreamingResponse(send_message(prompt.decode('utf-8')), media_type="text/event-stream")
    return StreamingResponse(send_message('Json格式有什么特点？'), media_type="text/event-stream")


@app.get("/v1/chat/ask")
async def chat_endpoint3(prompt: str):
    response = client.chat.completions.create(
        model="GLM-4",  # 需要调用的模型名称
        messages=[
            {"role": "system", "content": "你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。"},
            {"role": "user", "content": prompt},
        ],
        stream=False,
        max_tokens=4096,
    )
    content = response.choices[0].message.content
    return content


if __name__ == "__main__":
    # 创建redis连接
    redis_client.connect()

    uvicorn.run(app, host="0.0.0.0", port=8080)
