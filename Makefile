PATH := ./node_modules/.bin:${PATH}

.PHONY : init clean-docs clean build test dist publish

init:
	npm install

docs:
	docco --layout classic app/*.coffee\
	&& mv docs/application.html docs/index.html\
	&& sed -i "" s/application.html/index.html/g docs/*.html

clean-docs:
	rm -rf docs/

clean: clean-docs
	rm -rf lib/ test/*.js

build:
	brunch build --optimize

test:
	brunch build && karma start test/karma.conf.js

deploy: init build docs
	mv public /tmp && mv docs /tmp/public\
	&& git checkout gh-pages\
	&& rm -rf `ls`\
	&& mv /tmp/public/* .\
	&& rm -rf /tmp/public\
	&& git add .\
	&& git commit -m "deploy"\
	&& git push\
	&& git checkout master






