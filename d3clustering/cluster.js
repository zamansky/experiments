
var data = new Array(200);
data = _.map(data,function(d) {
    item = {'type':1, 'features':[Math.floor(Math.random()*800),
				  Math.floor(Math.random()*400)
				 ]};
    return item;});

var numCentroids = 3;
var clustercolors = ['red','blue','black']
var  centroids = [ data[0],data[1],data[2]];

var height=400, width=800;
var svg = d3.select("body")
	.append('svg')
	.attr('id','svg')
	.attr('height',height)
	.attr('width',width);


var items = svg.selectAll("item")
	.data(data)
	.enter()
	.append("circle")
	.attr('class','item')
	.attr('r',5)
	.attr('cx',function(d){return d.features[0]})
	.attr('cy',function(d){return d.features[1]})
	.attr('fill','red');


var ccircles = svg.selectAll('centroid')
	.data(centroids)
	.enter()
	.append("circle")
	.attr('class','centroid')
	.attr('r',5)
	.attr('cx',function(d){return d.features[0]})
	.attr('cy',function(d){return d.features[1]})
	.attr('fill',function(d){return clustercolors[d.type];});

var dist = function(a,b){
    return _.reduce(_.map(_.zip(a,b),function(d) {return (d[0]-d[1])*(d[0]-d[1]);}),
		    function(a,b) {return a+b;},0);
}

var assign = function(centroids,data) {
    _.each(data, function(d){
	var mins = _.map(centroids,function(d2) {
	    return dist(d2.features,d.features)});
	var min = _.min(mins);
	var mini = _.indexOf(mins,min);
	d['type']=mini
	
    }	  );

    items
	.attr('stroke-width',3)
	.attr('stroke',function(d){ return clustercolors[d.type];});
    
}


var recenter = function(centroids,data) {
    _.each(centroids,function(d,i,c){
	// pull out this centroids current points
	var subset = _.filter(data,function(d2) { return d.type==d2.type;});
	subset = _.map(subset,function(d) {return d.features;});
	var z = _.zip(subset);
	console.log(z);
	var sums = _.map(z,function(d) {
	    return _.reduce(d,function(a,b){return a+b;}); });
	console.log(sums);
	var avgs = _.map(sums, function(d,i) {return parseInt(d)/z[i].length;});
	c[i].features = avgs;
		
    });
}

assign(centroids,data);


var clusterit = function(){
    assign(centroids,data);
    recenter(centroids,data);
    console.log(centroids);
    d3.selectAll(".centroid")
	.transition()
  	.duration(3000)
	.attr('stroke-width',3)
	.attr('stroke',function(d){ return clustercolors[d.type];})
	.attr('cx',function(d){return d.features[0];})
	.attr('cy',function(d){return d.features[1];});

}

var click = d3.select("#click").on('click',clusterit);

