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

sed -i "s|'sushi'|1|g" dist/bundle.js
sed -i "s|'rice-grain'|2|g" dist/bundle.js
sed -i "s|'rice-ball'|3|g" dist/bundle.js
sed -i "s|'raw-tuna'|4|g" dist/bundle.js

sed -i "s|'tuna-fishing-spot'|5|g" dist/bundle.js
sed -i "s|'rice-cooker'|6|g" dist/bundle.js
sed -i "s|'rice-grain-harvester'|7|g" dist/bundle.js
sed -i "s|'sushi-roller'|8|g" dist/bundle.js

sed -i "s|'shop_bot'|9|g" dist/bundle.js

sed -i "s|'texture_bot'|100|g" dist/bundle.js
sed -i "s|'texture_clientA'|200|g" dist/bundle.js
sed -i "s|'texture_clientB'|300|g" dist/bundle.js

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
