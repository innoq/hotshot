FROM alekzonder/puppeteer:latest
EXPOSE 5000
COPY . /app
WORKDIR /app
