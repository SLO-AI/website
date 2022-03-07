function verberg(obj)
{
	obj.style.display="none";
}

function toon(id_object)
{
	toonElement(document.getElementById(id_object));
	/*
	var stobj=document.getElementById(id_object).style;
	if(stobj.display=="block")
	{
		stobj.display="none";
	}
	else
	{
		stobj.display="block";
	}
	*/
}

function toonElement(element)
{
	var stobj=element.style;
	if(stobj.display=="block")
	{
		stobj.display="none";
	}
	else
	{
		stobj.display="block";
	}
}

function toonInline(ev,id_object, toon )
{
	var stobj=document.getElementById(id_object).style;
	if(toon)
	{
		stobj.display="inline";
	}
	else
	{
		stobj.display="none";
	}
}

function toonElementInline(id_object, toon)
{
	var stobj=element.style;
	if(toon)
	{
		stobj.display="inline";
	}
	else
	{
		stobj.display="none";
	}
}
/*
	setWidthElement: either sets the width of object a to b or
	sets the width of b equal to the parent width minus the width of a floating opject
	in case the floating object is next to object a.
	if c is a possible other element to determine whether the floating object is next to a
*/
function setWidthElement(a,b,c=null)
{
	if( typeof b == "number")
	{
		a.style.maxWidth = b +"px";
	}
	else
	{
		var at=a.offsetTop;
		if(c) at= c.offsetTop;
		var bb=b.offsetTop+b.offsetHeight;
		var cstyle=window.getComputedStyle(b,null);
		if(at<bb)
		{
			var sb=window.getComputedStyle(b, null);
			var sa=window.getComputedStyle(a, null);
			var wijdte = cstyle.getPropertyValue("width");
			wijdte = Number(wijdte.substring(0,wijdte.length-2));
			a.style.width = 
				(a.parentElement.offsetWidth-b.offsetWidth-20)+"px";
		}
	}
}

/*
	in a tabbed environment switch between tabs and highlight current tab
*/
function toonElementTab(buttonobj,color="gold")
{
	const element = document.querySelector('.'+buttonobj.className)
	const bgColor = getComputedStyle(element).backgroundColor;
	var tabbuttongroupobj=buttonobj.parentElement;
	var tabsobj=tabbuttongroupobj.parentElement;
	var tabmaingroupobj=tabsobj.childNodes[3];
	var bnodes = tabsobj.childNodes[1].childNodes;
	var mnodes = tabsobj.childNodes[3].childNodes;
	for(i=0;i<bnodes.length;i++)
	{
		if(bnodes[i]==buttonobj)
		{
			buttonobj.style.backgroundColor=color;
			mnodes[i].style.display="block";
		}
		else
		{
			if(bnodes[i].innerHTML)
			{
				bnodes[i].style.backgroundColor=bgColor;
				mnodes[i].style.display="none";
			}
		}
	}
}