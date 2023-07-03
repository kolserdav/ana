#!/usr/bin/env bash
BRANCH=''
index=0
for i in $@;
do
    if [ $index -eq 0 ]; then
      BRANCH=$i
    fi
    index=$((index+1))
done

PROJECT_ROOT=/usr/local/share/applications/ana-test
NODE_PATH=/home/nouser/.nvm/versions/node/v18.16.0/bin/node
GIT_UPDATE_SCRIPT='scripts/git-check.js -e anaserver-test,ana-test -p packages/server,packages/app -b $BRANCH'

source /home/nouser/.bashrc

cd $PROJECT_ROOT && $NODE_PATH $GIT_UPDATE_SCRIPT
