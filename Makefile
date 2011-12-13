
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

${MINIFIED}:
	${CALCDEPSCMD} -c build/compiler.jar -o compiled > $@

deps.js :
	$(CALCDEPSCMD) -o deps > $@
