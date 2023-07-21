#!/bin/bash
envsubst < /etc/nginx/conf.d/app.nginx.template > /etc/nginx/conf.d/app.nginx.conf
envsubst < /etc/nginx/conf.d/ws.nginx.template > /etc/nginx/conf.d/ws.nginx.conf
envsubst < /etc/nginx/conf.d/server.nginx.template > /etc/nginx/conf.d/server.nginx.conf