# Hotshot

Takes screenshots of DOM elements, like Jake Gyllenhaal 📸

Check out the [blog post](https://www.innoq.com/en/blog/screenshot-dom-elements-puppeteer/).
forked from [innoq/hotshot](https://github.com/innoq/hotshot)

## Start (without Docker)

Make sure you've got a current node and yarn installed. Then:

    $ yarn install
    $ TARGET_HOST="https://www.womany.net" yarn start

## Start (with Docker)

Build image:

    $ docker build -t womany/hotshot .

Start server:

    $ docker run -p 5000:5000 -e PORT=5000 -e TIMEOUT=30000 -e TARGET_HOST='https://womany.net' womany/hotshot

## Request a screenshot:

    $ curl -G "http://localhost:5000/shoot?path=genderpower&selector=%23block113-gender" > screenshot.png
