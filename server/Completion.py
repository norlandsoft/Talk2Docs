from dotenv import dotenv_values

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from server.llm.ChatZhipuAI import ChatZhipuAI

env = dotenv_values(".env")

# 提问模版
prompt = ChatPromptTemplate.from_messages(
    [("system", "你是世界级的技术文档作者。"), ("user", "{input}")]
)

llm = ChatZhipuAI(
    temperature=0.1, api_key=env["ZHIPU_API_KEY"], model_name="glm-4", streaming=True
)


async def chat(content: str):
    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser

    for chunk in chain.stream({"input": content}):
        yield f"{chunk}"
        # await asyncio.sleep(0)
