function Write(element) {
	var text = $(element).html();
	var i = 1;
	var toot = setInterval(function(){
		$(element).html(text.substring(0,i));
		i += 3;
		if (i > text.length) {
			clearInterval(toot);
			$(element).html(text);
		}
	}, 15);
}
