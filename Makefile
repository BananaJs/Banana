
CLOSUREDIR = closure
CALCDEPS = $(CLOSUREDIR)/bin/calcdeps.py
FRAMEWORKDIR = framework
APPDIR = application
BUILDDIR = build

BANANA=${FRAMEWORKDIR}/Banana.js
APP=Application.js
MINIFIED=Application.min.js

CALCDEPSCMD=$(CALCDEPS) -p $(CLOSUREDIR) -p $(FRAMEWORKDIR) -p ${APPDIR} -i ${APP}

all : deps

.PHONY : clean deps.js ${MINIFIED}

clean : 
	rm -f deps.js
	rm -f ${MINIFIED}

deps : deps.js

release : ${MINIFIED}

build/compiler.jar :
	wget http://closure-compiler.googlecode.com/files/compiler-latest.zip
#	curl -O http://closure-compiler.googlecode.com/files/compiler-latest.zip
#	fetch http://closure-compiler.googlecode.com/files/compiler-latest.zip
#	echo "Don't know how to download files! Please download the Google Closure Compiler manually to the build/ directory."
	unzip compiler-latest.zip -d build
	rm compiler-latest.zip

${MINIFIED} : build/compiler.jar
	${CALCDEPSCMD} -c build/compiler.jar -o compiled > $@

deps.js :
	$(CALCDEPSCMD) -o deps > $@
