FROM python:3.11-slim

WORKDIR /app

RUN mkdir -p /app/db/config

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 5000

ENV FLASK_APP=main.py
ENV FLASK_ENV=production

CMD ["python", "main.py"]
