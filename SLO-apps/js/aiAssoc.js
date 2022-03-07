/*
  Maak van een string array een getallen array en vorm de hash om de teksten weer terug te kunnen zoeken
*/
function mapStringArray(Ct,hashNames)
{
	var C=[];
	var line=Ct;
	var word;
	var wordReg;
	var text;
	var expr = Ct.includes('"')? new RegExp('"[^"]*"'):new RegExp("'[^']*'");
	var i = 0;
	while(
		word = expr.exec(line)
	)
	{
		word = word.toString();
		hashNames[i]=eval(word);
		wordReg=new RegExp(word,'g');
		line=line.replace(wordReg,i);
		i++;
	}
	C=eval(line);
	return C;
}

function getEmptyCollection(k)
{
	var res =[];
	for(var i=0; i<k; i++ )res[i] =[];
	return res;
}


function collectieToTex(C,Name,hashNames=null)
{
	var tekst="<table><tr><th colspan='2'>Collectie $"+Name+"$</th></tr>\n";
	for(var i=0; i<C.length; i++)
	{
		tekst+="<tr><th>$"+ Name +"_{"+i+"}$</th><td>$\\{";
		tekst+=collectieItemToTex(C[i],hashNames);
		tekst+="\\}$</td></tr>\n";
	}
	tekst+="</table>\n";
	return tekst;
}

function collectieItemToTex(CI,hashNames=null)
{
	var first=true;
	var tekst="";
	for(var i=0; i<CI.length; i++)
	{
		if(first) first=false;
		else tekst+=",";
		tekst+=objectToTex(CI[i],hashNames);
	}
	return tekst;
}


function objectToTex(O,hashNames=null)
{
	
	var tekst="\\{";
	var first=true;
	if(hashNames && hashNames.length==0) hashNames=null;
	for(var i=0; i<O.length; i++)
	{
		if(first) first=false;
		else tekst+=",";
		tekst+=hashNames?hashNames[O[i]]:O[i];
	}
	tekst+="\\}";
	return tekst;
}

function isEqualCollection(C1,C2)
{
	var l= C1.length;
	var l2;
	if(l != C2.length) return false;
	var i,j;
	for( i=0 ; i< l ;i++ )
	{
		l2=C1[i].length;
		if( l2 != C2[i].length ) return false;
		for(j=0;j<l2;j++) 
		{
			if(! ( C1[i][j] == C2[i][j] )) return false;
		}
	}
	return true;
}

function getSingleItems(C)
{
	var F0=eval("["+C.toString()+"]"); // maak een enkele rij met alle elementen, waarschijnlijk niet optimaal
	var list=[];
	for(i=0;i<F0.length;i++)
	{
			if(!list.includes(F0[i])) list.push(F0[i]);
	}
	return list;
}

function generateF(iteratie,C,F)
{
	F[iteratie]=[];
	var i,j,k;
	var obj,F0=null;
	
	if(iteratie==0)
	{

		F0=getSingleItems(C);
		F[0]=[];
		for(i=0;i<F0.length;i++)
		{
			F[0].push([F0[i]]);
		}
		
	}
	else
	{

		F0=getSingleItems(F[iteratie-1]);
		F[iteratie]=combinations([],F0,iteratie); // genereer alle combinaties met alle elementen uit de vorige iteratie
	}
	// console.log(F);
	return F0;
}

function combinations(store,list,n)
{
	var tlist;
	var tstore;
	var i,j;
	// console.log("list " +list )

	if(n>0)
	{
		for(i=0;i<list.length;i++)
		{
			tlist=JSON.parse(JSON.stringify(list));  // deep copy the random list
			tlist.splice(0,i+1);
			tstore=combinations([],tlist,n-1);
			// console.log("tstore.length " +tstore.length )
			for(j=0;j<tstore.length;j++)
			{
				tstore[j].push(list[i]);
				// console.log("store " +store )
				store.push(tstore[j]);
			}
		}
	}
	else
	{
		for(i=0;i<list.length;i++)
		{
			store.push([list[i]]);
		}
	}
	// console.log("store");
	// console.log(store);
	
	return store;
}

function checkSupport(C,F,s)
{
	var i,j,c,t;
	var sizeC=C.length;
	var Supp=[];
	for(j=F.length-1;j>=0;j--) // loop downwards to make deleting easier
	{
		c=0;
		for(i=0;i<sizeC;i++)
		{
			t=FinC(F[j],C[i]);
			// console.log("t:" + t )
			c+=t;
		}
		//console.log("count:" + c +" Support :" + (c/sizeC) + " in: " + sizeC + " F["+j+"]: " + F[j]);
		if( s > c/sizeC ) F.splice(j, 1) // Niet voldoende support remove item
		else Supp.push(c/sizeC);
		//console.log("c:" + c +"S:" + (c/sizeC) + " F: " + F);
	}
	Supp.reverse();
	return [F,Supp];
}

function FinC(F,C)
{
	var i,j,res=0;
	var Fl=F.length;
	for(i=0;i<Fl;i++)
	{
		res+=C.includes(F[i]);
	}
	// console.log("res:" + res + " F1:" + Fl);
	return (res==Fl?1:0);
}

function getTexConfidence(FS,conf,hashNames)
{
	var tekst="<table><tr><th>Implicatie</th><th>confidence</th></tr>\n";
	var i,j,k,m;
	var toplevel,sublevel;
	for(i=FS.length-1; i>=0; i--)
	{
		toplevel=FS[i];
		for(j=i-1; j>=0; j--)
		{
			sublevel=FS[j];
			for(k=0;k<toplevel[0].length;k++)
			{	
				for(m=0;m<sublevel[0].length;m++)
				{
					if( FinC(sublevel[0][m],toplevel[0][k]) && toplevel[1][k]/sublevel[1][m] >= conf)
					{
						
						tekst+="<tr><th>$"+ objectToTex(sublevel[0][m],hashNames) +"\\Rightarrow "+objectToTex(toplevel[0][k],hashNames)+"$</th><td>";
						tekst+=((toplevel[1][k]/sublevel[1][m])*100).toFixed(1)+"%";
						tekst+="</td></tr>\n";
						
					}
				}
			}
		}
	}
	tekst+="</table>\n";
	return tekst;

}

function apriori(C,sup,conf,hashNames)
{
	var tekst="Collectie C:<br/>";
	tekst+="$\\{"+collectieItemToTex(C,hashNames)+"\\}$<br/>";
	var klaar=false;
	var iteratie = 0;
	var F=[];
	var FS=[];
	if(C==null || C.length<2 ) return "Geen collectie gegeven";
	do{
		generateF(iteratie,C,F,iteratie);
		
		FS.push(checkSupport(C,F[iteratie],sup));
		if(FS[iteratie][0].length==0) 
		{
			klaar=true;
		}
		iteratie++;
	}
	while(!klaar);
	tekst+="Voldoende frequente verzamelingen (minimaal support "+(sup*100).toFixed(1)+"%):<br/>";
	tekst+=collectieToTex(F,"F",hashNames);
	tekst+="Implicaties met voldoende vertrouwen (minimaal "+(conf*100).toFixed(1)+"%):<br/>";
	tekst+=getTexConfidence(FS,conf,hashNames);
	return tekst;
}

