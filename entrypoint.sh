#!/bin/sh

for envfile in .env .env.local .env.production .env.production.local; do
  if [ -f "/usr/local/etc/taskcare/web/$envfile" ]; then
    ln -sf "/usr/local/etc/taskcare/web/$envfile" "/usr/local/bin/taskcare/web/$envfile"
  fi
done

exec node server.js
