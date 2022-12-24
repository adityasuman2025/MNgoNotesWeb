mv public public-pwa
mv public-ext public
INLINE_RUNTIME_CHUNK=false REACT_APP_EXT=ext GENERATE_SOURCEMAP=false react-scripts build
mv public public-ext
mv public-pwa public