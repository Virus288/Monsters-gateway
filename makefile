
clean:
	rm -rf ./build/

test:
	clear \
	&& npm run test:unit \
	&& npm run test:db \
	&& npm run test:e2e
