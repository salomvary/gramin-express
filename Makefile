update-readme:
	git show master:README.md > README.md

run:
	jekyll serve --watch

update-and-push:
	git commit -am 'Update site'
	git push
