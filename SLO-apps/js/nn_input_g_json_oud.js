function clearBrain()
{
	config.tekening=null;
	config.net=null;
	for(i=0;i<3;i++)
	{
		document.getElementById("box"+i).innerHTML="";
		document.getElementById("box"+i).style.display="none";
	}
	var outputobj=document.getElementById("output").innerHTML="";
	var svgobj=document.getElementById("svgoutput").innerHTML="";
	var statusobj=document.getElementById("status").innerHTML="";
	var voorspellingobj=document.getElementById("voorspelling").innerHTML="";
	var lijnenobj=document.getElementById("lijnen").innerHTML="";	
}

function startBrain()
{
	clearBrain();
	try{
		config.boundingbox = eval(document.getElementById("boundingbox").value);
	}
	catch(err)
	{
		alert("definitie boundingbox fout: verwacht [xmin,ymax,xmax,ymin]");
	}
	config.hiddenLayers=eval(document.getElementById("layers").value);
	config.learningRate = Number(document.getElementById("leersnelheid").value);
	config.iterations =  Number(document.getElementById("Iterations").value);
	config.errorThresh = Number(document.getElementById("errorThresh").value);
	try{
		config.data = eval(document.getElementById("trainingsdata").value);
	}
	catch(err)
	{
		alert("trainingsdata bevat een fout");
	}
	init();
	config.activation = document.getElementById("sigmoid").checked?
									document.getElementById("sigmoid").value:
									"tanh";
	if(config.extraGraph) eval(config.extraGraph);
	use_brain(config);
}

// standard configuration
const config = {
// Graphics
	tekening: null,
	linePerceptron: null,
	objects: [],
	colors: ["blue","green","red","black"],
	boundingbox: [-4, 4, 4, -4],
// brains
	net: null,
	binaryThresh: 0.5,
	activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 	'leaky-relu', 'tanh'],
	learningRate: 0.3,
	errorThresh: 0.005,
	hiddenLayers: [], // array of ints for the sizes of the hidden layers in 	the network
	leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
	iterations: 30000,
	logPeriod: 250,
	data: null,
	testdata: null
}

function init(obj=null)
{
	
	if(config.tekening==null)
	{
		config.tekening = [];
		console.log("knopen "+config.hiddenLayers)
		for( i=0 ; i<= (config.hiddenLayers?config.hiddenLayers.length:0);i++)
		{
		 console.log("input "+(config.data[0].input))
		 if((i==0 && config.data[0].input.length==2) || config.hiddenLayers[i-1]==2 )
		 {
			 // console.log(config.hiddenLayers.length);
			 config.tekening[i]=JXG.JSXGraph.initBoard('box'+i, 
				{boundingbox: config.boundingbox, axis: true});
			 document.getElementById('box'+i).style.display="block";
		 }
		}
	}
}

// 2 inputs 1 hidden layer with 2 nodes and one output
function use_brain( config )
{
	var outputobj=document.getElementById("output");
	var svgobj=document.getElementById("svgoutput");
	var statusobj=document.getElementById("status");
	var voorspellingobj=document.getElementById("voorspelling");
	var lijnenobj=document.getElementById("lijnen");
	var som1, som2;
	// voeg punten toe aan graphics
	var trainingData = config.data;
	if(trainingData!=null && trainingData[0].input.length==2)
	{
		
		for(var i=0;i<trainingData.length;i++)
		{
			
			voegToeTrainingsPunt(
				config.tekening[0], 
				trainingData[i].input,
					trainingData[i].fout?
					"rgb(0,255,0)":
					(
						trainingData[i].output[0]>0.5?"rgb(0,0,255)":"rgb(255,0,0)"
					)
				);
		}
	}

	// maak brain neuraal netwerk object
	var net = config.net = new brain.NeuralNetwork(config);
	logger("<h2>Iteraties</h2>",outputobj);

	// train het netwerk
	var trained = net.train(trainingData, 
		{
			log: (error) => logger(JSON.stringify(error)+"<br/>",outputobj),
			iterations: config.iterations,
			logPeriod: config.logPeriod
		}
	);
	var goed=true;
	if(eval(trained.error) > eval(config.errorThresh)) goed=false;
	// haal de netwerkstatus op na het trainen.
	var jsonobj = net.toJSON();
	logger("JSON<pre> "+JSON.stringify(jsonobj, null, 2)+"</pre>",statusobj);
	logger(toonVoorspellingen(config),voorspellingobj);

	// toon de status van de gewichten als lineaire vergelijking
	logger("De training stopte na  "+ trained.iterations+" iteraties met fout "+ trained.error,lijnenobj)
	logger("<h2"+(goed?">":" style='background-color: red; color: yellow'> Niet gelukt: ")+"Voorspelde vergelijkingen</h2>",lijnenobj);
	for(var j=1; j<jsonobj.layers.length; j++)
	{	
		var txt ="<p style='color: "+config.colors[j-1]+";'>";
		// 
		//if(!jsonobj.outputLookup)
		{
			var len=Object.keys(jsonobj.layers[j]).length;
			for(var i=0; i<len; i++)
			{
				txt +="<br/>"+showNode(
					config.tekening[j-1],
					jsonobj.layers[j][i],
					config.colors[j-1],
					"layer "+j+" node "+(i+1),
					2);
			}
		}
		logger(txt+"</p>",lijnenobj);
		
	}
	// toon de grafische weergaven van het netwerk in svg
	logger("<h2>Netwerk</h2>",svgobj);
	logger(brain.utilities.toSVG(net),svgobj);
	logger("<h2>Status netwerk</h2>",statusobj);
	
}

