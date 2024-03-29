# Hotshot

Takes screenshots of DOM elements, like Jake Gyllenhaal 📸

Check out the [blog post](https://www.innoq.com/en/blog/screenshot-dom-elements-puppeteer/).

## Start (without Docker)

Make sure you've got a current node and yarn installed. Then:

    $ yarn install
    $ TARGET_HOST="https://www.innoq.com" yarn start

## Start (with Docker)

Build image:

    $ docker build -t innoq/hotshot .

Start server:

    $ docker run --init -p 5000:5000 -e PORT=5000 -e TARGET_HOST='https://www.innoq.com' innoq/hotshot

## Request a screenshot

    $ curl -G "http://localhost:5000/shoot?path=/relative/path&selector=.my-css-class" > screenshot.jpeg

## Content negotiation

Hotshot can serve webp images if requested in the `Accept` header. Example:

    $ curl -G -H "accept: image/webp" "http://localhost:5000/shoot?path=/relative/path&selector=.my-css-class" > screenshot.webp

Please note: any Accept header values not directly specifying webp support (e. g. `*/*`) automatically get served jpeg.
