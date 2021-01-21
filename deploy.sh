#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist
cp index.html 404.html
echo 'www.mikilombardi.com' > CNAME

git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/TheJoin95/thejoin95.github.io.git master

cd -
