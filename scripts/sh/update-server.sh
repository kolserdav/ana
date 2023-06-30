#!/bin/bash

if [ $NEED_INSTALL -eq 1 ]; then
  npm run install:server
fi

npm run build:server
systemctl restart anaserver-test
exit 0