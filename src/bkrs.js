
/* заточено под bkrs.info */
(function (window) {
	/* ветка, с которой начинать поиск; приватная переменная */
	var rootNode;

	window.ColorizeFilter = {
		/* доступ к приватной переменной */
		rootNode: function () {
			/* ленивая инициализация */
			if (!rootNode)
				/* эта функция должна быть вызвана после загрузки dom */
				rootNode = document.getElementById('ajax_search');
			return rootNode;
		}, // конец rootNode()

		/* фильтрует ветки; возвращает false, если ветка не подходит */
		filterNode: function (node) {
			/* результат сравнений; по умолчанию -- подходит */
			var ok = true;

			var tagName = node.tagName.toLowerCase();
			var id = node.id;
			var style = node.getAttributeNode( 'style' );

			/* пропустить теги <a>, <input>, <span style="color:brown">, *[id="userName"] */
			if ( tagName == 'a' ||
				 tagName == 'input' ||
				 ( tagName == 'span' &&
				 	!!style &&
				 	style.nodeValue == 'color:brown' ) ||
				 id == 'userName' ){
				/* не подходит */
				ok = false;
			};
			return ok;
		} // конец filterNode()
	}; // конец window.Colorize
})(window);
