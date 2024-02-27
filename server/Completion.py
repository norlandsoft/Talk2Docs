from dotenv import dotenv_values

import uuid
import asyncio

from server.db.RedisClient import RedisClient
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from server.llm.ChatZhipuAI import ChatZhipuAI

env = dotenv_values(".env")

# 提问模版
prompt2 = ChatPromptTemplate.from_messages(
    [("system", "你是世界级的技术文档作者。"), ("user", "{input}")]
)

llm = ChatZhipuAI(
    temperature=0.1, api_key=env["ZHIPU_API_KEY"], model_name="glm-4", streaming=True
)

def save_content(content: str) -> str:
    # 生成一个随机UUID
    chatId = str(uuid.uuid4())
    # 保存对话内容到Redis
    RedisClient().set(chatId, content)
    # 返回请求状态和chatId
    return True, chatId;

async def llm_chat(task: str, chat: str):
    # 读取对话内容
    content = RedisClient().get(chat)
    
    output_parser = StrOutputParser()
    chain = prompt2 | llm | output_parser

    for chunk in chain.stream({"input": content}):
        yield f"{chunk}"
        await asyncio.sleep(0)
