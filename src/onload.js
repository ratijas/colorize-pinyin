!function(e){function n(){arguments.callee.done||(arguments.callee.done=!0,t&&t(),o=!0)}var t="",o=!1,a=function(e){if(o)"function"==typeof e&&e();else{var n=t;t="function"!=typeof t?e:function(){n(),e()}}};if(e.onDomReady=a,document.addEventListener&&document.addEventListener("DOMContentLoaded",n,!1),/WebKit/i.test(navigator.userAgent))var d=setInterval(function(){/loaded|complete/.test(document.readyState)&&(clearInterval(d),n())},10);e.onload=n}(window);