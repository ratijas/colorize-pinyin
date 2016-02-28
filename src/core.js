/*
 * window.ColorizeFilter
 * тип -- объект
 * должен реализовать два метода:
 * 
 * ColorizeFilterInterface {
 *   rootNode()
 *   filterNode()
 * }
 */



/* паралельные списки для исходных plain веток… */
var plainTextNodesList = [];
/* …и для сгенерированных ``цветных'' веток */
var colorizedTextNodesList = [];


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

	/* найти название темы */
	var theme = searchForTheme();
	/* установить и присоединить соответствующую таблицу стилей */
	window.connectStylesheet( theme );

}); // конец onDomReady( fn(){} )


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


function searchForTextNodeIn( node, filter, result ){
	/* создать пустой массив при первом вызове */
	result = result || [];
	/* потомки ветки */
	var childs = node.childNodes;
	/* … и их количество */
	var childsLength = childs.length;

	/* перечислить всех потомков ветки ``node'' */
	for ( var i = 0; i < childsLength; ++i ){
		/* конкретный потомок */
		var childNode = childs[i];

		/* если это не листик, а ветка, искать в нём */
		if ( childNode.nodeType == 1 /* ELEMENT_NODE */){
			tagName = childNode.tagName.toLowerCase();
			/* исключить скрипты, стили, и передать фильтру */
			if ( tagName === 'script' ||
				 tagName === 'style' ||
				 (!! filter                   /* фильтр на месте? */
				 	&& ! filter( childNode )) /* тогда фильтруем */
			   ){
				/* ветка не прошла фильтрацию, следующий */
				continue;
			};
			/* рекурсия: см. рекурсия */
			searchForTextNodeIn( childNode, filter, result );
		} else /* текстовая ветка */
		if ( childNode.nodeType == 3 /*TEXT_NODE*/){
			/* не обрабатывать пустые строки */
			if ( childNode.textContent.match( /^\s*$/ ) != null ){
				continue;
			};
			/* сохранить в массив */
			result.push( childNode );
		};
		/* все остальные: ничего не делать */
	}; // конец for i
	/* вернуть массив */
	return result;
}; // конец searchForTextNodeIn()


/* объявить список раньше функции, чтобы избежать многократного разбора
 * список отсортирован по длине, чтобы более длинные варианты проходили
 * проверку раньше
 */
var allPinYinList = 'zhuang,shuang,chuang,zhuan,zhuai,zhong,zheng,zhang,xiong,xiang,shuan,shuai,sheng,shang,qiong,qiang,niang,liang,kuang,jiong,jiang,huang,guang,chuan,chuai,chong,cheng,chang,zuan,zong,zhuo,zhun,zhui,zhua,zhou,zhen,zhei,zhao,zhan,zhai,zeng,zang,yuan,yong,ying,yang,xuan,xing,xiao,xian,weng,wang,tuan,tong,ting,tiao,tian,teng,tang,suan,song,shuo,shun,shui,shua,shou,shen,shei,shao,shan,shai,seng,sang,ruan,rong,reng,rang,quan,qing,qiao,qian,ping,piao,pian,peng,pang,nüe,nuan,nong,ning,niao,nian,neng,nang,ming,miao,mian,meng,mang,lüe,luan,long,ling,liao,lian,leng,lang,kuan,kuai,kong,keng,kang,juan,jing,jiao,jian,huan,huai,hong,heng,hang,guan,guai,gong,geng,gang,feng,fang,duan,dong,ding,diao,dian,deng,dang,cuan,cong,chuo,chun,chui,chua,chou,chen,chao,chan,chai,ceng,cang,bing,biao,bian,beng,bang,zuo,zun,zui,zou,zhu,zhi,zhe,zha,zen,zei,zao,zan,zai,yun,yue,you,yin,yao,yan,xun,xue,xiu,xin,xie,xia,wen,wei,wan,wai,tuo,tun,tui,tou,tie,tao,tan,tai,suo,sun,sui,sou,shu,shi,she,sha,sen,sei,sao,san,sai,ruo,run,rui,rua,rou,ren,rao,ran,qun,que,qiu,qin,qie,qia,pou,pin,pie,pen,pei,pao,pan,pai,nü,nuo,nou,niu,nin,nie,nen,nei,nao,nan,nai,mou,miu,min,mie,men,mei,mao,man,mai,lü,luo,lun,lou,liu,lin,lie,lia,lei,lao,lan,lai,kuo,kun,kui,kua,kou,ken,kei,kao,kan,kai,jun,jue,jiu,jin,jie,jia,huo,hun,hui,hua,hou,hng,hen,hei,hao,han,hai,guo,gun,gui,gua,gou,gen,gei,gao,gan,gai,fou,fen,fei,fan,duo,dun,dui,dou,diu,die,den,dei,dao,dan,dai,dia,cuo,cun,cui,cou,chu,chi,che,cha,cen,cei,cao,can,cai,bin,bie,ben,bei,bao,ban,bai,ang,ê,zu,zi,ze,za,yu,yi,ye,ya,xu,xi,wu,wo,wa,tu,ti,te,ta,su,si,se,sa,ru,ri,re,qu,qi,pu,po,pi,pa,ou,nu,ni,ng,ne,na,mu,mo,mi,ma,me,lu,li,le,la,ku,ke,ka,ju,ji,hu,hm,he,ha,gu,ge,ga,fu,fo,fa,er,en,ei,du,di,de,da,cu,ci,ce,ca,bu,bo,bi,ba,ao,an,ai,yo,o,n,m,e,a'.split( ',' );
/* длина списка */
var allPinYinListLength = allPinYinList.length;

