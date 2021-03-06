#### configuration

NAME = colorize-pinyin
VERSION = 2.1.2

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
	rm -rf "$(BKRSINFO)/$(NAME)@$(VERSION)"
	mkdir -p "$(BKRSINFO)/$(NAME)@$(VERSION)"
	./assemble "$(BKRSINFO)/$(NAME)@$(VERSION)/$(NAME).js" onload ie css filter $(SRC)/bkrs.js
	cd "$(BKRSINFO)" && zip -q -9r "$(NAME)@$(VERSION).zip" "$(NAME)@$(VERSION)"
	@echo "done: bkrs."

du:
	rm -rf "$(DU)/$(NAME)@$(VERSION)"
	mkdir -p "$(DU)/$(NAME)@$(VERSION)"
	./assemble "$(DU)/$(NAME)@$(VERSION)/user.js" onload filter $(SRC)/dict_uni.js
	mv "$(DU)/$(NAME)@$(VERSION)/user.min.js" "$(DU)/$(NAME)@$(VERSION)/user.js"
	cp -r css "$(DU)/$(NAME)@$(VERSION)/css"
	cd "$(DU)" && zip -q -9r "$(NAME)@$(VERSION).zip" "$(NAME)@$(VERSION)"
	@echo "done: du."

test:
	NODE_ENV=test mocha test
