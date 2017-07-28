.DEFAULT_GOAL:= build

ensure_dist:
	mkdir -p dist

clean_dist: ensure_dist
	rm -rf dist/*

copy_index:
	cp ./index.html dist/index.html

bundle_javascript:
	./node_modules/.bin/browserify --entry ./app/start.js --outfile ./dist/bundle.js --transform [ babelify ]

write_to_dist: copy_index bundle_javascript

build: clean_dist write_to_dist

run_server:
	cd dist && python -m SimpleHTTPServer

dev: build run_server