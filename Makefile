update-readme:
	git show master:README.md > README.md

run:
	jekyll serve --watch
