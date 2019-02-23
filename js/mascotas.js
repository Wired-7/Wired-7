/*
 * mascotas.js
 * https://github.com/Wired-7/Wired-7/blob/master/js/mascotas.js
 *
 * Released under https://github.com/Wired-7/Wired-7/blob/master/LICENSE.Wired-7.md license
 * Copyright (c) 2019 Wired-7 <admin@wired-7.org>
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/options.js';
 *
 * Note: http and https don't have same localStorage so users have different mascots on http and https
 */

	//Estilo
	$('<style type="text/css" id="mascotas-css">\
			.seleccionadorMascota {\
				width:130px;\
				height:auto;\
				max-height: 240px;\
				margin:10px;\
				text-align: center;\
				float:left;\
				border: solid 1px;\
			}\
			.seleccionadorMascota img{\
				max-width:100%;\
				height: 200px;\
			}\
			#mascot{\
				position: fixed;\
				right: 10px;\
				bottom: 0;\
				margin-bottom: 20px;\
				margin-right: 0px;\
				width: auto;\
				opacity: .5;\
				transition: opacity .3s ease-out 0s;\
				pointer-events: auto !important;\
				z-index: -1;\
			}\
			</style>').appendTo($('head'));
	
	//Constructor de waifus OwO
	function claseMascota(nombre, src) {
		this.nombre = nombre;
		this.src = src;
	}
	var arrayMascotas = [
		new claseMascota("Akaza Akari", "https://i.imgur.com/efamPLp.png"),
		new claseMascota("Akemi Homura","https://i.imgur.com/8v6aSbV.png"),
		new claseMascota("Ali Baba","https://i.imgur.com/FWC00jB.png"),
		new claseMascota("Asuka Shikinami Langley","https://i.imgur.com/AD18Ld2.png"),
		new claseMascota("Cirno","https://i.imgur.com/u65u8oN.png"),
		new claseMascota("Gasai Yuno","https://i.imgur.com/BurJnOd.png"),
		new claseMascota("Hatsune Miku","https://i.imgur.com/HsqOvDJ.png"),
		new claseMascota("Hitagi Senjougahara","https://i.imgur.com/ttQDirH.png"),
		new claseMascota("Iwakura Lain","https://i.imgur.com/4FsUkrN.png"),
		new claseMascota("Kagami Taiga","https://i.imgur.com/AMmCyhq.png"),
		new claseMascota("Kaname Madoka","https://i.imgur.com/TVlagl3.png"),
		new claseMascota("Kirisame Marisa","https://i.imgur.com/MCvbGgt.png"),
		new claseMascota("Kisaragi Chihaya","https://i.imgur.com/4Hdd0R8.png"),
		new claseMascota("Mashiro Shiina","https://i.imgur.com/BxJylsO.png"),
		new claseMascota("Mayoi Hachikuji","https://i.imgur.com/Xgzke7s.png"),
		new claseMascota("Mokou no Fujiwara","https://i.imgur.com/NqDwk7d.png"),
		new claseMascota("Nakano Azusa","https://i.imgur.com/pfqZLHo.png"),
		new claseMascota("L","https://i.imgur.com/2KxoPza.png"),
		new claseMascota("Light Yagami","https://i.imgur.com/IRTSxRj.png"),
		new claseMascota("Patchouli Knowledge","https://i.imgur.com/7zJ6F35.png"),
		new claseMascota("Remilia Scarlet","https://i.imgur.com/3YSqyiI.png"),
		new claseMascota("Rei Ayanami","https://i.imgur.com/sFh3eE0.png"),
		new claseMascota("Ruri Gokou","https://i.imgur.com/UtjqvU6.png"),
		new claseMascota("Saber","https://i.imgur.com/H7GtZ9j.png"),
		new claseMascota("Sakamoto-san","https://i.imgur.com/KeJysAb.png"),
		new claseMascota("Touwa Erio","https://i.imgur.com/AFINQjc.png"),
		new claseMascota("Yoko Littner","https://i.imgur.com/bEPA1rz.png")
	];

	var mascotasPrint = "";
	for (var i = 0,l = arrayMascotas.length; i < l; i++){
		mascotasPrint += '<div class="seleccionadorMascota"><img src="' + arrayMascotas[i].src +'" onclick="addmascot(this)"><br><p>'+ arrayMascotas[i].nombre +'</p></div>';
	}
	
	//Comprobaciones de datos
	window.onload = function(){
		var URLMascota = localStorage.getItem('URLMascota'); // or localStorage.value

		var alturaMascota = localStorage.getItem('alturaMascota');
		if(alturaMascota == null)
			alturaMascota = 40;
		document.getElementById("inputalturaMascota").value = alturaMascota;
		
		//Si la mascota existe, la iniciamos
		if(URLMascota != null && URLMascota != "") initmascot(URLMascota,alturaMascota);
		// Iniciar el menu
		$('.fa.fa-paw').parent().on('click',initmenu(URLMascota,alturaMascota));
	}

	// Create settings menu
	var settingsMenu = document.createElement("div");
	var prefix = "", suffix = "";
	if (window.Options) {
	  var tab = Options.add_tab("mascotas", "paw", _("Mascotas"));
	  $(settingsMenu).appendTo(tab.content);
	}
	
	
	
	settingsMenu.innerHTML = prefix
		+ '<div id="divMascotas"><br><br>'
		+ '<div style="white-space: nowrap;float: left;margin-top: 15px;"><label>'+_('Mascota personalizada: URL a la imagen -> ')+'<input type="text" name="mascotaURL" id="mascotaURL"></label><br>'
		+ '<input type="button" value="¡Añadir!" onclick="addmascot(undefined)">'
		+ '<input type="button" value="Eliminar" onclick="delmascot()"><br><br>'
		+ '<label>'+_('Cambia el tamaño de la mascota (1 - 100) -> ')+'<input type="text" name="inputalturaMascota" id="inputalturaMascota"></label><br>'
		+ '<input type="button" value="¡Cambiar tamaño!" value="40" onclick="cambiaraltura()"><br><br>'
		+ ''+_('Versión Beta (Si encuentras algun bug nos harías un favor reportandolo en <a href="https://wired-7.org/meta/index">/meta/</a> o github)<br>')
		+ ''+_('Mascotas de <a href="https://wired-7.org/">Wired-7</a>')+'</div>' //Copyright
		+ suffix;
	
	//Core
	function initmascot(srcmascota,alturaMascota){
		$('body').append('<img id="mascot" src="'+ srcmascota +'"style="height: ' + alturaMascota + 'vh;">');
	}

	function initmenu(srcmascota,alturaMascota){
		if ($("#divMascotas .seleccionadorMascota").length == 0) $('#divMascotas').prepend(mascotasPrint);
		if ($("img[src$='"+ srcmascota + "']").length > 0) $(".seleccionadorMascota img[src$='"+ srcmascota + "']").css("background-image", "radial-gradient(ellipse 50% 50%,#990044, rgb(0,0,0,0))");
		if (srcmascota != null && srcmascota != "") document.getElementById("mascotaURL").value = srcmascota;
		document.getElementById("inputalturaMascota").value = alturaMascota;
	}
	
	function addmascot(imagen) {
			var alturaMascota = localStorage.getItem('alturaMascota');
			var valmascotaURL = $('#mascotaURL').val();
			if (imagen==undefined){ 
				//Si metes URC custom y existe mascota por defecto, borramos el fondo de seleccion
				if ($('#mascot').attr('src') != undefined) $(".seleccionadorMascota img[src$='"+ $('#mascot').attr('src') + "']").css("background","initial");
				var srcmascota = valmascotaURL;
			}else{
				//Si ha sido seleccionada de las default, eliminamos el background a la anterior imagen (si existe)
				if ($("img[src$='"+ valmascotaURL + "']").length > 0) $(".seleccionadorMascota img[src$='"+ valmascotaURL + "']").css("background","initial");
				var srcmascota = imagen.src;
				document.getElementById("mascotaURL").value = imagen.src;
				$(imagen).css("background-image", "radial-gradient(ellipse 50% 50%,#990044, rgb(0,0,0,0))");
			}
			$('#mascot').remove();
			$('body').append('<img id="mascot" src="'+ srcmascota +'"style="height: ' + alturaMascota + 'vh;">');
			localStorage.setItem('URLMascota', srcmascota);
	}
	
	function delmascot(){
		if ($('#mascot').attr('src') != undefined) $(".seleccionadorMascota img[src$='"+ $('#mascot').attr('src') + "']").css("background","initial");
		$('#mascot').remove();
		document.getElementById("mascotaURL").value = null;
		localStorage.setItem('URLMascota', null);
	}
	
	function cambiaraltura(){
		alturaMascota = document.getElementById("inputalturaMascota").value;
		$('#mascot').css("height",alturaMascota + "vh");
		localStorage.setItem('alturaMascota', alturaMascota);
	}
