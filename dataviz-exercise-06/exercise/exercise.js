
/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

class ImageHistogram {

	initImage() {
		this.canvas = document.querySelector('#' + this.figure_element_id + ' canvas');
		console.log(this.canvas)
		this.canvas_context = this.canvas.getContext("2d");

		const image = new Image;
		image.onload = () => {
			this.canvas.width = image.width;
			this.canvas.height = image.height;
			this.canvas_context.drawImage(image, 0, 0);
		};
		image.src = "epfl-rolex.jpg";
	}

	/*
		Calculate the histogram of pixel values inside the specified area
		Returns an array [values_red, values_green, alues_blue]
		such that values_red[r] = number of pixels in the area which have the red value exactly equal to r
	*/
	getImageHistogramOfArea(x_left, y_top, width, height) {
		// getImageData:
		//	https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
		// returns an ImageData
		//	https://developer.mozilla.org/en-US/docs/Web/API/ImageData
		// we use the .data property which is a uint8 array
		//	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
		const image_bytes = this.canvas_context.getImageData(x_left, y_top, width, height).data;

		// To make a histogram, for each color we count how many pixels
		// had a given value
		let counts = [
			new Array(256).fill(0),
			new Array(256).fill(0),
			new Array(256).fill(0),
		];

		// The bytes are arranged as follows: RGBARGBARGBA
		// so to get to the next pixel we add +4 to our index
		for(let idx = 0; idx < image_bytes.length; idx += 4) {
			// pixel color:
			// r = image_bytes[idx], g = image_bytes[idx+1], b = image_bytes[idx+2], a = image_bytes[idx+3]
			counts[0][image_bytes[idx]] += 1;
			counts[1][image_bytes[idx+1]] += 1;
			counts[2][image_bytes[idx+2]] += 1;
		}

		return counts;
	}

	
	constructor(figure_element_id) {
		this.figure_element_id = figure_element_id;
		this.svg = d3.select('#' + figure_element_id + ' svg');
		console.log(this.svg);

		this.initImage();

		this.plot_area = this.svg.append('g')
			.attr('x', 0)
			.attr('y', 0);
		
		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		console.log('viewBox', svg_viewbox);

		// Scales
		let height = +this.svg.attr("height");
		let width = +this.svg.attr("width");

		let x = d3.scaleLinear().domain([0, 256]).range([0, width]);
		let y = d3.scaleLinear().range([height, 0]);

		let xAxis = d3.axisBottom(x);
		let yAxis = d3.axisLeft(y);

		console.log(height);
		console.log(width);

		// Curve generator
		this.svg.append("g").attr("class", "axis axis--x")
			.attr("transform", "translate(0," +(height-20) + ")")
			.call(xAxis);
		
		this.svg.append("g").attr("class", "axis axis--y")
			.attr("transform", "translate(" + 10 + ",0)")
			.call(yAxis);

		// Data and curves
		var valueline = d3.line()
    		.x(function(i, d) { return i })
    		.y(function(i, d) { return d; });

		
		this.svg.append("path").attr("id", "red").attr("class", "line");

		// Brush
		let b = d3.brush().on("end", () => {
			console.log("in");
			let s = d3.event.selection;
			console.log(s);
			let a = this.getImageHistogramOfArea(s[0][0], s[0][1], s[1][0] - s[0][0], s[1][1] - s[0][1]);
			let red = d3.select("#red");
			if ((typeof a !== "undefined") && (a !== null)) {
				console.log(a[0]);
				red.datum(a[0]).attr("d", valueline);
			};

		}
		);
		this.svg.append("g").attr("class", "brush").call(b);
		//this.svg.append("figure").attr("class", "overlay").call(b);

		// Brush visual representation

	}
}

whenDocumentLoaded(() => {
	plot_object = new ImageHistogram('fig-histogram');
	// plot object is global, you can inspect it in the dev-console
});
