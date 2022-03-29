/*
 * initTreeview adds an eventlistner to elements of class
 * caret. The evenlistner toggles the visibility of 
 * an element in the parent of class nested
 */
function initTreeview()
{
	var toggler = document.getElementsByClassName("caret");
	var i;

	for (i = 0; i < toggler.length; i++) {
	  toggler[i].addEventListener("click", function() {
		this.parentElement.querySelector(".nested").classList.toggle("active");
		this.classList.toggle("caret-down");
	  });
	}
}