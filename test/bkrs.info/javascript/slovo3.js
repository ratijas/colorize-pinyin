// show google translation
function show_translation(response)
{
	$('div#google_translation').html('1) ' + response.data.translations[0].translatedText);
}
$('a#show_google_trans').click(function()
{
	$(this).remove()
	$('body').append('<br /><br />');
	$("html, body").animate({ scrollTop: $(document).height() }, "fast");
	$('div#google_translation').html("1) <img src='images/dif/waiting.gif' />");
	$("#bing_translation").html("2) <img src='images/dif/waiting.gif' />");

	// google
      var newScript = document.createElement('script');
      newScript.type = 'text/javascript';
      var sourceText = escape(word_for_google);
      var source = 'https://www.googleapis.com/language/translate/v2?key=AIzaSyBcieO3otDxq-bpS4LwjkjAFJX_A0FM-tU&target='+lang_to+'&source='+lang_from+'&q='+word+'&callback=show_translation';
      newScript.src = source;
      document.getElementsByTagName('head')[0].appendChild(newScript);

	// bing
	bing_get_token();

	return false;
});

// get token for bing
function bing_get_token()
{
	$.ajax({
		url: 'bing_token.php',
		type: "GET",
		cache: true,
		dataType: 'json',
		success: function (data)
		{
			bing_token = data.access_token;
			bing_translate(word_for_google, lang_from, lang_to);
		}
	});
}

// bing translate
function bing_translate(text, from, to)
{
	var p = new Object;
	p.text = text;
	p.from = from;
	p.to = to;

	// A major puzzle solved.  Who would have guessed you specify the jsonp callback in oncomplete?
	p.oncomplete = 'bing_TranslateCallback';

	// Another major puzzle.  The authentication is supplied in the deprecated appId param.
	p.appId = "Bearer " + bing_token;

	var requestStr = "http://api.microsofttranslator.com/V2/Ajax.svc/Translate";

	$.ajax({
		url: requestStr,
		type: "GET",
		data: p,
		dataType: 'jsonp',
		cache: true
	});
}

// Bing translate oncomplete
function bing_TranslateCallback(response)
{
	$("#bing_translation").text('2) ' + response);
	$('#auto_trans_td').css('background', '#FFF8C2');
}

function insert_hanzi(hazi) {
	text = $('#ch_input').val() + hazi;
	$('#ch_input').val(text);
}


if ( typeof input_focus == 'undefined' || input_focus == 1 )
	$('#kw').focus();

$('#handwriting-img').click(function()
{
	var top = $(this).position().top - 10;
	var left = $(this).position().left;
 	$('#handwriting').css({top:top,left:left}).show().html("<div style='z-index:10'><applet mayscript='true' code='MdbgHWIme.class' archive='javascript/handwriting.jar' width='275' height='475'><param name='charSelectedJSEventHandler' value='insert_hanzi' />Установите <a href='http://www.java.com/'>SUN Java</a></applet><div class='pt10'>Порядок черт имеет значение</div></div>");
})

// show hidden
$('.not_full').hover(
	function()
	{
		$(this).find('.hidden').slideToggle('fast');
		$(this).find('.link_show').css('visibility', 'hidden');
	} ,
	function()
	{
		$(this).find('.hidden').slideToggle('fast');
		$(this).find('.link_show').css('visibility', 'visible');
	}
);

//open comment form
$('a#open_comment_form').click(function()
{
	$('form#form_comment_word').toggle();
	$('#comment_word_textarea').focus();

	return false;
});

// send comment
$('form#form_comment_word').submit(function()
{

//	var text = encodeURIComponent($('#comment_word_textarea').val());
	var text = $('#comment_word_textarea').val();

	$(this).html('<center>ждите...</center>');

	ARGS['word'] = word;
	ARGS['text'] = text;

	$.post(PATH+'class/ajax/forum_word_comment.php', ARGS, function(data)
	{
		// redirect to forum
		window.location = 'changes.php?id='+data;
	});

	return false;
});

// shouxie
var showxie = 0;
$('#sx').click(function ()
{
	var input = $('#kw');
	if ( showxie == 0 )
	{
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", 'http://s.pc.qq.com/webime/hw/js/handwritingapi.js');
		fileref.onload = function()
		{
			var container = document.getElementById('shouxie_container');
			QQShuru.HWPanel(container, handWriteCallback);
			function handWriteCallback(result)
			{
				if ( result )
				{
					input.val(input.val() + result);

					input.focus();
					var tmpStr = input.val();
					input.val('');
					input.val(tmpStr);
				}

				$('#shouxie_container').toggle();
			}
				$('#qqshuru_title').addClass('gray').html('手写输入法 - ручной ввод');
				$('#qqshuru_back_btn').addClass('gray').html('назад');
				$('#qqshuru_clear_btn').addClass('gray').html('очистить');
		};
		document.getElementsByTagName('body')[0].appendChild(fileref);

		showxie = 1;
	}
	else
		$('#shouxie_container').toggle();
});

// input
//var w = window,d = document,n = navigator,k = d.f.ch
//if (w.attachEvent) {
//    w.attachEvent("onload", function() {k.focus();})
//} else {
//    w.addEventListener('load', function() {k.focus()},true)
//};
//var hw = {};
//hw.i = d.getElementById("sx");
//var il = false;
//if (/msie (\d+\.\d)/i.test(n.userAgent)) {
//    hw.i.setAttribute("unselectable", "on")
//} else {
//    var sL = k.value.length;
//    k.selectionStart = sL;
//    k.selectionEnd = sL
//}
//hw.i.onclick = function(B) {
//    var B = B || w.event;
//    B.stopPropagation ? B.stopPropagation() : (B.cancelBubble = true);
//    if (d.selection && d.activeElement.id && d.activeElement.id == "kw") {
//        hw.hasF = 1
//    } else {
//        if (!d.selection) {
//            hw.hasF = 1
//        }
//    }
//// http://www.baidu.com/hw/hwInput_1.1.js
//    if (!il) {
//        var A = d.createElement("script");
//        A.setAttribute("src", "http://www.baidu.com/hw/hwInput.js");
//        d.getElementsByTagName("head")[0].appendChild(A);
//        il = true;
//    }
//};

// highlight for py search
$('#py_table tr:gt(0)').hover(
	function()
	{
		$(this).addClass('hover_background');
	},
	function()
	{
		$(this).removeClass('hover_background');
	}
)

// hover td for byword
$('td[word]').hover(function()
{
	var word = $(this).attr('word');
	$('td[word='+word+']').addClass('td_word_hover');
}, function () {
	var word = $(this).attr('word');
	$('td[word='+word+']').removeClass('td_word_hover');
});