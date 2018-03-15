# Hotshot

Takes screenshots of DOM elements, like Jake Gyllenhaal.

## Usage

Build image:

    $ docker build -t innoq/hotshot .

Start server:

    $ docker run -v $(pwd):/app -p 5000:5000 --shm-size 1G innoq/hotshot node index.js

Request a screenshot:

    $ curl -I -G http://localhost:5000 --data-urlencode "path=/path/on/innoq" --data-urlencode "selector=.my-css-class"
