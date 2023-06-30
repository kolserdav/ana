#!/bin/bash

if [ $NEED_INSTALL -eq 1 ]; then
  npm run install:app
fi

npm run build:app
systemctl restart ana-test