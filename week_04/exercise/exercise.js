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

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25, 16];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//const MARGIN = { top: 10, right: 10, bottom: 10, left: 10 };


class ScatterPlot {
	/* your code here */
	constructor(id, data) {
		this.svg = d3.select('#'+id);
		this.data = data;
		}

	scalerY(num){

			let sY = d3.scaleLinear().domain([0, d3.max(this.data)]).range([0, -100])(num) + 100;
			console.log(sY);
			return sY
		}

	scalerX(num) {
			let sX = d3.scaleLinear().domain([0, this.data.length-1]).range([0, 200])(num);
			console.log(sX);
			return sX;
		}

	show(){
		let axisX = this.svg.append("g")
		  	.attr('transform', "translate(0, 80)")
		  	.attr('color', 'white')
      		.call(d3.axisBottom(d3.scaleOrdinal().domain(DAYS).range([0,200/6, 200*2/6, 200*3/6,200*4/6,200*5/6,200])))

      	let axisY = this.svg.append("g")
      				.attr('transform', 'translate(0,-20)')
      				.attr('color', 'white')
      				.call(d3.axisLeft(d3.scaleLinear().domain([0, this.data.max]).range([0,100])))

		let circles = this.svg.selectAll('circles')
					   .data(this.data)
					   .enter()
					   .append('circle')
					   .attr('cx', (d, i) => {console.log(i); return this.scalerX(i)})
					   .attr('cy', (d, i) => {console.log(d); return this.scalerY(d)})
					   .attr('r', 2)
					   .attr("class", (d, i) => {
					   	if (d <= 17) return 'cold';
					   	else if (d >= 23) return 'warm';
					   	else;
					   })
					   .append('text')
					   .attr('text', (d, i) => {return DAYS[i]})
		
		let i = document.getElementById('plot')
		console.log(i)
	}
}

whenDocumentLoaded(() => {

	// prepare the data here

	//console.log(data);

	const plot = new ScatterPlot('plot', TEST_TEMPERATURES);
	plot.show()
	// console.log(TEST_TEMPERATURES)
	// let svg = d3.select('#plot')
	// let circles = svg.selectAll('circles')
	// 			.data(TEST_TEMPERATURES)
	// 			.enter()
	// 			.append('circle')
	// 			.attr('cx', (d, i) => 20*i)
	// 			.attr('cy', (d, i) => 20*i)
	// 			.attr('r', d => d*0.3)
	// 			.style('fill', 'blue')
});

