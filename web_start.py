# 启动FastAPI服务，提供聊天机器人服务
import uvicorn
from dotenv import dotenv_values
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from server import ChatService
from server.llm.ChatZhipuAI import ChatZhipuAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

env = dotenv_values(".env")
llm = ChatZhipuAI(
    temperature=0.1,
    api_key=env["ZHIPU_API_KEY"],
    model_name="glm-4",
    streaming=True
)

# 提问模版
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是世界级的技术文档作者。"),
    ("user", "{input}")
])

app = FastAPI()

class ChatMessage(BaseModel):
    content: str = None

async def send_message(content: str):
    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser

    for chunk in chain.stream({"input": content}):
        yield f"{chunk}"
        # await asyncio.sleep(0)

@app.post("/v1/chat/completions")
async def completions(chat: ChatMessage):
    return StreamingResponse(send_message(chat.content), media_type="text/event-stream")

if __name__ == "__main__":
    # 初始化平台服务
    ChatService.init_platform()
    uvicorn.run(app, host="0.0.0.0", port=8080)