function toonVergelijkingNode(jsx,node,color,naam,dash_s=1)
{
    var line = jsx.create(
				'line',
				[node.bias,node.weights[0],node.weights[1]],
				{
						strokeColor:color,
						strokeWidth:2,
						dash:dash_s,
						name:naam,
						label:{position: 'lft', offset:[10, 10]}
				}
				);
}

function voegToeTrainingsPunt(jsx,point,color)
{
	var obj= jsx.create('point',
		point,
		{color: color});
	config.objects.push(obj);
}


function removeObjects(jsx)
{
	jsx.removeObject(objects);
	objects=[];
}

function showNode(jsx,node,color,naam,dash_s)
{
	
	console.log(node);
	if( node && Object.keys(node).length === 0 && node.constructor === Object) // empty node
		return "";
	
	var bias = node.bias;
	var ae = node.weights[0];
	var eqn="x<sub>1</sub>";
	var eqn2=node.weights[0].toFixed(3) + " x<sub>1</sub>";
	var len = Object.keys(node.weights).length
	for(var i=1; i<len;i++)
	{
		eqn += " + " + (node.weights[i]/ae).toFixed(3) +  " x<sub>"+(i+1)+"</sub>";
		eqn2 += " + " + node.weights[i].toFixed(3) +  " x<sub>"+(i+1)+"</sub>";
	}
	if(len==2) toonVergelijkingNode(jsx,node,color,naam,dash_s);
	
	eqn = naam + ": " + eqn + " = " + (-(bias/ae)).toFixed(3);
	eqn2 = " , ongeschaald: " + eqn2 + " + " + bias.toFixed(3) + " = 0";
	return eqn+eqn2;
}

