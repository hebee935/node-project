#!/bin/bash

if [ -z $1 ]; then
  echo '\nusage: $ route.remove.sh <route name>\n'
  exit 0
fi

name=$1

BASE_PATH=$(pwd -P)

rm $BASE_PATH/db/models/$1.js
rm $BASE_PATH/controllers/$1.js
rm $BASE_PATH/routes/api/v1/$1.js