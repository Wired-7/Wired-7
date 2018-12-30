/*Counts number of characters in a field with id=messagebody*/
document.addEventListener("DOMContentLoaded", function(event) {
	var supportOnInput = 'oninput' in document.createElement('input');
	var CSScolor =  getComputedStyle(document.body).getPropertyValue('color').toString();

	$("#body[maxlength]").each(function() {
		var $this = $(this);
		var maxLength = parseInt($this.attr('maxlength'));
		$this.attr('maxlength', null);
		
		var el = $("<span class=\"character-count\">" + maxLength + "</span>");
		el.insertAfter($this);
		
		$this.bind(supportOnInput ? 'input' : 'keyup', function() {
			var cc = $this.val().length;
			
			el.text(maxLength - cc);
			
			if(maxLength < cc) {
				el.css('color', 'red');
			} else {
				el.css('color', CSScolor);
			}
		});
	});
});