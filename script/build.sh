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
sed -i "s|'wander'|3|g" dist/bundle.js

sed -i "s|'sushi-token'|1|g" dist/bundle.js
sed -i "s|'rice-grain'|2|g" dist/bundle.js
sed -i "s|'rice-ball'|3|g" dist/bundle.js
sed -i "s|'raw-tuna'|4|g" dist/bundle.js
sed -i "s|'tuna-bit'|9|g" dist/bundle.js

sed -i "s|'tuna-fishing-spot'|5|g" dist/bundle.js
sed -i "s|'rice-cooker'|6|g" dist/bundle.js
sed -i "s|'rice-grain-harvester'|7|g" dist/bundle.js
sed -i "s|'sushi-roller'|8|g" dist/bundle.js
sed -i "s|'shop-bot'|9|g" dist/bundle.js

sed -i "s|'texture_bot'|100|g" dist/bundle.js
sed -i "s|'texture_clientA'|200|g" dist/bundle.js
sed -i "s|'texture_clientB'|300|g" dist/bundle.js


sed -i "s|vTextureCoord|a|g" dist/bundle.js
sed -i "s|vOpacity|b|g" dist/bundle.js
sed -i "s|uSampler|c|g" dist/bundle.js
sed -i "s|uWorldMatrix|d|g" dist/bundle.js
sed -i "s|aVertexPosition|e|g" dist/bundle.js
sed -i "s|aVertexUV|f|g" dist/bundle.js
sed -i "s|aOpacity|g|g" dist/bundle.js

# bundle.js -> bundle0.js
node script/clearShader.js

# minify
NODE_ENV="mangle-properties" yarn babel dist/bundle0.js -o dist/bundle1.js
NODE_ENV="minify" yarn babel dist/bundle1.js -o dist/bundle.js


# copy index.html
node script/bundlehtml


sed -i "s|element-toolbar|a|g" dist/index.html
sed -i "s|element-shopButton|b|g" dist/index.html
sed -i "s|element-cancel|c|g" dist/index.html
sed -i "s|element-bank|d|g" dist/index.html
sed -i "s|element-shopPanel|e|g" dist/index.html
sed -i "s|element-blueprintList|f|g" dist/index.html
sed -i "s|element-closeShopButton|g|g" dist/index.html
sed -i "s|element-blueprintName|h|g" dist/index.html
sed -i "s|element-blueprintCost|i|g" dist/index.html
sed -i "s|element-blueprintImage|j|g" dist/index.html
sed -i "s|element-blueprintRecipe|k|g" dist/index.html
sed -i "s|element-blueprintRotate|l|g" dist/index.html
sed -i "s|element-overlayTutorial|n|g" dist/index.html
sed -i "s|element-overlay|m|g" dist/index.html
sed -i "s|element-hint|o|g" dist/index.html
sed -i "s|element-scene|u|g" dist/index.html

# cp dist/bundle.js dist/a.js

# clean up
rm dist/bundle.js
rm dist/bundle0.js
rm dist/bundle1.js

# zip
( cd dist && zip -r -9 bundle.zip . )

# print size
stat --printf="%s\n" ./dist/bundle.zip
