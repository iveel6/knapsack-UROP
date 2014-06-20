//Global variables
var audioAlert = new Audio('sounds/sound.wav'); 
var audioMove = new Audio('sounds/click.mp3');
var audioReset = new Audio('sounds/move.wav');
var sackLimit = 20 //parseInt($("#knapsack").attr("data-maxweight"));
var weight = 0;
var value = 0;
var bestScores =[-1,0,0]; //-1 will be 0 once page is loaded
var barHeight = 274; 
var barWidth = 30;
var x = 3;
var scaleFunction = d3.scale.linear().domain([0,sackLimit]).range([0,barHeight]);
var yellow = "rgba(250, 247, 182, 0.97)"
var mode = true; //sound mode on or off

function soundChange(){
	if (mode){
		mode=false;
	}else{
		mode=true;
	}
}

//Checks if current total value could be one of highest three scores.
//We will store highest 3 scores.
function isBest(val){
	if( bestScores[0]<val){
		bestScores[0]=val;
		bestScores.sort(function(a, b){return a-b});
		$("#best").html('BEST RECORDS<br>1st: '+bestScores[2]+'<br>2nd: '+bestScores[1]+'<br>3rd: '+bestScores[0]);
	}
};

//Create bar chart 
//to show how much weight is already loaded
function createChart(h){
	var chart = d3.select("#d3chart")
	              .attr("width", barWidth+2*x)
	              .attr("height", barHeight+2*x);
	
	chart.append("rect")
	      .attr("id", 'emptyRect')
	      .attr("width", barWidth+2*x)
	      .attr("height", barHeight+2*x)
	      .attr("stroke-width",2*x)
	      .attr("stroke","rgb(12, 244, 75)");

	chart.append("rect")
	      .attr("id",'fullRect')
	      .attr("width", barWidth)
	      .attr("height",0);	
};

//Update bar chart
function drawChart(h){	
	d3.select("#fullRect")
	  .attr("height", scaleFunction(h))
	  .attr("transform", "translate("+x+","+(x+barHeight-scaleFunction(h)+")"));
}

//Alert for too heavy choice 
function alertLimit(){
	console.log(sackLimit);
	if (mode){audioAlert.play();};
	$("#emptyRect").css("stroke", "red").css("fill","red");
    window.setTimeout( function(){
		$("#emptyRect").css("stroke","rgb(12, 244, 75)").css("fill", yellow); }, 1000);
	
}

//Update display of knapsack' total weight and value of 
function updateValues(){
	$("#values").html('available capacity: '+(sackLimit-weight)+'kg <br>total weight: '+weight+'kg, value: $'+value);
}


//Change position of item (house <-->sack)
function moveItem(img){
	var item = img.parent("div");
	var itemWeight = parseInt(item.attr("weight"));
	var itemValue = parseInt(item.attr("value"));
	
    if (item.attr("location") == 'house'){
		if (weight+itemWeight<= sackLimit){
			
        item.attr("location", 'sack');
        weight += itemWeight;
		value +=itemValue;
		$("#displaySack").append(item);
		}else{
			alertLimit();
		}
    }else{
        item.attr("location", 'house');
        weight -= itemWeight;
		value -=itemValue;
		$("#displayHouse").append(item);
    }
}

//will be called when page is loaded
function initialize(){
	    $('.item').each( function(i){ 
		var img = $(":first-child", $(this));	
		$(this).attr("name", img.data("name"));
		$(this).attr("location", "house");
		$(this).attr("weight", parseInt(img.data("weight")));
		$(this).attr("value", parseInt(img.data("value")));
		$(this).append('<br>$'+$(this).attr("value")+'<br>'+$(this).attr("weight")+'kg')
	})
		isBest(value);
}


$(function(){
	
	//Building general html structure nests
	
	// houseSide
	//      header
	//      displayHouse
	//          items (item = [div img div])
	// sackSide
	//      header
	//          texts  (all text displays)
	//          buttons(all buttons)
	//      displayBody
	//           displayChart
	//           displaySack
	
	var house = $("<div class='side' id='houseSide'><div class='header'></div><div id='displayHouse'></div></div>");
	var sack = $("<div class='side' id='sackSide'><div class='header'></div><div id='displayBody'><span id='displayChart'></span><span class='display' id='displaySack'></span></div></div>");
	var chart = $("<svg class='chart' id='d3chart'></svg>")
	             .attr("width",335)
				 .attr("height",45);
	$("#knapsack").append(house)
	              .append(sack);
	               
    $("#knapsack .image").wrap('<div class="item"></div>');
    $("#displayHouse").append($(".item"));
	
	var texts = $('<div id="text"><div id="best"></div><div id="values"></div></div>')
	var buttons= $("<div id='buttons'><button id='help'>Sound</button><button id='reset'>RESET</button></div>") 
	$("#sackSide .header").append(texts)
	                      .append(buttons)
	                      .append('<span id="arrowR"></span>')
	                      .append('<span id="instructionS">Click item to move to house</span>');
	
	$("#houseSide .header").append('<span id="arrowL"></span>')
	                       .append('<span id="instructionH">Click item to move to knapsack</span>');
	
	$("#displayChart").append(chart);
	$("#displaySack").append('<svg id="burglar"><svg>');
	$("#text").append('<svg id="bag"></svg>');
	
	//Build up html page
	initialize();	
	isBest(value);
	createChart(weight);
	updateValues();
	
	//Restart play by "reset" button
    $("#reset").click(function (){
		if (mode){audioReset.play();};
		isBest(value);
		weight = 0;
		value = 0;
		drawChart(weight);
		$("#displayHouse").append($(".item"));
		$(".item").attr("location", "house");
		updateValues();
		
	})
	//Change sound mode
	$("#help").click(function (){
		soundChange();
		console.log(mode);
	});
					 
    //Click on item ---> change its position 
    $(".item .image").click(function () {
		if (mode) {audioMove.play();};
		moveItem($(this));
	    updateValues();
	    drawChart(weight);
    })
})   	





