#!/usr/bin/env bash
PROJECT_ROOT=/usr/local/share/applications/ana
NODE_PATH=/home/nouser/.nvm/versions/node/v18.16.0/bin/node
GIT_UPDATE_SCRIPT='scripts/git-check.js -e anaserver,ana -p packages/server,packages/app -b master'

source /home/nouser/.bashrc

cd $PROJECT_ROOT && $NODE_PATH $GIT_UPDATE_SCRIPT
