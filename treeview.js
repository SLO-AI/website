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
/*
 * addPathLead adds a path in leading to this website to the path to a page
 * present in this website.
 */
function addPathLead(elemid="path_lead")
{
	// change the path_lead variable to your needs
	// const path_lead='<a href="https://www.johnval.nl"  target="_parent">John Val</a>/<a href="../../informatica/index.htm" target="_parent">Informatica</a>/';
	// let obj = document.getElementById(elemid);
	// if(obj)	obj.innerHTML = path_lead+obj.innerHTML;
	
}
