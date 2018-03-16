FROM alekzonder/puppeteer:latest
EXPOSE 5000
COPY . /app
WORKDIR /app
CMD ["node", "index.js"]
