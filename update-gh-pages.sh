#! /bin/sh

set -eu

echo "Regenerating bundle."

rm -rf *.bundle.*
NODE_ENV=production npm run bundle

echo "Cloning website into ./website/."

rm -rf website
git clone . website -b gh-pages -o parentdir
cd website
git remote add upstream https://github.com/toolness/p5.js-widget.git
git pull upstream gh-pages
git rm -rf static/
cd ..

echo "Copying files in working dir to ./website/."

cp -r static/ website/static/
cp \
  p5-widget.html p5-widget.js p5-widget.js.map \
  preview-frame.html index.html \
  main.bundle.js* \
  preview-frame.bundle.js* \
  website/

echo "Staging new/changed files."

cd website
git add \
  main.bundle.js main.bundle.js.map \
  preview-frame.bundle.js preview-frame.bundle.js.map \
  static/ p5-widget.html p5-widget.js p5-widget.js.map \
  preview-frame.html index.html

#echo "Done. Run 'git diff --staged' to review changes."
#echo "If satisfied, run 'git commit' to commit changes."
echo "Committing changes."

git commit -m "Rebuild site."

echo "Pushing changes."

git push parentdir gh-pages
cd ..
git push origin gh-pages

echo "Done!"
