/* при загрузке dom */
window.onDomReady(function () {
    /* корневая ветка */
    var rootNode;
    if (!! window.ColorizeFilter) {
    /* запрашивается у фильтра, если таковой существует, иначе -- <body> */
        rootNode = window.ColorizeFilter.rootNode();
        if (!rootNode) {
            rootNode = document.querySelector('body');
        };
    }; // конец if

    /* список текстовых веток */
    var textNodeList = searchForTextNodeIn(
        rootNode,
        /* фильтр, если таковой существует */
        ((!! window.ColorizeFilter ) ?
            window.ColorizeFilter.filterNode :
            null
        )
    ); // конец textNodeList

    /* кол-во эл. в списке */
    var textNodeListLength = textNodeList.length;
    /* перечислить все, начиная с нулевой и до кол-ва эл. (см. строку выше) */
    for ( var i = 0; i < textNodeListLength; ++i ) {
        /* одна текстовая ветка, прошедшая фильтрацию */
        textNode = textNodeList[i];

        /* найти пиньинь в строке */
        var found = searchForPinYinInString( textNode.textContent );
        
        /* если ни одного нету, пропустить */
        if ( Object.keys( found ).length == 0 ){
            continue;
        };

        /*
         * генерация span-тегов с классами .t0 - .t4
         * расскашеные ветки записываются в colorizedTextNodesList
         */
        colorizePinYin( textNode, found );
    };

    /* заменить ч/б ветки на цветные */
    colorizeAllPinYin( true );
}); // конец onDomReady( fn(){} )
