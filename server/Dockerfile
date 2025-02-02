FROM python:3.11-slim

WORKDIR /app

RUN mkdir -p /app/db/config

# Copy and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . /app

EXPOSE 5000

# Set environment variables
ENV FLASK_APP=main.py
ENV FLASK_ENV=production

# Command to run the app
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
