#!make
MAKEFLAGS += --silent
DDATE = %date:~10,4%%date:~4,2%%date:~7,2%

ifeq ($(OS),Windows_NT)

ifneq ($(strip $(filter %sh,$(basename $(realpath $(SHELL))))),)
POSIXSHELL := 1
else
POSIXSHELL :=
endif

else
# not on windows:
POSIXSHELL := 1

endif

ifneq ($(POSIXSHELL),)

CMDSEP := ;
PSEP := /
CPF := cp -f

else

CMDSEP := &
PSEP := \\
CPF := copy /y

endif

install:
		npm install -g tiddlywiki

build:
		tiddlywiki --build index

push:
		git add .
		git commit . -m "$(DDATE) changes"
		git push --set-upstream origin master