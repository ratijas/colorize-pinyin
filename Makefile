#### configuration

NAME = colorize-pinyin
VERSION = 0.9.0

SRC = src
FINAL = final

BKRSINFO = $(FINAL)/bkrs.info

.SILENT:

#### rules

TARGETS = all help bkrs clean test

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
	mkdir -p "$(BKRSINFO)/$(NAME)@$(VERSION)"
	./assemble "$(BKRSINFO)/$(NAME)@$(VERSION)/$(NAME).js" onload ie css filter $(SRC)/bkrs.js
	cd $(BKRSINFO) && zip -q -9r "$(NAME)@$(VERSION).zip" "$(NAME)@$(VERSION)"
	@echo "done: bkrs."

test:
	NODE_ENV=test mocha test
