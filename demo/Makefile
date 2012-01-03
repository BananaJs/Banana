
CLOSUREDIR = ../closure
CALCDEPS = $(CLOSUREDIR)/bin/calcdeps.py
FRAMEWORKDIR = ../framework
APPDIR = application
BUILDDIR = ../build

BANANA=${FRAMEWORKDIR}/Banana.js
APP=Application.js
MINIFIED=Application.min.js

CALCDEPSCMD=$(CALCDEPS) -p $(CLOSUREDIR) -p $(FRAMEWORKDIR) -p ${APPDIR} -i ${APP}

all : deps 

.PHONY : clean deps.js ${MINIFIED} docs

clean : 
	rm -rf docs/*
	rm -f deps.js
	rm -f ${MINIFIED}

deps : deps.js

release : ${MINIFIED}

docs :
	(cd $(BUILDDIR) && java -jar jsrun.jar jsdoc/run.js -c=jsdoc.conf)

lint :
	@cat $(BUILDDIR)/jslint.js $(BUILDDIR)/rhino.js > $(BUILDDIR)/rhinoed_jslint.js
	@find . -name '*.js' -exec $(BUILDDIR)/run-jslint.sh {} \;

${MINIFIED}:
	${CALCDEPSCMD} -c $(BUILDDIR)/compiler.jar -f "--compilation_level=SIMPLE_OPTIMIZATIONS" -o compiled > $@

deps.js :
	$(CALCDEPSCMD) -o deps > $@
