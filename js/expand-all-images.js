/*
 * expand-all-images.js
 * https://github.com/savetheinternet/Tinyboard/blob/master/js/expand-all-images.js
 *
 * Adds an "Expand all images" button to the top of the page.
 *
 * Released under the MIT license
 * Copyright (c) 2012-2013 Michael Save <savetheinternet@tinyboard.org>
 * Copyright (c) 2013-2014 Marcin Łabanowski <marcin@6irc.net>
 * Copyright (c) 2014 sinuca <#55ch@rizon.net>
 *
 * Usage:
 *   $config['additional_javascript'][] = 'js/jquery.min.js';
 *   $config['additional_javascript'][] = 'js/inline-expanding.js';
 *   $config['additional_javascript'][] = 'js/expand-all-images.js';
 *
 */

if (active_page == 'ukko' || active_page == 'thread' || active_page == 'index')
onready(function(){
	$('.bar.top').append('<span id="expand-all-images" style="margin-right: 10px;float: right;"><a class="fa fa-expand" title="Expandir todas las imágenes" href="javascript:void(0)"></a></span>');
	$('span#expand-all-images a')
		.click(function() {
			if ($('span#expand-all-images a').attr('class') == 'fa fa-expand'){
				$('a img.post-image').each(function() {
					// Don't expand YouTube embeds
					if ($(this).parent().parent().hasClass('video-container'))
						return;

					// or WEBM
					if (/^\/player\.php\?/.test($(this).parent().attr('href')))
						return;

					if (!$(this).parent().data('expanded'))
						$(this).parent().click();
					
					$('span#expand-all-images a').attr('class','fa fa-compress');
					$('span#expand-all-images a').attr('title','Encoger las imágenes');
				});
			}else{
				$('a img.full-image').each(function() {
					if ($(this).parent().data('expanded'))
						$(this).parent().click();
				});
				$('span#expand-all-images a').attr('class','fa fa-expand');
				$('span#expand-all-images a').attr('title','Expandir todas las imágenes');
			}
		});
});
