FROM ruby:2.5.3

RUN apt-key adv --no-tty --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7 && \
curl -sL https://deb.nodesource.com/setup_11.x | bash && \
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && \
apt-get install -yq nodejs yarn gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont graphicsmagick \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget apt-transport-https && \
echo "deb https://oss-binaries.phusionpassenger.com/apt/passenger stretch main" > /etc/apt/sources.list.d/passenger.list && \
apt-get update && \
apt-get install -y passenger && \
wget https://github.com/Yelp/dumb-init/releases/download/v1.2.2/dumb-init_1.2.2_amd64.deb && \
dpkg -i dumb-init_*.deb && rm -f dumb-init_*.deb && \
apt-get clean && apt-get autoremove -y && rm -rf /var/lib/apt/lists/* && \
mkdir -p /app /home/pptruser

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser && \
    chown -R pptruser:pptruser /home/pptruser && \
    chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser
WORKDIR /app

# --cap-add=SYS_ADMIN
# https://docs.docker.com/engine/reference/run/#additional-groups

COPY --chown=pptruser:pptruser package.json yarn.lock ./
RUN yarn install

COPY --chown=pptruser:pptruser . /app

EXPOSE 5000

ENV NODE_ENV=production

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint"]
