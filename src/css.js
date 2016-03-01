/* прикрепление таблицы стилей */
(function (global) {

var
    black   = '#000',
    gray    = '#696969',
    red     = '#f94229',
    green   = '#61c538',
    violet  = '#8780f7',
    pink    = '#ec8af9',
    blue    = '#427DF7',
    orange  = '#FE8E37',

// [.t0 , .t1 , .t2 , .t3 , .t4 ]
    themes = {
        'none': null,
        'b&w': [gray, black, black, black, black],
        'pleco': [gray, red, green, violet, pink],
        'cc-cedict': [gray, red, orange, green, blue],
        'mandarin': [gray, orange, green, blue, red]
    },

    getThemeNamed = function(name) {
        var colors = themes[name];
        return colors ? colors : null;
    },

    STYLE_TAG_ID = 'ColorizeStyleID';

function connectStylesheet(themeName) {

    var colors = getThemeNamed(themeName),
        styleNode, styleText = "";

    if (!colors) {return};

    if (! (styleNode = document.getElementById(STYLE_TAG_ID)))
    {
        styleNode = document.createElement('style');
        styleNode.id = STYLE_TAG_ID;
        styleNode.type = 'text/css';
        document.querySelector('head').appendChild(styleNode);
    }

    styleNode.textContent = "";

    // tones from 0 to 4
    for ( var i = 0; i <= 4; ++i ) {
        /* .t1 { color: #rgb } */
        styleText += '.t'+i+'{color:'+colors[i]+'} ';
    }
    styleNode.textContent = styleText;
}

function searchForTheme() {
    /* search for window.ARGS.theme */
    if (!! window.ARGS && !! window.ARGS.theme) {
        return window.ARGS.theme;
    } else {
        // default theme
        return 'mandarin';
    }
}

window.onDomReady(function () {
    connectStylesheet(searchForTheme());
});

})(window);