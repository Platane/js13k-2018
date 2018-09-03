#!/bin/bash

set -e

rm -rf dist

# fix babel-plugin-minify-mangle-properties package
sed -i 's|lib/index.js|src/index.js|' ./node_modules/babel-plugin-minify-mangle-properties/package.json

# bundle
yarn rollup --config ./script/rollup.config.js

# replace constant
sed -i "s|'idle'|4|g" dist/bundle.js
sed -i "s|'carry'|2|g" dist/bundle.js
sed -i "s|'activate'|3|g" dist/bundle.js

# minify
NODE_ENV="mangle-properties" yarn babel dist/bundle.js -o dist/bundle0.js
NODE_ENV="minify" yarn babel dist/bundle0.js -o dist/index.js


rm dist/bundle.js
rm dist/bundle0.js


# copy index.html
cp src/index.html dist/index.html

# zip
( cd dist && zip -r bundle.zip . )

# print size
stat --printf="%s\n" ./dist/bundle.zip
