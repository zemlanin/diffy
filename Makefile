webpack = $(shell npm bin)/webpack
webpack-dev-server = $(shell npm bin)/webpack-dev-server

.PHONY: dist
dist:
	$(webpack) --progress

.PHONY: watch
watch:
	$(webpack) --progress --watch

.PHONY: hot
hot:
	$(webpack-dev-server) --config=webpack.hot.config.js --inline --hot
