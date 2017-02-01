postinstall:	createDevelopmentSymLinks

createDevelopmentSymLinks:
	cd ./node_modules; \
	ln -snfv ../src src; \
	ln -snfv ../src/lib lib; \

createProductionSymLinks:
	cd ./node_modules; \
	ln -snfv ../build src; \
	ln -snfv ../build/lib lib; \

#
# .PHONY: build