function skip( charP, pyPlain ){
	pyPlainLength = pyPlain.length;

	/* пропустить все не-пробелы */
	var spaceRE = /\W/;
	while (
		charP < pyPlainLength && /* не выйти за пределы строки… */
		! pyPlain[ charP ].match( spaceRE )  /* …и это не пробел */
		){
		/* следующий */
		++charP;
	}; // конец while (! match())

	/* а заодно и все пробелы */
	while (
		charP < pyPlainLength && /* не выйти за пределы строки… */
		pyPlain[ charP ].match( spaceRE ) /* …и это пробел */
		){
		/* следующий */
		++charP;
	}; // конец while ( match())
	return charP;
}; // конец skip()

/*
* возвращает словарь
* { index: pinYinSubstring [, ...] }
*/
function searchForPinYinInString( pinYin ){
	var result = {};
	
	/* упрощение поиска: замена букв с тонами на те же, но без тонов */
	var pyPlain =
		pinYin                      /* входные данные */
		.toLowerCase()              /* нижний регистр */
		.replace( /[āáǎăà]/g, 'a' ) /* для третьего тона может быть ошибочно использована буква 'a' с закруглённой галочкой */
		.replace( /[ēéěè]/g, 'e' )
		.replace( /[ōóǒò]/g, 'o' )
		.replace( /[ūúǔù]/g, 'u' )
		.replace( /[ǖǘǚǜ]/g, 'u' )
		.replace( /[īíǐì]/g, 'i' );

	/* длина входной строки */
	var pyPlainLength = pyPlain.length;
	/* пройтись по всей строке */
	for ( var charP = 0; charP < pyPlainLength; /* сдвиг счётчика вручную */ ){
		/* получить код символа */
		var ch = pyPlain.charCodeAt( charP );
		/* 97  -- это код символа 'a' */
		/* 122 -- это код символа 'z' */
		if ( ch < 97 || ch > 122 ){
			/* не буква латиницы */
			/* сдвиг счётчика */
			++charP;
			/* пропускаем */
			continue;
		}; // конец if

		/* если мы дошли сюда, значит символ -- буква латиницы */

		/* переменная ``e'' содержит текущий элемент поиска */
		var e = null;
		/* в случае нахождения ``found'' содержит строку */
		var found = null;
		/*
		 * циклический поиск строк из списка ``allPinYinList''
		 * в упрощёной входной строке c текущего индекса
		 */
		for ( var i = 0; i < allPinYinListLength; ++i ){
			e = allPinYinList[i];
			/* так быстрее, чем indexOf() потому, что не ищет по всей строке */
			/* от текущего индекса до (текущего индекса + длинна того чтения, который сверяем) */
			if ( pyPlain.substring( charP, charP + e.length ) == e ){
				/*
				 * правило апострофа:
				 * апостроф ставится перед словом на a/o/e.
				 * если следующая буква -- a/o/e, делаем откат на
				 *   одну букву назад и проверяем результат.
				 * слово не может начинаться с букв i/u
				 *     а буквы ``v'' вообще нет.
				 * ==============================================
				 * "режим дурака": попытка не сойти с рельс
				 * путём определения возможной комбинации 
				 */
				var nextChar = pyPlain[ charP + e.length ];
				if ( nextChar === 'a' ||
					  nextChar === 'o' ||
					  nextChar === 'e' ||
					  nextChar === 'u' ||
					  nextChar === 'i' ){
					/* убрать последний символ; откат на одну букву */
					var short_e = e.substring( 0, e.length - 1 );
					/* проверка */
					if ( allPinYinList.indexOf( short_e ) !== -1 ){
						/* всё ок. откат удался */
						e = short_e;
					} else {
						/* не получилось найти "сокращённый" вариант.
						 * оставляем длинный
						 */
						console.log( 'нужен апостроф в пиньине: ' + e );
					};
				};
				/* нашли, записываем  */
				found = e;
				/* прекращаем цикл */
				break;
			}; // конец if
		}; // конец for

		/* нашли */
		if ( found ){
			/* пригодится пару раз */
			var pyLength = found.length;
			/* записать соответствующую часть пиньиня из входной строки
			*  в словарь под ключом, равным текущему индексу
			*/
			result[ new Number( charP )] = pinYin
				.slice(
					charP, charP + pyLength
				);
			/* сдвинуть указатель за пределы текущего слова */
			charP += found.length;
		} else {
			/* это латинская буква, но пиньинь не нашли */
			charP = skip( charP, pyPlain );
		}; // конец if found
	}; // конец for charP

	/* вернуть словарь */
	return result;
}; // конец searchForPinYinInString()


