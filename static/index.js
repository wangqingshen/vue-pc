
	//屏幕适配
	window.onresize = function (){
		  var whdef = 100/1024;
		  var wH = window.innerHeight;
		  var wW = window.innerWidth;
		  var rem = wW * whdef;
		  document.documentElement.setAttribute("font-size",rem + 'px')
		};
	window.onload = function(){
		  var whdef = 100/1024;
		  var wH = window.innerHeight;
		  var wW = window.innerWidth;
		  var rem = wW * whdef;			 
		  // getElementsByTagName('html')[0].setAttribute("font-size",rem + 'px')
		  document.documentElement.setAttribute("font-size",rem + 'px')
		};