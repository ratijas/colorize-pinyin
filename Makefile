#### configuration

NAME = colorize-pinyin
VERSION = 0.9.1

SRC = src
FINAL = final

BKRSINFO = $(FINAL)/bkrs.info
DU = $(FINAL)/Dictionary Universal

.SILENT:

#### rules

TARGETS = all help bkrs du clean test

.PHONY: $(TARGETS)
all: bkrs du

help:
	@echo "$(NAME) $(VERSION) build"
	@echo
	@echo "  make help  - display this help"
	@echo "  make bkrs  - bkrs.info version of frontend"
	@echo "  make du    - Dictionary Universal version"
	@echo "  make clean - clean up"

clean:
	@echo "general $(NAME) cleanup..."
	rm -rf $(FINAL)

bkrs:
	mkdir -p "$(BKRSINFO)/$(NAME)@$(VERSION)"
	./assemble "$(BKRSINFO)/$(NAME)@$(VERSION)/$(NAME).js" onload ie css filter $(SRC)/bkrs.js
	cd $(BKRSINFO) && zip -q -9r "$(NAME)@$(VERSION).zip" "$(NAME)@$(VERSION)"
	@echo "done: bkrs."

du:
	mkdir -p "$(DU)/$(NAME)@$(VERSION)"
	./assemble "$(DU)/$(NAME)@$(VERSION)/user.js" onload filter $(SRC)/dict_uni.js
	mv "$(DU)/$(NAME)@$(VERSION)/user.min.js" "$(DU)/$(NAME)@$(VERSION)/user.js"
	cp -r css "$(DU)/$(NAME)@$(VERSION)/css"
	@echo "done: du."

test:
	NODE_ENV=test mocha test