/* возвращает тон для переданого слога */
function determineTone( pinYinWord ){
	/* быстрее и компактнее так, чем делать цикл и массив
	 * тон слога определяется наличием одного из этих символов
	 */
	if ( pinYinWord.match( /[āēūǖīō]/ ))
		return 1;
	if ( pinYinWord.match( /[áéúǘíó]/ ))
		return 2;
	if ( pinYinWord.match( /[ǎăěǔǚǐǒ]/ ))
		return 3;
	if ( pinYinWord.match( /[àèùǜìò]/ ))
		return 4;
	/* не нашли, значит нулевой тон */
	return 0;
}; // конец determineTone()


/* генерит теги span с классами .t0 - .t4 вокруг пиньиня */
function colorizePinYin( onNode, pinYinPairs ){
	/* onNode -- ветка с ресурсом */
	/* pinYinPairs -- словарь {index: pinYin [, ...]} */
	/* на всякий случай, если он там уже есть */
	if ( plainTextNodesList.indexOf( onNode ) != -1 ){
		return;
	}

	/* сразу определить тона. если все тона нулевые, не раскрашивать */
	var allTonesAreZero = true;
	var tones = {};
	/* start -- это ключ к ассоциативному массиву */
	for (start in pinYinPairs) {
		/* определить */
		var t = determineTone( pinYinPairs[ start ]);
		/* сохранить на потом */
		tones[ start ] = t;
		/* проверить */
		if (t != 0) {allTonesAreZero = false};
	}
	/* наверное, это не пиньинь, а английское слово */
	if (allTonesAreZero) {return};

	/* котейнер для всего содержимого этой ветки */
	/* <span class='pinYinWrapper'> */
	var pinYinSpan = document.createElement('span');
	pinYinSpan.classList.add('pinYinWrapper');

	/* предыдущая пара, нужна для вставки содержимого между пиньинем */
	var prevPairEnd = null;
	/* пригодиться много раз */
	var nodeTextContent = onNode.textContent;
	/* start -- это ключ ассоциативного массива */
	for ( start in pinYinPairs ){
		/* явно преобразовать */
		start = new Number( start );
		/* записать предшествующий не-пиньинь в родительский span */
		pinYinSpan.appendChild(
			document.createTextNode(			/* грамотно создаём текстовую ветку */
				nodeTextContent.slice(
					( prevPairEnd != null ) ?   /* резать от предыдущего конца */
						prevPairEnd :
						0,                   /* ну, или от начала строки */
					start                    /* до текущего начала, не включительно */
				)
			)
		);

		/* цветастый span для отдельного слога */
		var span = document.createElement( 'span' );

		var tone = tones[ start ];
		/* класс по номеру тона */
		span.classList.add( 't'+tone );
		/* внутренность (слог) тега */
		span.appendChild( document.createTextNode( pinYinPairs[ start ]));

		/* припаять к контейнеру */
		pinYinSpan.appendChild( span );
		/* записать текущую пару */
		prevPairEnd = start + pinYinPairs[ start ].length;
	};
	/* от последнего пиньиня и до конца */
	pinYinSpan.appendChild(
		document.createTextNode(
			nodeTextContent.slice( prevPairEnd )
		)
	);

	/* записать plain ветку в свой список… */
	plainTextNodesList.push( onNode );
	/* а контейнер симетрично записать в другой список */
	colorizedTextNodesList[ plainTextNodesList.length - 1 ] = pinYinSpan;
}; // конец colorizePinYin()

/* 
 * функция colorizeAllPinYin,
 */
(function (){
	/* последнее дествие, статическая переменная ф-ции colorizeAllPinYin */
	var pastAction = null; /* null | true | false */

	/* если ``b'' == true раскрасить, иначе наооборот */
	window.colorizeAllPinYin = function( b ){
		/*
		 * тип переданого аргумента конвертируется в boolean,
		 * если совпадает с предыдущим действием, выходим
		 */
		if (( typeof ( b = !!b ) !== 'boolean' ) || ( pastAction === b ))
			return;
		/* не совпало, обновляем переменную */
		pastAction = b;
		/* указатели на списки с plain и цветными ветками */
		var v1, v2;
		if ( b ){
			/* раскрасить */
			v1 = plainTextNodesList;
			v2 = colorizedTextNodesList;
		} else {
			/* обратное */
			v1 = colorizedTextNodesList;
			v2 = plainTextNodesList;
		};

		/* каждый элемент списка */
		for ( var el = v1.length - 1; el >= 0; el-- ){
			var node = v1[ el ];      /* ветка, которую заменить */
			var p = node.parentNode; /* пригодится два раза */

			/* припаять новую и удалить старую */
			p.insertBefore( v2[ el ], node );
			p.removeChild( node );
		}; // конец for el
	}; // конец window.colorizeAllPinYin
})(); // конец (fn)()

/* прикрепление таблицы стилей */
(function( obj ){
	/* цвета */
	var
		black 	= '#000',
		gray 	= '#696969'
		red 	= '#f94229',
		green 	= '#61c538',
		violet 	= '#8780f7',
		pink 	= '#ec8af9',
		blue 	= '#427DF7',
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
