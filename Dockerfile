FROM node:18-alpine

WORKDIR /app

# install the fonts you need, the following selections will cover most languages and almost all Chinese fonts
# https://wiki.alpinelinux.org/wiki/Fonts
RUN apk add --no-cache chromium terminus-font ttf-inconsolata ttf-dejavu font-noto font-noto-cjk ttf-font-awesome font-noto-extra && apk search -qe 'font-bitstream-*' | xargs apk add --no-cache

RUN addgroup -S apps && adduser -S apps -G apps

COPY --chown=apps:apps package.json yarn.lock ./

RUN yarn install --prod

COPY --chown=apps:apps app.js LICENSE ./

EXPOSE 5000

ENV NODE_ENV=production

USER apps

ENTRYPOINT node app.js
