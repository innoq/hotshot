# Hotshot

Takes screenshots of DOM elements, like Jake Gyllenhaal 📸

## Usage

Build image:

    $ docker build -t innoq/hotshot .

Start server:

    $ docker run -p 5000:5000 \
                 --shm-size 1G \
                 -e TARGET_HOST='https://www.innoq.com' innoq/hotshot

Request a screenshot:

    $ curl -G http://localhost:5000 \
           --data-urlencode "path=/path/to/content" \
           --data-urlencode "selector=.my-css-class"
