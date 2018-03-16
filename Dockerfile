FROM alekzonder/puppeteer:latest
USER root
COPY . /app
WORKDIR /app
RUN chown -R pptruser:pptruser /app
EXPOSE 5000
USER pptruser
CMD ["node", "index.js"]
