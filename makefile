#!make
MAKEFLAGS += --silent
DDATE = %date:~10,4%%date:~4,2%%date:~7,2%

install:
		npm install -g tiddlywiki

build:
		python ./brain2tiddly/main.py
		tiddlywiki --build index

push:
		git add .
		git commit . -m "$(DDATE) changes"
		git push