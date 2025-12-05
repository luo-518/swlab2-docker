FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 确保上传目录存在
RUN mkdir -p uploads

EXPOSE 5000
CMD ["python", "app.py"]

