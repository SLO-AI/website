   var lineObjOffsetTop = 2;
	 var MAXLINES=250;
   
	 /**
	  createTextAreaWithLines is a function which transform the content 
		of an html element in line numbered content.
		id: the id of the object tob transformed
	  */
   function createTextAreaWithLines(id,maxlines)
   {
		var el = document.createElement('div'); // create div holding ta and linenumber table
		var ta = document.getElementById(id);
		ta.parentNode.insertBefore(el,ta);	  // insert el before the ta
		el.appendChild(ta); 							 		// add ta to the div
		el.className='textAreaWithLines';			// set the style
		ta.style.position = 'absolute';       // give ta an absolute position in el
		ta.style.left = '32px';								// 30 px to the right
		ta.style.left = '32px';								// 30 px to the right
		ta.style.margin = '0px';
		el.style.left = '0px';								
		el.style.height = (ta.offsetHeight + 0) + 'px';
		el.style.overflow='hidden';
		el.style.position = 'relative';
		if(el.parentNode.offsetWidth < ta.offsetWidth + 32)
		{
			el.parentNode.style.width= (ta.offsetWidth + 32) + 'px';
		}
		else
		{
			el.style.width =  (ta.offsetWidth + 32)  + 'px';
		}
		var lineObj = document.createElement('div');
		lineObj.className='lineObj';
		lineObj.style.position = 'absolute';
		lineObj.style.top = lineObjOffsetTop + 'px';
		lineObj.style.left = '0px';
		lineObj.style.width = '29px';
		lineObj.style.padding = '0px';
		el.insertBefore(lineObj,ta);
		lineObj.style.textAlign = 'right';
		var string = '';
		for(var no=1;no<MAXLINES;no++){
			if(string.length>0)string = string + '<br>';
			string = string + no;
		}
      
		ta.onkeydown = function() { positionLineObj(lineObj,ta); };
		ta.onmousedown = function() { positionLineObj(lineObj,ta); };
		ta.onscroll = function() { positionLineObj(lineObj,ta); };
		ta.onblur = function() { positionLineObj(lineObj,ta); };
		ta.onfocus = function() { positionLineObj(lineObj,ta); };
		ta.onmouseover = function() { positionLineObj(lineObj,ta); };
		lineObj.innerHTML = string;
		// limit number of lines in el to maxlines
		if( maxlines && !isNaN(maxlines))
		{
		  var lineHeight = calculateLineHeight(ta);
		  el.style.height=(lineHeight*maxlines)+"px"
		  ta.style.height=(lineHeight*maxlines)+"px"
		}
   }

	 /**
	  createTextAreaWithLines is a function which transform the content 
		of an html element in line numbered content.
		id: the id of the object tob transformed
	  */
   function createPreWithLines(id,maxlines)
   {
	var el = document.createElement('div'); // create div holding ta and linenumber table
	var ta = document.getElementById(id);
	ta.parentNode.insertBefore(el,ta);	  // insert el before the ta
	el.appendChild(ta); 							 		// add ta to the div
	el.className='preWithLines';			// set the style
	ta.style.position = 'absolute';       // give ta an absolute position in el
	ta.style.left = '32px';								// 30 px to the right
	ta.style.left = '32px';								// 30 px to the right
	ta.style.margin = '0px';
	el.style.left = '0px';								
	el.style.overflow='hidden';
	el.style.position = 'relative';
	el.style.display= 'block';
	el.style.width= '100%';
	el.style.overflow= 'hidden';
	el.style.height = (ta.offsetHeight + 0) + 'px';
	/*
	if(el.parentNode.offsetWidth < ta.offsetWidth + 32)
	{
		el.parentNode.style.width= (ta.offsetWidth + 32) + 'px';
	}
	else
	{
		el.style.width =  (ta.offsetWidth + 32)  + 'px';
	}
	*/
	var lineObj = document.createElement('div');
	lineObj.className='lineObj';
	lineObj.style.position = 'absolute';
	lineObj.style.top = lineObjOffsetTop + 'px';
	lineObj.style.left = '0px';
	lineObj.style.width = '29px';
	lineObj.style.padding = '0px';
	el.insertBefore(lineObj,ta);
	lineObj.style.textAlign = 'right';
	var string = '';
	for(var no=1;no<MAXLINES;no++){
	 if(string.length>0)string = string + '<br>';
	 string = string + no;
	}
	
	
	ta.onkeydown = function() { positionLineObj(lineObj,ta); };
	ta.onmousedown = function() { positionLineObj(lineObj,ta); };
	ta.onscroll = function() { positionLineObj(lineObj,ta); };
	ta.onblur = function() { positionLineObj(lineObj,ta); };
	ta.onfocus = function() { positionLineObj(lineObj,ta); };
	ta.onmouseover = function() { positionLineObj(lineObj,ta); };
	lineObj.innerHTML = string;
	// limit number of lines in el to maxlines
	if( maxlines && !isNaN(maxlines))
	{
		var lineHeight = calculateLineHeight(ta);
		el.style.height=(lineHeight*maxlines)+"px"
		ta.style.height=(lineHeight*maxlines)+"px"
	}
	//console.log(el.innerHTML)
	return el;
   }
      
	 /**
	  positionLineObj is a fuction which defines the top of an object
		above  object ta adding the line distance
		obj: the object to place
		ta: the line below
		
	  */
   function positionLineObj(obj,ta)
   {
      obj.style.top = (ta.scrollTop * -1 + lineObjOffsetTop) + 'px';      
   }
   
   /**
	 		getStyle obtain style property from a dom element
	  */
   function getStyle(el,styleProp)
   {
      var x = el;
      if (x.currentStyle)
          var y = x.currentStyle[styleProp];
      else if (window.getComputedStyle)
          var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
      return y;
   }
	
	 // work arround to comute the line height in an dom element
	 function calculateLineHeight (element) {

     var lineHeight = parseInt(getStyle(element, 'line-height'), 10);
     var clone;
     var singleLineHeight;
     var doubleLineHeight;

     if (isNaN(lineHeight)) {
      clone = element.cloneNode();
      clone.innerHTML = '<br>';
      element.appendChild(clone);
      singleLineHeight = clone.offsetHeight;
      clone.innerHTML = '<br><br>';
      doubleLineHeight = clone.offsetHeight;
      element.removeChild(clone);
      lineHeight = doubleLineHeight - singleLineHeight;
  	}

    return lineHeight;
	}
	
  function init()
  {
   var i=1;
   while( document.getElementById('codePre'+i) )
   {
   	createPreWithLines('codePre' + i);
  	i++;
   }
   i=1;
	 while( document.getElementById('codeTextarea'+i) )
   {
   	createTextAreaWithLines('codePre' + i);
  	i++;
   }
  }   
