# Hotshot

Takes screenshots of DOM elements, like Jake Gyllenhaal 📸

Check out the [blog post](https://www.innoq.com/en/blog/screenshot-dom-elements-puppeteer/).

## Usage

Build image:

    $ docker build -t innoq/hotshot .

Start server:

    $ docker run -p 5000:5000 -e PORT=5000 -e TARGET_HOST='https://www.innoq.com' innoq/hotshot

Request a screenshot:

    $ curl -G "http://localhost:5000/shoot?path=/relative/path&selector=.my-css-class" > screenshot.png
