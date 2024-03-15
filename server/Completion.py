from dotenv import dotenv_values
import uuid
import base64
import asyncio
import datetime
from server.db.RedisClient import RedisClient
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from server.llm.ChatZhipuAI import ChatZhipuAI
from server.db.MySQLClient import MySQLClient
env = dotenv_values(".env")

# 提问模版
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "你是一个乐于解答各种问题的助手，你的任务是为用户提供专业、准确、有见地的建议。",
        ),
        ("user", "{input}"),
    ]
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
    return True, chatId


async def llm_chat(task: str, chat: str):
    # 读取对话内容
    content = RedisClient().get(chat)


    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser
    encoded_contents = []
    for chunk in chain.stream({"input": content}):
        encoded_content = base64.b64encode(chunk.encode("utf-8")).decode("utf-8")
        event_data = f"data: {encoded_content}\n\n"
        encoded_contents.append(encoded_content)
        yield event_data.encode("utf-8")
        await asyncio.sleep(0)

    HOST = '106.14.245.217'
    PORT = 3306
    USER = 'root'
    PASSWORD = '123456aA'
    DB = 'talk_docs'
    mysql_client = MySQLClient(HOST, PORT, USER, PASSWORD, DB)
    # 插入示例
    insert_query = (
        "INSERT INTO session_recording (id,createuser,createtime,edittime,edituser,request_content,upload_filespath,upload_filesname,response_information) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)")
    insert_data = (str(uuid.uuid4()), 'admin', datetime.datetime.now(), datetime.datetime.now(), "", content, "", "",event_data)
    print("before insert",insert_query,insert_data);
    rows_affected = mysql_client.execute_insert(insert_query, insert_data)
    print(f"Rows Inserted: {rows_affected}")

