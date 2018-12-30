/*
 * mobile-style.js - adds some responsiveness to Tinyboard
 * https://github.com/vichan-devel/Tinyboard/blob/master/js/mobile-style.js
 *
 * Released under the MIT license
 * Copyright (c) 2014 Marcin Łabanowski <marcin@6irc.net>
 *
 * Usage:
 *   $config['api']['enabled'] = true;
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/mobile-style.js';
 */
$(document).ready(function() {
	if(navigator.userAgent.match(/iPhone|iPod|iPad|Android|Opera Mini|Blackberry|PlayBook|Windows Phone|Tablet PC|Windows CE|IEMobile/i)) {
		$('html').addClass("mobile-style");
		device_type = "mobile";

		//Mover el selector de board
		$(".bar.top .boardlist").remove();
		$(".bar.bottom select").appendTo(".bar.top");
		if (active_page == 'index') $(".bar.top select").css("float","left");
		else $(".bar.top select").css("float","");
		
		
		//Comprobar styleSheet
		if (selectedstyle == "Lainchanjp"){
			changeStyle("Dark");
			alert("El estilo por defecto 'Lainchanjp' no esta preparado aun para smartphones, mientras tanto, el estilo ha sido cambiado a 'Dark'.  Puedes encontrar todos los estilos en el inferior de la pagina");
		}

		
	}
	else {
		$('html').addClass("desktop-style");
		device_type = "desktop";
	}
});
