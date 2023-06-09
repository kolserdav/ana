#!/bin/bash

ACCESS_TOKEN=''
TAG=''
ORIGIN=''
index=0
for i in $@;
do
    if [ $index -eq 0 ]; then
      ACCESS_TOKEN=$i
    elif [ $index -eq 1 ]; then
      TAG=$i
    elif [ $index -eq 2 ]; then
      ORIGIN=$i
    fi
    index=$((index+1))
done

if [ -z $ACCESS_TOKEN -o -z $TAG ]; then
  echo "Access token and tag and origin is required"
  echo "Example: ./create-stable-link.sh [YOUR ACCESS TOKEN] [TAG] [ORIGIN]"
else
echo "Create stable link with tag $TAG"
curl --request POST \
  --data name="app-release.apk" \
  --data url="https://$ORIGIN/ana/releases/apk/$TAG/app-release.apk" \
  --data direct_asset_path="/ana/releases/apk/$TAG/app-release.apk" \
  --header "PRIVATE-TOKEN: $ACCESS_TOKEN" \
  "https://gitlab.com/api/v4/projects/46053722/releases/$TAG/assets/links"
fi