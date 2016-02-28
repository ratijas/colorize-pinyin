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
	uglifyjs $(BKRSINFO)/$(NAME).js -o $(BKRSINFO)/$(NAME).min.js -c -m
	# after minifying, because there's code for IE inside comments
	cat $(SRC)/onload-ie.js $(BKRSINFO)/$(NAME).js > tmp && mv tmp $(BKRSINFO)/$(NAME).js
	cat $(SRC)/onload-ie.js $(BKRSINFO)/$(NAME).min.js > tmp && mv tmp $(BKRSINFO)/$(NAME).min.js
	@echo "done: bkrs."

