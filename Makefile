#### configuration

NAME = colorize-pinyin
VERSION = 0.9.0

SRC = src
FINAL = final

BKRSINFO = $(FINAL)/bkrs.info

.SILENT:

#### rules

TARGETS = all help bkrs clean

.PHONY: $(TARGETS)
all: bkrs

help:
	@echo "$(NAME) $(VERSION) build"
	@echo
	@echo "  make help  - display this help"
	@echo "  make bkrs  - bkrs.info version of frontend"
	@echo "  make clean - clean up"

clean:
	@echo "general $(NAME) cleanup..."
	rm -rf $(FINAL)

bkrs:
	mkdir -p $(BKRSINFO)
	rm -f $(BKRSINFO)/$(NAME).js
	cat $(SRC)/bkrs.js      >> $(BKRSINFO)/$(NAME).js
	cat $(SRC)/core.js      >> $(BKRSINFO)/$(NAME).js
	# after minifying, because there's code for IE inside comments
	cat $(SRC)/onload-ie.js $(BKRSINFO)/$(NAME).js > temp
	mv temp $(BKRSINFO)/$(NAME).js
	@echo "done: bkrs."

