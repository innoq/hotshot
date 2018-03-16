# Hotshot

Takes screenshots of DOM elements, like Jake Gyllenhaal 📸

## Usage

Build image:

    $ docker build -t innoq/hotshot .

Start server:

    $ docker run -p 5000:5000 \
                 --shm-size 1G innoq/hotshot \
                 -e TARGET_HOST='https://www.innoq.com'

Request a screenshot:

    $ curl -X GET http://localhost:5000 \
           --data-urlencode "path=/path/on/innoq" \
           --data-urlencode "selector=.my-css-class"
