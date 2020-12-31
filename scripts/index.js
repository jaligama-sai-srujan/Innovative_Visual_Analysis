const svg = d3.select("#plot");
var completeData;
var Change = 1;
const margin = {top: 40, right: 20, bottom: 30, left: 80};
const width = 1500 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;
// This runs when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
 document.body.style.backgroundImage = "url('images/nightSky.jpg')";
  Promise.all([d3.csv('Data/Dogs-Database.csv').then(function(data) {return data;}),d3.csv('Data/Flights-Database.csv').then(function(data) { return data;})])
          .then(function(values){
    
    dogsData = values[0];
	flightData = values[1];
	drawPlot();
  })

});


function circleTransitions() {
							if(Change == 1){
			Change = 0
		}
		else{
			Change = 1
		}
							drawPlot();
							setTimeout(function(){
									circleTransitions();
							}, 3000);
						
}

function slideChange(){
	document.getElementById("year-input").value = document.getElementById("myRange").value;
	drawScatter();
}

function numberChange(){
	document.getElementById("myRange").value = document.getElementById("year-input").value;
	drawScatter();
}


function drawPlot() {
	
	svg.selectAll('#xAxis').remove();
	svg.selectAll('#yAxis').remove();
	svg.selectAll('#xLabel').remove();
	svg.selectAll('#yLabel').remove();
var imgs = svg.selectAll("image").data([0]);
            imgs.enter()
            .append("svg:image")
  svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

	flightData = flightData.filter(function(d) { return d.Rocket == "R-2A" || d.Rocket == "R-1D" || d.Rocket == "R-1B" || d.Rocket == "R-7, Sputnik 2"})
	var DateData = []
	var AltitudeData = []
	for(var i in flightData){
		row = flightData[i];
			
			console.log(typeof row["Date"])
			DateData.push(row["Date"])
			AltitudeData.push(row["Altitude"])																		
	}
	
	DateData.pop();
	AltitudeData.pop();
	var xRangeList = [];
	for (var i = 0; i <= width-100; i=i+(width/(DateData.length+2))) {
		xRangeList.push(i);
	}
	console.log(xRangeList)
	xScale = d3.scaleOrdinal()
	.range(xRangeList)
	.domain(DateData.filter((v, i, a) => a.indexOf(v) === i));
	
	
 // Add Y axis
  yScale = d3.scaleLinear()
  .domain([0,1500]).range([ height, 0]);
  
  var tooltip = d3.select("body").append("div").style("position", "absolute").style("background-color", "#A9A9A9").style("border", "solid").style("border-width", "1px").style("border-radius", "5px").style("padding", "3px").style("opacity", "0");

  var finalData = []
	for(var i in flightData){
		temp = {}
		row = flightData[i];
		temp["xAttribute"] = row["Date"]
		temp["yAttribute"] = row["Altitude"]
		temp["Result"] = +row["Mission"]
		temp["DogsSurvived"] = row["DogsSurvived"] 
		temp["Rocket"] = row["Rocket"]
		temp["Dogs"] = row["Dogs"] 
		finalData.push(temp);																			
	}
	svg.selectAll("image").data(finalData.filter(d=>d.Result == 0)).enter().append("svg:image")
										  .attr('xlink:href',function(d) {console.log(d.DogsSurvived); if(d.DogsSurvived == "1"){return "images/rocket-1.png";}else{return "images/rocket-2.png";}})
										  .attr("x", function(d) {return 2*margin.left+xScale(d.xAttribute)-40})
										  .attr("y", function(d) { return yScale(d.yAttribute)-50})
										  .attr('height', '100')
											.attr('width', '80')
											.on("mouseover", function(d) {
													tooltip.style("opacity", 1)
									  				} )
				.on("mousemove", function(d) {
										  
										
										  tooltip.html("Rocket: " + d.Rocket+ " <br> "+ "Dogs in the Rocket: " + d.Dogs)
											 .style("font-size", "18px")
											 .style("font-weight","bold")
											 .style("padding","10px")
											 .style("left", (d3.event.pageX + 50) + "px")
											 .style("top", (d3.event.pageY - 50) + "px");
									  } )
			  .on("mouseleave", function(d) {
											tooltip
											  .style("opacity", 0)
										  } );
	
  var imgs = svg.selectAll("image").data(finalData.filter(d=>d.Result == 1)).enter().append("svg:image")
										  .attr('xlink:href',function(d) {console.log(d.xAttribute); if(d.DogsSurvived == "1"){return "images/rocket-1.png"}else{return "images/rocket.png"}})
										  .attr("x", function(d) {return 2*margin.left+xScale(d.xAttribute)-40})
										  .attr("y", function(d) { return yScale(d.yAttribute)-50})
										  .attr('height', '100')
											.attr('width', '80')
											.on("mouseover", function(d) {
													tooltip.style("opacity", 1)
									  				} )
				.on("mousemove", function(d) {
										  
										
										  tooltip.html("Rocket: " + d.Rocket+ " <br> "+ "Dogs in the Rocket: " + d.Dogs)
											 .style("font-size", "18px")
											 .style("font-weight","bold")
											 .style("padding","10px")
											 .style("left", (d3.event.pageX + 50) + "px")
											 .style("top", (d3.event.pageY - 50) + "px");
									  } )
			  .on("mouseleave", function(d) {
											tooltip
											  .style("opacity", 0)
										  } );
	update();
	
	function update(){
		
		
		imgs.transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr("y", function(d) { return yScale(0)-50})
		
		setTimeout(function(){
									updateBack();
							}, 3000);
	}
	
	function updateBack(){
		imgs.transition()
        .ease(d3.easeLinear)
        .duration(2000)
        .attr("y", function(d) { return yScale(d.yAttribute)-50})
		
		setTimeout(function(){
									update();
							}, 3000);
	}
											
											
											
								
								
	// reference
	
	/*
	svg.selectAll('g')
  .data(finalData,d=>{if(d!=undefined)return d.xAttribute;})
  .join(
      enter => {
          const g = enter.selectAll("image").enter().append('svg:image').attr('xlink:href',"images/rocket.png").attr('height', '40').attr('width', '30')
                        .attr('transform', `translate(${(width/2-margin.left)},${(margin.top)})`);
          
		
          g.call(enter => enter.transition()
                                .delay(0)
                                .duration(500)
                                .attr('transform', (d,i) => `translate(${2*margin.left+xScale(d.xAttribute)},${yScale(d.yAttribute)+20})`));
      },
      update => {
          update.selectAll("svg:image")
          
          update.call(update => update.transition()
                                      .delay(500)
                                      .duration(500)
                                      .attr('transform', (d,i) => `translate(${2*margin.left+xScale(d.xAttribute)},${ yScale(d.yAttribute)+20})`));
      },
      exit => {
          // exit.call(exit => exit.transition())
          exit.selectAll("svg:image")
          .attr("stroke","red")
          exit.call(exit => exit.transition()
                                .duration(500)
                                .attr('transform', (d,i) => `translate(${(width/2-margin.left)},${margin.top})`)
                                .remove());
      }
  );



*/

		// reference end
										
											
	var yAxis = d3.axisRight().scale(yScale).ticks(5);

	svg.append("g").call(yAxis.tickSize(width-130)).call(g => g.select(".domain").remove())
               .call(g => g.selectAll(".tick line")
			   .attr("stroke-opacity", "0.8").attr("stroke-dasharray", "5").style("color","#fff").style("opacity","0.4").attr("transform", "translate("+(2*margin.left) +"," + (0) + ")")).call(g => g.selectAll(".tick text").attr("x", 2*margin.left-40).attr("y", "0").style("color","#fff").style("opacity","0.8"));
        
	// Adding X label and formating X-ticks	
    var xAxis = d3.axisBottom().scale(xScale).ticks(DateData.length);
    svg.append("g")
		.attr("id","xAxis")
        .attr("transform", "translate("+(2*margin.left) +"," + (height) + ")")
		.style("font-family","Lato")
		.style("color","#fff")
        .call(xAxis)
	svg.append("text")
		.attr("id","xLabel")
        
		.attr("x", (2*margin.left)+width / 2 )
        .attr("y",  height + ((2*margin.bottom)/3) + margin.top)
        .style("text-anchor", "middle")
		.style("font-family", "sans-serif")
        .style("font-size", "14px")
		.style("font-weight", "700")
		.style("fill","#fff")
		.text("Date");
	
	//Legend
	svg.append("rect")
		.attr("x",width+margin.left-210 )
		.attr("y",margin.top+2)
		.attr("width", "160px")
		.attr("height", "125px")
		.style("stroke","#fff")
		.style("fill","None")
	
	svg.append("image")
		.attr('xlink:href',"images/rocket.png")
		.attr("x",width+margin.left-210 )
		.attr("y",margin.top+2)
		.attr("width", "30px")
		.attr("height", "30px")
	svg.append("image")
		.attr('xlink:href',"images/rocket-1.png")
		.attr("x",width+margin.left-210 )
		.attr("y",margin.top+42)
		.attr("width", "30px")
		.attr("height", "30px")
	svg.append("image")
		.attr('xlink:href',"images/rocket-2.png")
		.attr("x",width+margin.left-210 )
		.attr("y",margin.top+82)
		.attr("width", "30px")
		.attr("height", "30px")

	svg.append("text")
		.attr("x", width+margin.left-170)
		.attr("y", margin.top+20)
		.text("-   All Dogs Survived")
		.style("font-size", "13px")
		.style("font-family", "sans-serif")
		.style("fill","#fff")
		.attr("alignment-baseline","middle")
	svg.append("text")
		.attr("x", width+margin.left-170)
		.attr("y", margin.top+60)
		.text("-   One Dogs Died")
		.style("font-size", "13px")
		.style("font-family", "sans-serif")
		.style("fill","#fff")
		.attr("alignment-baseline","middle")
	svg.append("text")
		.attr("x", width+margin.left-170)
		.attr("y", margin.top+100)
		.text("-    Both Dogs Died")
		.style("font-size", "13px")
		.style("font-family", "sans-serif")
		.style("fill","#fff")
		.attr("alignment-baseline","middle")
		
	
}
