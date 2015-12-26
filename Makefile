webpack = $(shell npm bin)/webpack

.PHONY: dist
dist:
	$(webpack) --progress

.PHONY: watch
watch:
	$(webpack) --progress --watch
