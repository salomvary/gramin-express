PRODUCT_NAME=$(shell node -e "console.log(require('./package.json').productName)")
VERSION=$(shell node -e "console.log(require('./package.json').version)")
SOURCES=$(wildcard app/* package.json LICENSE)

dist: package
	rm -f "dist/$(PRODUCT_NAME)-mac.zip"
	cd "target/$(PRODUCT_NAME)-darwin-x64" && zip -r "../../dist/$(PRODUCT_NAME)-mac.zip" "$(PRODUCT_NAME).app"

install-mac: package
	cp -r "target/$(PRODUCT_NAME)-darwin-x64/$(PRODUCT_NAME).app" /Applications

package: target/gramin-express.icns target/app/node_modules Credits.rtf
	echo "$@"
	npm run electron-packager -- \
		target/app \
		"$(PRODUCT_NAME)" \
		--platform=darwin \
		--arch=x64 \
		--version=0.36.8 \
		--app-version=$(VERSION) \
		--icon target/gramin-express.icns \
		--app-copyright="$(shell head -n 1 LICENSE)" \
		--asar=true \
		--overwrite \
		--out target
	cp Credits.rtf "target/$(PRODUCT_NAME)-darwin-x64/$(PRODUCT_NAME).app/Contents/Resources/en.lproj"

target/app/node_modules: target/app
	cd target/app && npm install --production
	touch $@

target/app: $(SOURCES)
	mkdir -p $@
	cp $(SOURCES) $@

target/gramin-express.icns: target/gramin-express.iconset
	iconutil -c icns -o $@ target/gramin-express.iconset

target/gramin-express.iconset: gramin-express-logo.svg
	node generate-iconset.js
	touch $@

clean:
	rm -rf target

mrproper:
	rm -rf target
	rm -rf node_modules
