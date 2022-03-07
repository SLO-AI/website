class Ajax
{
	/*
	 de functie loadSrcInto laad de info in de gegeven url in een html element met 
	 id gelijk aan target. 
	 Met de options variabele (key value paar) kun je parameters met het request meezenden.
	 methode "get" of "post"
	 myprocess extra function to adress in callback
	 
	 Dit werkt niet als website op filesysteem wordt aangeboden. Alleen via een webserver.
	 Veiligheidsissue.
	 */
	static loadSrcInto(url,target,myprocess=null,options=null,methode="get")
	{
	 var xmlhttp;
	 // Het belangrijkste: maak een zogenaamd XMLHttp object aan
	 if (window.XMLHttpRequest)
	 {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	 }
	 else
	 {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	 }
	 console.log(window.location.pathname);
	 xmlhttp.myprocess=myprocess;
	 xmlhttp.mylocation=url;

	 // definieer een functie die het antwoord van de server gaat afhandelen
	 xmlhttp.onreadystatechange=function()
	 {
		if (this.readyState==4 && this.status==200)
		{
		  // plaats de response van de server in het element met is targetid
		  document.getElementById(target).style.textDecoration='none';
		  var content=xmlhttp.responseText;
		  document.getElementById(target).innerHTML=content;
		  if(this.myprocess) this.myprocess(url,content);
		}
	 }
	 methode = methode.toUpperCase();
	 var requestData="";
	 var first = true;
	 for (var tag in options) {
		if(first) first=false;
		else requestData += "?";
		requestData += x +"="+urlEncode(options[x]);
	 }
	 if("GET"==methode) url+=requestData;
	 
	 // open de verbinding
	 xmlhttp.open(methode,url,true);
		// zeg tegen de server dat we een formulier sturen
	 xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		// send de formulier gegevens actie en naam
	 xmlhttp.send(requestData);

	}
}
