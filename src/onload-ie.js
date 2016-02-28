/* on ready function */
(function (window) {
	var funcDomReady='',
		DomReady = false;

	var onDomReady = function (func) { // функция добавления события
		if (!DomReady) {
	        var oldonload = funcDomReady;
	        if (typeof funcDomReady != 'function')
	                funcDomReady = func;
	        else {
	                funcDomReady = function() {
	                        oldonload();
	                        func();
	                }
	        }
	    } else {
	    	// документ уже загружен, просто вызвать func
	    	if (typeof func == 'function')
	    	    func();
	    }
	}

	// доступ к функции снаружи библиотеки
	window.onDomReady = onDomReady;

	function init() {
	    // выходим, если функция уже выполнялась
	    if (arguments.callee.done) return;

	    // устанавливаем флаг, чтобы функция не исполнялась дважды
	    arguments.callee.done = true;

	    if(funcDomReady)funcDomReady();	// вызываем всю цепочку обработчиков
	    DomReady = true;
	};

	/* для Mozilla/Firefox/Opera 9 */
	if (document.addEventListener)
	    document.addEventListener("DOMContentLoaded", init, false);

	/* для Internet Explorer */
	/*@cc_on @*/
	/*@if (@_win32)
	document.write("<script id=\"__ie_onload\" defer=\"defer\" src=\"javascript:void(0)\"><\/script>");
	var script = document.getElementById("__ie_onload");
	script.onreadystatechange = function() {
	    if (this.readyState == "complete")
	    init();
	}; // вызываем обработчик для onload
	/*@end @*/

	/* для Safari */
	if (/WebKit/i.test(navigator.userAgent)) { // условие для Safari
	    var _timer = setInterval(function() {
	    if (/loaded|complete/.test(document.readyState)) {
	        clearInterval(_timer);
	        init(); // вызываем обработчик для onload
	    }
	    }, 10);
	}

	/* для остальных браузеров */
	window.onload = init;
})(window);
