#!/bin/sh

cat /root/viz/config.properties |grep -v /^/# |awk -F"[=]" '{print "sed -i '\''s?${"$1"}?"$2"?g'\'' /etc/nginx/nginx.conf"}' | sh -x

/docker-entrypoint.sh
nginx