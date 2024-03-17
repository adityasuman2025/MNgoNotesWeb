# script to build chrome extension
rm -rf build
cd public
mv manifest.json manifest-pwa.json
mv manifest-ext.json manifest.json
cd ..
INLINE_RUNTIME_CHUNK=false REACT_APP_EXT=ext GENERATE_SOURCEMAP=false react-scripts build
cd public
mv manifest.json manifest-ext.json
mv manifest-pwa.json manifest.json
