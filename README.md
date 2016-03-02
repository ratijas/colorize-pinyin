welcome to use `colorize-pinyin.js` plug-in
===========================================

brief introduction
------------------
`colorize-pinyin.js` provides simple and fast way to find and colorize
chinese pinyin in string or even DOM.

it is done by parsing string or traversing DOM and wrapping founded pinyin with
special HTML classes, that can be used in css to change pinyin word's color
depending on it's tone.

usage
-----
download prebuilded minimized scripts from [latest release](https://github.com/ratijas/colorize-pinyin.js/releases/latest), include script to your web page template;

or clone a project and compile it by yourself with

```
git clone https://github.com/ratijas/colorize-pinyin.js.git
cd colorize-pinyin
make
```
note: compiled files will be in './final' directory.

or clone a project, hack with a sources and build your own customized version with `assemble` tool.

system requirements
-------------------
`color_pinyin` available in two languages:

  - [python](https://github.com/ratijas/colorize_pinyin)
  - [javascript](https://github.com/ratijas/colorize-pinyin.js):
      - website version
      - Dictionary Universal (for users of that iOS application)
      - you can assemble your own version using `assemble` script from this package

no onther packages required.

getting help
------------
if you need help with `colorize-pinyin.js`, you can get help on this forum thread (russian):
  - [bkrs.info](http://bkrs.info/taolun/thread-1123-lastpost.html)

for other languages, or if you discover any bugs, please file a ticket at:

  <https://github.com/ratijas/colorize-pinyin.js/issues>

