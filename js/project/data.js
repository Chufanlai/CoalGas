function readLayout(file){
	var tlength=getLength(file);
	d3.csv.parse(file, function(t, id){
		if(Load.illegal)
			return;
		if(id==0){
			if(!t.Name || !t.Pos || !t.Width){
				Load.illegal=true;
				alert("Wrong data format!");
				return;
			}
		}			
		var tpos=t.Pos;
		tpos=[parseFloat(tpos.substring(0,tpos.indexOf("_"))),
			parseFloat(tpos.substring(tpos.indexOf("_")+1,tpos.length))];
		var type=objects.type(t.Name),textAttr=[];
		var o;
		if(type=="text"){
			textAttr=t.TextAttr.split("|_|");
			textAttr[1]=(textAttr[1]=="true");
		}
		o=objects.create(tpos,parseFloat(t.Width),parseFloat(t.Rotate),type+"_"+objects.ID[type],type,parseFloat(t.Value),textAttr);//need to change
		o.init();
		objects.array[type].push(o);
		objects.ID[type]++;
	});
}

function findObject(id){
	return findObj(this.array[this.type(id)], id);
}

function findObj(array, id){
	var ord=-1;
	for(var i=0;i<array.length;i++)
		if(array[i].name==id){
			ord=i;
			break;
		}
	if(ord<0)
		return undefined;
	else
		return array[ord];
}

function delObject(id){
	delObj(this.array[this.type(id)], id);
}

function delObj(array, id){
	var ord=-1;
	for(var i=0;i<array.length;i++)
		if(array[i].name==id){
			ord=i;
			break;
		}
	if(ord<0)
		return;
	else
		array.splice(ord,1);
}

function copyObject(id){
	var o=this.find(id);
	var type=this.type(id);
	var tang=0.25*Math.PI;
	var textAttr=(type=="text")?[o.string,o.vertical,o.color]:[];
	var tsize;
	if(type=="text" && o.vertical){
		tsize=o.size[1];
	}
	else
		tsize=o.size[0];
	var to=this.create([o.pos[0]+rand_r*Math.cos(tang),o.pos[1]+rand_r*Math.sin(tang)],tsize,o.rotate,type+"_"+objects.ID[type],type,o.value,textAttr);
	to.init();
	this.array[type].push(to);
	this.ID[type]++;
}

function initObjects(){
	var tarr={}, tID={};
	$.each(this.types, function(id, d) {
		tarr[d]=[];
		tID[d]=0;
	});
	this.array=tarr;
	this.ID=tID;
}

function clearObjects(){
	objects=createObjects(objTypes);
	svg.selectAll("g")
	.remove();
}

function saveObject(id){
	var o=this.find(id);
	return o.name+","+o.pos[0]+"_"+o.pos[1]+","+o.size[0]+","+o.rotate+","+o.value+","+o.string+"|_|"+o.vertical+"|_|"+o.color;
}

function typeOf(id){
	var type;
	$.each(this.types, function(i, d) {
		if(!type && id.indexOf(d+"_")>=0)
			type=d;
	});
	return type;
}

function createObject(pos, width, rotate, name, type, value, textAttr){//Change here
	switch(type){
		case "bucket":
			return createBucket(pos, width, rotate, name);
		break;
		case "tank1":
			return createTank1(pos, width, rotate, name);
		break;
		case "tank2":
			return createTank2(pos, width, rotate, name);
		break;
		case "tank3":
			return createTank3(pos, width, rotate, name);
		break;
		case "separator":
			return createSeparator(pos, width, rotate, name);
		break;
		case "feeder":
			return createFeeder(pos, width, rotate, name);
		break;
		case "conveyer":
			return createConveyer(pos, width, rotate, name);
		break;
		case "gauge":
			return createGauge(pos, width, rotate, name, value);
		break;
		case "vibrating":
			return createVibFeeder(pos, width, rotate, name);
		break;
		case "valve1":
			return createValve1(pos, width, rotate, name);
		break;
		case "valve2":
			return createValve2(pos, width, rotate, name);
		break;
		case "valve3":
			return createValve3(pos, width, rotate, name);
		break;
		case "valve4":
			return createValve4(pos, width, rotate, name);
		break;
		case "valve5":
			return createValve5(pos, width, rotate, name);
		break;
		case "valve6":
			return createValve6(pos, width, rotate, name);
		break;
		case "valve7":
			return createValve7(pos, width, rotate, name);
		break;
		case "valve8":
			return createValve8(pos, width, rotate, name);
		break;
		case "valve9":
			return createValve9(pos, width, rotate, name);
		break;
		case "valve10":
			return createValve10(pos, width, rotate, name);
		break;
		case "valve11":
			return createValve11(pos, width, rotate, name);
		break;
		case "capacitor":
			return createCapacitor(pos, width, rotate, name);
		break;
		case "arrow":
			return createArrow(pos, width, rotate, name);
		break;
		case "diode":
			return createDiode(pos, width, rotate, name);
		break;
		case "monitoring":
			return createMonitoring(pos, width, rotate, name);
		break;
		case "text":
			return createText(pos, width, rotate, textAttr[1], textAttr[0], textAttr[2], name);//AJI changed here
		break;
	}
}

