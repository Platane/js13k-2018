#!/bin/bash

set -e

rm -rf dist

# bundle
yarn rollup --config ./script/rollup.config.js

# minify
NODE_ENV=minify yarn babel dist/bundle.js -o dist/index.js

rm dist/bundle.js

# zip
( cd dist && zip -r bundle.zip . )

# print size
stat --printf="%s\n" ./dist/bundle.zip
