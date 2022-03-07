var texts = [];
var notion = true; // Voor SLO project.
if(notion)
{
	texts["tekstor.htm"]="<h1>logische schakeling: of-poort</h1>";
	texts["tekstand.htm"]="<h1>logische schakeling: en-poort</h1>";
	texts["tekstxor.htm"]="<h1>logische schakeling: xor</h1>";
	texts["tekstlijn.htm"]="<h1>lijn y=2x-1 ofwel x - &half;y=&half; </h1><h2> (druk weer op de knop voor een nieuwe verzameling punten weer op de knop voor nieuwe data)</h2>";
	texts["tekstlijnfouten.htm"]="<h1>lijn schatting met invoer die fouten bevat</h1>";
}
texts["tekst2linesXor.htm"]="<h1>Tussen de lijnen y=2x-1 en y=-2x-1</h1><h2> (druk weer op de knop voor een nieuwe verzameling punten)</h2></h1>";
texts["tekst2linesAnd.htm"]="<h1>Boven de lijnen y=2x-1 en y=-2x-1</h1><h2> (druk weer op de knop voor een nieuwe verzameling punten)</h2>";

var examples =
{ "or":
	{
		data: "["
			  +"\n\t{ input: [0, 0], output: [0] },"
			  +"\n\t{ input: [0, 1], output: [1] },"
			  +"\n\t{ input: [1, 0], output: [1] },"
			  +"\n\t{ input: [1, 1], output: [1] }"
			+"\n]",
		boundingbox: [-1,2,2,-1],
		voorspel: [{ input: [0, 0] }],
		lagen: [],
		leersnelheid: 0.3,
		errorTresh: 0.01,
		maxIter: 10000,
		activation: "sigmoid",
		discription: "loadText('tekstor.htm')"
	},
	"xor":
	{
		data: "["
			  +"\n\t{ input: [0, 0], output: [0] },"
			  +"\n\t{ input: [0, 1], output: [1] },"
			  +"\n\t{ input: [1, 0], output: [1] },"
			  +"\n\t{ input: [1, 1], output: [0] }"
			  +"\n]",
		boundingbox: [-1,2,2,-1],
		voorspel: [{ input: [0, 0] }],
		lagen: [2],
		leersnelheid: 0.7,
		errorTresh: 0.01,
		maxIter: 100000,
		activation: "sigmoid",
		discription: "loadText('tekstxor.htm')"
	},
	"and":
	{
		data: "["
			  +"\n\t{ input: [0, 0], output: [0] },"
			  +"\n\t{ input: [0, 1], output: [0] },"
			  +"\n\t{ input: [1, 0], output: [0] },"
			  +"\n\t{ input: [1, 1], output: [1] }"
			+"\n]",
		boundingbox: [-1,2,2,-1],
		voorspel: [{ input: [0, 0] }],
		lagen: [],
		leersnelheid: 0.3,
		errorTresh: 0.01,
		maxIter: 10000,
		activation: "sigmoid",
		discription: "loadText('tekstand.htm')"
	},
	"line":
	{
		data: "genereerPuntenLijn(-2,1)",
		boundingbox: [-4,4,4,-4],
		voorspel: [{ input: [0, 0] }],
		lagen: [],
		leersnelheid: 0.9,
		errorTresh: 0.1,
		maxIter: 10000,
		activation: "tanh",
		discription: "loadText('tekstlijn.htm')",
		extraGraph: "tekenLijn(-2,1)"
	},
	"2linesXor":
	{
		data: "genereerPuntenLijnenXor(-2,1)",
		boundingbox: [-4,4,4,-4],
		voorspel: [{ input: [0, 0] }],
		lagen: [2,2],
		leersnelheid: 0.1,
		errorTresh: 0.01,
		maxIter: 10000,
		activation: "tanh",
		discription: "loadText('tekst2linesXor.htm')",
		extraGraph: "tekenLijn(-2,1);tekenLijn(2,1);"
	},
	"2linesAnd":
	{
		data: "genereerPuntenLijnenAnd(-2,1)",
		boundingbox: [-4,4,4,-4],
		voorspel: [{ input: [0, 0] }],
		lagen: [2],
		leersnelheid: 0.3,
		errorTresh: 0.01,
		maxIter: 10000,
		activation: "tanh",
		discription: "loadText('tekst2linesAnd.htm')",
		extraGraph: "tekenLijn(-2,1);tekenLijn(2,1);"
	}
	,
	"lineErrors":
	{
		data: "genereerPuntenLijn(-2,1,true,2)",
		boundingbox: [-4,4,4,-4],
		voorspel: [{ input: [0, 0] }],
		lagen: [],
		leersnelheid: 0.3,
		errorTresh: 0.1,
		maxIter: 10000,
		activation: "tanh",
		discription: "loadText('tekstlijnfouten.htm')",
		extraGraph: "tekenLijn(-2,1);"
	}
}