function toonVoorspellingen(config)
{
	var trainingData=config.data;
	var net=config.net;
	jsonobj = net.toJSON();
	var i,j,k;
	var txt="";
	var headertxt="";
	var inputtxt="";
	var voorspeltxt="";
	var hiddenlayertxt="";
	
	// toon voor alle input data de output en de door het netwerk voorspelde waarde
	// in rood als de waarde niet in overeenstemming is.
	var prediction;
	var inputpunt;  // nodig voor input in huidige verborgen laag
	var punt; 		// output huidige laag
	var correct;
	var fouten = 0; // aantal verkeerd voorspelde trainingspunten
	for(i=0;i<trainingData.length;i++)
	{
		
		prediction=net.run(trainingData[i].input);
		inputpunt=trainingData[i].input;
		hiddenlayertxt="";
		for(j=1;j<= (config.hiddenLayers?config.hiddenLayers.length:0);j++)
		{
			punt=[];
			for(k=0;jsonobj.layers[j][k]; k++)
			{
				punt[k]=computeNodeOutput(
					jsonobj.layers[j][k],inputpunt,config.activation)
				hiddenlayertxt+="<td>"+punt[k].toFixed(2)+"</td>";
			}
			// console.log("punt: "+ punt)
			if(config.hiddenLayers[j-1]==2)
			{
				voegToeTrainingsPunt(
					config.tekening[j],punt,
						trainingData[i].fout?
						"rgb(0,255,0)":
						(
							trainingData[i].output[0]>0.5?"rgb(0,0,255)":"rgb(255,0,0)"
						)
					);
			}
			inputpunt=punt; // punt wordt input volgende laag
		}
		var styletr = "style='color: "+(
						trainingData[i].fout?
						"rgb(0,255,0); background-color:black;'":
						(
							trainingData[i].output[0]>0.5?"rgb(0,0,255)'":"rgb(255,0,0)'"
						)
					);
		var correct=true;
		for(k=0;k<trainingData[i].output.length;k++) 
			correct = correct&&
			(Math.abs(trainingData[i].output[k]-prediction[k])<0.5)
		
			inputtxt+="\n\t<tr "+
			(
				correct?styletr:
				(trainingData[i].fout?
					"style='background-color: darkred; color: yellow;'" 
					:"style='background-color: red; color: yellow;'" )
			)
			+">";
		if(!correct) fouten++;
		for(k=0;k<trainingData[0].input.length;k++)
		{
			inputtxt+="<td>"+ trainingData[i].input[k].toFixed(2) +"</td>"
		}
		inputtxt+=hiddenlayertxt;
		inputtxt+="<td>"+trainingData[i].output +
			"</td><td>" +arrayToFixed(prediction,2)+"</td>";
		inputtxt+="</tr>";
	}
	// als er één andere input is waarvoor het netwerk een voorspelling met doen
	// voeg die dan hier toe aan de resultaten tabel
	headertxt="\n<table border=1>\n\t<tr>";
	for(k=1;k<=trainingData[0].input.length;k++)
	{
		headertxt+="<td>x<sub>"+k+"</sub></td>";
	}
	var colspan=1;
	for(j=1;j<= (config.hiddenLayers?config.hiddenLayers.length:0);j++)
	{
		for(k=0;jsonobj.layers[j][k]; k++)
		{
			headertxt+="<td>l<sub>"+j+ "</sub> x<sub>"+k+"</sub></td>";
			colspan++;
		}
	}
	headertxt+="<td>gewenst</td><td>voorspeld</td></tr>";
	txt="<h2>Voorspellingen trainingsdata</h2>Aantal fout voorspeld: "+fouten+"<br/>";
	
	return txt+headertxt+inputtxt+"\n</table>";
	
}

function arrayToFixed(values,n)
{
	res=[];
	var first=true;
	var i;
	for(i=0;i<values.length;i++)
	{
		res[i]=values[i].toFixed(n)
	}
	return res;
}

function logger(msg,outputobj)
{
	outputobj.innerHTML += msg;
}

function computeNodeOutput(node,input,activationf)
{
	//console.log("node: "+node);
	//console.log(input);
	//console.log(activationf);
	var sum=node.bias;
	var res=0;
	var i;
	// console.log("inputlength "+ input.length);
	// console.log(node.weights);
	for(i=0;i<input.length;i++) sum += node.weights[i]*input[i];
	// console.log("sum: "+sum);
	switch(activationf)
	{
		case "sigmoid" : res=sigmoid(sum); break;
		case "tanh" : res=Math.tanh(sum); break;
		default: res=sum;
	}
	// console.log("activation: "+res);
	return res;
}

function sigmoid(x) { return 1/(1 + Math.exp(-x)); }

/* doe een voorspelling met het netwerk met de data uit het voorspel veld
plaats antwoord in veld voorspeld
*/
function askBrain()
{
	var v="Niets te voorspellen";
	var data,len,out;
	var testdata;
	if( config.net)
	{
		try{
			// console.log(document.getElementById("voorspel").value);
			testdata = eval(document.getElementById("voorspel").value); 
			if(testdata!=null)
			{
				 //console.log(testdata);
				 v="Voorspellingen zijn:"
				 len=testdata.length;
				 for(var i=0; i<len;i++)
				 {
					data=testdata[i].input;
					out=config.net.run(data);
					console.log(typeof(out[0]));
					if(typeof(out[0])== "number")
					{
						v+= "<br/>["+data+"] : "+arrayToFixed(out,3);
					}
					else
					{
						v+= "<br/>["+data+"] : "+JSON.stringify(out, null, 2);
					}
				 }
			}			
		}
		catch(err)
		{
			v+="<br/>input bevat een fout";
		}
	}
	else v+=", eerst trainen";
	document.getElementById("voorspeld").innerHTML=v;
}