//loading files
function getData(){
    var file = document.getElementById("File").files[0];  
    var reader = new FileReader();
    //Read data as text 
    reader.readAsText(file);  
    reader.onload=function(f){
    	Load.contents=this.result;
    	Load.readAll=true;
    	if(Load.illegal){
    		Load.ready=true;
    	}
    }
} 

function getLength(text){
	return text.split(",").length;
}

function clearFile(){
     var file = document.getElementById("File");
	// for IE, Opera, Safari, Chrome
     if (file.outerHTML) {
         file.outerHTML = file.outerHTML;
     } else { // FF(包括3.5)
         file.value = "";
     }
}

function changeGauge(value){
	if(value<0)
		value=0;
	if(value>1)
		value=1;
	this.value=value;
	var o=$("#"+this.name+" rect");
	o.attr("y",parseFloat(o.attr("y"))+parseFloat(o.attr("height"))-this.maxHeight*value);
	o.attr("height",this.maxHeight*value);
}

function getConnectionPath(){
	var tx=[this.startPos[0], this.endPos[0]].sort(d3.ascending), 
		ty=[this.startPos[1], this.endPos[1]].sort(d3.ascending);
	this.pos=[tx[0],ty[0]];
	this.startPos=[this.startPos[0]-tx[0], this.startPos[1]-ty[0]];
	this.endPos=[this.endPos[0]-tx[0], this.endPos[1]-ty[0]];
	tx=[this.startPos[0], this.endPos[0]].sort(d3.ascending);
	ty=[this.startPos[1], this.endPos[1]].sort(d3.ascending)
	var p1, p2;
	if(this.endPos[0]==this.startPos[0]){
		var tlength=(this.endPos[1]-this.startPos[1])/3;
		p1=[this.startPos[0], this.startPos[1]+tlength];
		p2=[this.startPos[0], this.startPos[1]]+tlength*2;
		this.pos=[(this.startPos[0]+this.endPos[0])/2, (this.startPos[1]+this.endPos[1])/2];
	}
	else{
		var abstan=Math.abs((this.endPos[1]-this.startPos[1])/(this.endPos[0]-this.startPos[0]));
		var mdl;
		if(abstan>1){
			mdl=(this.endPos[1]+this.startPos[1])/2;
			p1=[this.startPos[0], mdl];
			p2=[this.endPos[0], mdl];
		}
		else{
			mdl=(this.endPos[0]+this.startPos[0])/2;
			p1=[mdl, this.startPos[1]];
			p2=[mdl, this.endPos[1]];
		}
	}
	this.size=[tx[1]-tx[0], ty[1]-ty[0]];
	this.origin=[tx[1]-tx[0], ty[1]-ty[0]];
	this.scales=[
	d3.scale.linear().domain([0,this.origin[0]]).range([0,1]),
	d3.scale.linear().domain([0,this.origin[1]]).range([0,1])];
	this.asp=this.origin[1]/this.origin[0];
	var tstart="M "+this.startPos[0]+","+this.startPos[1]+" L"+p1[0]+","+p1[1];
	var tmiddle=" L "+p1[0]+","+p1[1]+" L"+p2[0]+","+p2[1];
	var tend=" L "+p2[0]+","+p2[1]+" L"+this.endPos[0]+","+this.endPos[1];
	this.paths=[tstart+tmiddle+tend];
	this.path_fills=["none"];
}