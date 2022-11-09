#!/bin/sh
sudo docker build -t client-web-ui .
sudo docker run -it \
-p 3000:3000 \
-v $(pwd)/src:/home/client-web-ui/src \
--name client-web-ui client-web-ui