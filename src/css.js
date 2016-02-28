/* прикрепление таблицы стилей */
(function( obj ){
    /* цвета */
    var
        black   = '#000',
        gray    = '#696969'
        red     = '#f94229',
        green   = '#61c538',
        violet  = '#8780f7',
        pink    = '#ec8af9',
        blue    = '#427DF7',
        orange  = '#FE8E37';

    /* темы, основываются на цветах выше 
     * [.t0 , .t1 , .t2 , .t3 , .t4 ]
     */
    var themes = {
        'none': null,
        'b&w': [gray, black, black, black, black],
        'pleco': [gray, red, green, violet, pink],
        'cc-cedict': [gray, red, orange, green, blue],
        'mandarin': [gray, orange, green, blue, red]
    };

    /* 
     * можно расширять собственными темами
     * ``name'' -- желательно строка
     * ``colors'' должна содержать 5 цветов-строк
    */
    obj.addTheme = function( name, colors ){
        if ( colors.length !== 5 ) return null;
        themes[ name ] = colors;
    };

    /* вернуть либо тему из словаря, либо null */
    getColorsForTheme = function( theme ){
        var colors = themes[ theme ];
        return colors ? colors : null;
    }; // конец getColorsForTheme()

    /* константа */
    var styleTagId = 'ColorizeStyleID';

    /* добавить, или обновить таблицу стилей */
    obj.connectStylesheet = function( themeName ){

        var theme = getColorsForTheme( themeName );
        /* тема с таким именем не существует */
        if (! theme ) {return};

        var styleNode, styleText;

        if ( !( styleNode = document.getElementById( styleTagId ))){
            /* нашего тега style нет, создаём */
            styleNode = document.createElement( 'style' );
            styleNode.id = styleTagId;
            styleNode.type = 'text/css';
            document.querySelector( 'head' ).appendChild( styleNode );
        }; // конец if

        /* очистка */
        styleNode.textContent = "";
        styleText = "";
        /* от нулегого тона до четвёртого */
        for ( var i = 0; i <= 4; ++i ) {
            /* .t1 { color: #rgb } */
            styleText += '.t'+i+'{color:'+theme[ i ]+'} ';
        };
        /* глубокий смысл в том, что браузеру проще один раз пропарсить полную таблицу стилей, чем после каждого дополнения */
        styleNode.textContent = styleText;
    }; // конец connectStylesheet()
})(window); // конец (fn)()

function searchForTheme () {
    /* попытаться найти в window.ARGS.theme */
    if ( !! window.ARGS && !! window.ARGS.theme ){
        /* найдена */
        return window.ARGS.theme;
    } else {
        /* не найдена, вернуть значение по умолчанию -- ``mandarin'' */
        return 'mandarin';
    };
} // конец searchForTheme()

window.onDomReady(function () {

    /* найти название темы */
    var theme = searchForTheme();
    /* установить и присоединить соответствующую таблицу стилей */
    window.connectStylesheet( theme );

}); // конец onDomReady( fn(){} )
