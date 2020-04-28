FROM alekzonder/puppeteer:latest

COPY --chown=pptruser:pptruser package.json yarn.lock ./
RUN yarn install

COPY --chown=pptruser:pptruser . /app

EXPOSE 5000

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "app.js"]
