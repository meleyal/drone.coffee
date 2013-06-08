PATH := ./node_modules/.bin:${PATH}

build:
	npm install
	brunch build --optimize

docs:
	docco --layout classic app/*.coffee\
	&& mv docs/application.html docs/index.html\
	&& sed -i "" s/application.html/index.html/g docs/*.html

deploy: build docs
	mv public /tmp && mv docs /tmp/public\
	&& git checkout gh-pages\
	&& rm -rf `ls`\
	&& mv /tmp/public/* .\
	&& rm -rf /tmp/public\
	&& git add .\
	&& git commit -m "deploy"\
	&& git push\
	&& git checkout master
