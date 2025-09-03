function getEmptyCollection(k)
{
	var res =[];
	for(var i=0; i<k; i++ )res[i] =[];
	return res;
}

function getDistHeaderTex(k)
{
	var res ="<tr>\n\t<td></td>";
	for(var i=1; i<=k; i++ )res +="<th>$M_{"+i+"}$</th>";
	return res+"\n\t</tr>";
}

function afstand(obj1,obj2)
{
		return(Math.sqrt(sumSquaredDiff(obj1,obj2)));
}

function sumSquaredDiff(obj1,obj2)
{
	if(!obj1||!obj1||obj1.length!=obj1.length)
		return NaN;
	else
	{
		var total=0;
		var diff;
		for(var i=0;i<obj1.length;i++)
		{
			diff=obj2[i]-obj1[i];
			total += diff*diff;
		}
		return total;
	}
}

function centrum(cluster)
{
	if(!cluster || !cluster.length || !cluster[0].length )
		return null;
	var n=cluster.length;
	var i,j;
	var M=[];
	for(j=0;j<cluster[0].length;j++)
	{
		M[j]=0;
	}
	for(j=0;j<cluster[0].length;j++)
	{
		for(i=0;i<n;i++)
		{
			M[j]+=cluster[i][j];
		}
		M[j]/=n;
	}
	return M;
}

function collectieToTex(C)
{
	var tekst="<table><tr><th colspan='2'>Collectie $C$</th></tr>\n";
	for(var i=0; i<C.length; i++)
	{
		tekst+="<tr><th>$C_{"+i+"}$</th><td>$\\{";
		tekst+=collectieItemToTex(C[i]);
		tekst+="\\}$</td></tr>\n";
	}
	tekst+="</table>\n";
	return tekst;
}

function collectieItemToTex(CI)
{
	var first=true;
	var tekst="";
	for(var i=0; i<CI.length; i++)
	{
		if(first) first=false;
		else tekst+=",";
		tekst+=objectToTex(CI[i]);
	}
	return tekst;
}

function centraToTex(M)
{
	var tekst="$M=\\{";
	var first=true;
	for(var i=0; i<M.length; i++)
	{
		if(first) first=false;
		else tekst+=",";
		tekst+=objectToTex(M[i]);
	}
	tekst+="\\}$\n";
	return tekst;
}

function objectToTex(O)
{
	var tekst="\\{";
	var first=true;
	for(var i=0; i<O.length; i++)
	{
		if(first) first=false;
		else tekst+=",";
		tekst+=O[i];
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

function kMeansSteps(O,k,C=null,M=null,maxIter=4)
{
	k=Math.floor(k);
	if(k <1 ) return "Er zijn geen clusters te vormen in een " + k +  "-means algoritme";
	if(O==null || O.length < k || O[0].length <1  ) return "De lijst van objecten is niet goed.";
	var i,n;
	var tekst;
	var Cfinal=getEmptyCollection(k);
	var header=getDistHeaderTex(k);
	if(C!=null)
	{
		for(i=0;i<k;i++) {M[i]=centrum(C[i])}
	}
	if(M==null)
	{
		M=[];
		for(i=0;i<k;i++) {M[i]=O[i]}
	}
	tekst="Objecten: $"+collectieItemToTex(O)+"$<br/>\n";
	tekst+="Middelpunten: $"+collectieItemToTex(M)+"$<br/>\n";
	tekst+="Oplossing:<br/>\n"
	tekst+="<ol>\n";
	for(n=0;n<maxIter;n++)
	{
		tekst+="<li>Iteratie "+(n+1)+" :\n<table class='lijncollapse'>\n\t"+header+"\n\t";
			C=getEmptyCollection(k);
			for(var i=0;i<O.length;i++)
			{
				tekst+="\n\t<tr>\n\t<th>$O_{"+(i+1)+"}$</th>";
				index=0;
				min = 1000;
				for(var j=0;j<M.length;j++)
				{
					a=afstand(O[i],M[j])
					if(a<min)
					{
						min=a;
						index=j;
					}
					tekst+= "<td>"+a.toFixed(2)+"</td>";
				}
				C[index].push(O[i]);
				tekst+="<td>$C_{"+(index+1)+"}$</td></tr>";
			}
			tekst+="\n</table>";
			if( isEqualCollection(C,Cfinal) )
			{
				tekst+="Clusters zijn ongewijzigd dus klaar.";
				break;
			}
			for(i=0;i<k;i++) {M[i]=centrum(C[i])}
			tekst+=collectieToTex(C);
			tekst+=centraToTex(M)+"</li>\n";
			Cfinal=C;
	}
	tekst+="</ol>\n";
	return tekst;
}

