# 读取资料文件
import PyPDF2

def read_pdf(file_path: str):
    with open(file_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()

    # 处理text中的换行符
    text = text.replace("\n", " ").replace("\r", " ")
    
    return text