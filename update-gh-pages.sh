#! /bin/sh

set -eu

echo "Regenerating bundle."

rm -rf bundle.*
npm run bundle

echo "Copying/moving files in working dir."

rm -rf __temp_bundle.js __temp_bundle.js.map __temp_static \
  __temp_p5-widget.html __temp_p5-widget.js __temp_preview-frame.html \
  __temp_index.html
mv bundle.js __temp_bundle.js
mv bundle.js.map __temp_bundle.js.map
cp -r static/ __temp_static/
cp p5-widget.html __temp_p5-widget.html
cp p5-widget.js __temp_p5-widget.js
cp preview-frame.html __temp_preview-frame.html
cp index.html __temp_index.html

echo "Switching to gh-pages branch."

git checkout gh-pages

rm -rf bundle.js bundle.js.map static p5-widget.html p5-widget.js \
  preview-frame.html index.html
mv __temp_bundle.js bundle.js
mv __temp_bundle.js.map bundle.js.map
mv __temp_static static
mv __temp_p5-widget.html p5-widget.html
mv __temp_p5-widget.js p5-widget.js
mv __temp_preview-frame.html preview-frame.html
mv __temp_index.html index.html

echo "Staging new/changed files."

git add bundle.js bundle.js.map static/ p5-widget.html p5-widget.js \
  preview-frame.html index.html

#echo "Done. Run 'git diff --staged' to review changes."
#echo "If satisfied, run 'git commit' to commit changes."
echo "Committing changes."

git commit -m "Rebuild site."

echo "Pushing changes."

git push

git checkout master
