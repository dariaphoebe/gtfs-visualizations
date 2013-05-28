var imgWidth = 1400;
var imgHeight = 1400;

function coord2px(lat, lng) {
	var center_coord = {lat: 48.40783887047417, lng: 9.987516403198242};
	var center_px = {x: imgWidth/2, y: imgHeight/2};
	var coord2px_factor = 3400;

	var offsetX = 0;
	var offsetY = -300;

	return {
		  x: center_px.x + ((lat - center_coord.lat) * coord2px_factor) + offsetX
		, y: center_px.y + ((lng - center_coord.lng) * coord2px_factor) + offsetY
	};
}

var stops = [];
var paper;
var foo;
var trips = [];

$(function (){
	paper = Raphael("canvas", imgWidth, imgHeight);
	//paper = Raphael("canvas", imgWidth, imgHeight, function() {})
	/*
	$.getJSON("/stops/", function(data) {
			var j = 0;
			for (var i in data) {
				var stop = data[i];
				var obj = coord2px(stop.stop_lat, stop.stop_lon);

				var circle = paper.circle(obj.x, obj.y, 3);
				circle.attr("fill", "#f00");
				console.log(obj)
				//circle.attr("stroke", "#fff");
				//if (j === 5) break;
				++j;
			}
		//});
	});
	*/

	$.getJSON("/trips/", function(data) {
		for (var i in data) {
			var trip = data[i];
			if (trips[ trip.shape_id ] == undefined)
				trips[ trip.shape_id ] = 1;
			else
				trips[ trip.shape_id ]++;
			
			if (trips[ trip.shape_id ] > max || max == undefined)
				max = trips [ trip.shape_id ];

			if (trips[ trip.shape_id ] < min || min == undefined)
				min = trips [ trip.shape_id ];
		}
		//console.log(trips)
	});

	$.getJSON("/shapes/", function(data) {
		var j = 0;
		var paths = [];

		// preprocess 
		for (var i in data) {
			var shape = data[i];
			var obj = coord2px(shape.shape_pt_lat, shape.shape_pt_lon);

			if (paths[shape.shape_id] == undefined) {
				paths[shape.shape_id] = []
				paths[shape.shape_id][shape.shape_pt_sequence] = "M" + obj.x + " " + obj.y
				//paths[shape.shape_id] = "M" + obj.x + " " + obj.y
			} else {
				paths[shape.shape_id][shape.shape_pt_sequence] = 
					" L" + obj.x + " " + obj.y;
			}

			//if (j === 30) break;
			//++j;
		}

		//var factor = 100 / max;
		console.log("max " + max)
		console.log("min " + min)
		//console.log(factor)
		rainbow.setNumberRange(min, max);
		rainbow.setSpectrum('blue', 'green', 'yellow', 'red', 'white');
		for (var i in paths) {
			var path = paths[i].join() 
			//path += " Z";
			//console.log(path);

			if (trips[i] > 200) break;
			foo = paper.path(path);
			//var path = paper.path(path);
			//foo.attr("fill", "#f00");
			//var color =  (1 - t) * c0 + t * c1

			//console.log("i " + i + ", " + trips[i]);
			var color = rainbow.colourAt(trips[i]);
			console.log(trips[i])
			foo.attr("stroke", "#" + color);
			//foo.attr("stroke", "#fff");
		}
	});
});

var rainbow = new Rainbow();
var max;
var min;


function drawCenter() {
	/* // draw center
	var obj = coord2px(48.40783887047417, 9.987516403198242);
	var circle = this.circle(obj.x, obj.y, 5);
	circle.attr("fill", "#f00");
	circle.attr("stroke", "#fff");
	console.log(obj);
	*/

}