function setExample( id )
{
	clearBrain();
	obj= examples[id];
	config.tekening=obj.boundingbox;
	document.getElementById("boundingbox").value=JSON.stringify(obj.boundingbox);
	config.boundingbox=obj.boundingbox;
// brains
	config.net= null;
	document.getElementById("leersnelheid").value= obj.leersnelheid;
	config.learningRate= obj.leersnelheid;
	document.getElementById("errorThresh").value=obj.errorTresh;
	config.errorThresh=obj.errorTresh
	document.getElementById("layers").value = JSON.stringify(obj.lagen);
	config.hiddenLayers=obj.lagen;// array of ints for the sizes of the hidden layers in 	the network
	document.getElementById("Iterations").value=obj.maxIter;
	config.iterations=obj.maxIter;
	
	if(obj.discription.startsWith("loadText")) discription = eval(obj.discription);
	else document.getElementById("discription").innerHTML = obj.discription;
	var data = obj.data;
	if(obj.data.startsWith("genereer")) data = eval(data);
	config.data= eval(data);
	document.getElementById("trainingsdata").value=data;
	document.getElementById("voorspel").value=JSON.stringify(obj.voorspel);
	config.testdata=obj.voorspel;
	// supported activation types: ['sigmoid', 'relu', 	'leaky-relu', 'tanh'],
	document.getElementById(obj.activation).checked = true;
	config.activation = obj.activation
	config.extraGraph = obj.extraGraph;
	startBrain();
}

/**
	Genereer punten rond de lijn b + ax + y = 0,
	als error = true dan wordt er een random getal 
	getrokken op basis van de afstand tot de lijn met behulp van een
	exponentiële verdeling.
	Op basis van dit getal wordt de output met -1 vermenigvuldigd
	waardoor het als het ware een foute meting wordt.
 */

function genereerPuntenLijn(a,b,error=false,lambda=10)
{
	var trainingData="[";
	var first=true;
	var errors=0;
	var errorOut="";
	for(i=0;i<50;i++)
	{
		x = 8*Math.random()-4;
		y = 8*Math.random()-4;
		som = b + a*x + y;
		outputNN= Math.sign(som);
		errorOut="";
		if(error)
		{
			if(Math.abs(som)< -Math.log(1-Math.random())/lambda )
			{
				outputNN*=-1;
				errors++;
				errorOut=",fout:true";
			}
		}
		if( first ) first=false;
		else trainingData+= ",";
		trainingData+="\n\t{ input: ["+x.toFixed(3)+"," + y.toFixed(3) +"], output: ["+outputNN+ "] "+errorOut+"}";
	}
	trainingData+="]";
	console.log("aantal fouten "+errors);
	return trainingData;
}

function genereerPuntenLijnenXor(a,b)
{
	var trainingData="[";
	var first=true;
	for(i=0;i<50;i++)
	{
		x = 8*Math.random()-4;
		y = 8*Math.random()-4;
		som1 = b + a*x + y;
		som2 = b - a*x + y;
		outputNN= Math.sign(som1)*Math.sign(som2);
		if( first ) first=false;
		else trainingData+= ",";
		trainingData+="\n\t{ input: ["+x.toFixed(3)+"," + y.toFixed(3) +"], output: ["+outputNN+ "] }";
	}
	trainingData+="]";
	return trainingData;
}

function genereerPuntenLijnenAnd(a,b)
{
	var trainingData="[";
	var first=true;
	for(i=0;i<50;i++)
	{
		x = 8*Math.random()-4;
		y = 8*Math.random()-4;
		som1 = b + a*x + y;
		som2 = b - a*x + y;
		outputNN= (Math.sign(som1)==1 && Math.sign(som2)==1)?1:-1;
		if( first ) first=false;
		else trainingData+= ",";
		trainingData+="\n\t{ input: ["+x.toFixed(3)+"," + y.toFixed(3) +"], output: ["+outputNN+ "] }";
	}
	trainingData+="]";
	return trainingData;
}

function tekenLijn(a,b) // vgl b+ax+y=0
{
	var line = config.tekening[0].create(
				'line',
				[b,a,1],
				{strokeColor:'#00AA00',strokeWidth:2}
			   );
}

/*
	Zo nodig wordt uit een url tekst voor de beschrijving via
	een ajax request geladen.
 */
function loadText( url )
{
	if(texts[url])
	{
		document.getElementById("discription").innerHTML=texts[url];
	}
	else
	{
		// from ajax.js
		Ajax.loadSrcInto(url,"discription",storeText);
	}
}
/*
	Na ajax request, wordt de tekst opgeslagen  in de texts lijst
	onder de filenaam
 */
function storeText(naam,content)
{
	texts[naam]=content;
}


