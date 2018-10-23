
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

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25,16];


function showTempteratures(container_element, temperature_array) {
	container_element.innerHTML = "";
	temperature_array.forEach(function (t) {
		let p = document.createElement("p");
		// const headingText = document.createTextNode(toString(t));
		// p.appendChild(headingText)
		p.innerHTML = t.toString();
		if (t >= 23) {
			p.style.backgroundColor = "red";
		}
		if (t <= 17) {
			p.style.backgroundColor = "blue";
		}
		container_element.appendChild(p);
		console.log(container_element)
	})
}

// Part 1 - DOM
// whenDocumentLoaded(() => {
// 	// Part 1.1: Find the button + on click event
// 	const button1 = document.getElementById("btn-part1");
// 	const part1 = document.getElementById("weather-part1");
// 	button1.onclick = () => {
// 		console.log("The button1 was clicked");
// 		showTempteratures(part1, TEST_TEMPERATURES);
// 	}
// });

// Part 2 - class

class Forecast {
	constructor(container, temperatures=[1, 2, 3, 4, 5, 6, 7]) {
		this.container = container;
		this.temperatures = temperatures;
	}

	toString(n) {
		console.log('in')
		return n.toString();
	}

	print(num) {
		console.log(this.toString(num));
	}

	show() {
		console.log(this.container);
		console.log(this.temperatures);

		this.container.innerHTML = "";
		this.temperatures.then((t1)=>{
		t1.forEach((t) => {
		console.log(t);
		let p = document.createElement("p");
		// const headingText = document.createTextNode(toString(t));
		// p.appendChild(headingText)
		p.innerHTML = this.toString(t);

		this.container.appendChild(p);
		console.log(this.container);
	})
})
	
}

	reload() {
		this.temperatures = TEST_TEMPERATURES;
		this.show();
	}
}



// whenDocumentLoaded(() => {
// 	const button1 = document.getElementById("btn-part1");
// 	const part2 = document.getElementById("weather-part2");
// 	let forcast = new Forecast(part2);
// 	button1.onclick = () => {
// 		forcast.reload();
// 	};
// });


// Part 3 - fetch

const QUERY_LAUSANNE = 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Lausanne") and u="c"';

async function yahooToTemperatures1() {
	let res = []
	await fetch(QUERY_LAUSANNE).then(text => text.json()).then(data => {data.query.results.channel.item.forecast.forEach(
			(n) => {
				res.push((parseInt(n["low"]) + parseInt(n["high"])) / 2);			
			}
		)
	}
);
	return res
}

class ForecastOnline extends Forecast {
	reload() {
		this.show();
	}
}

whenDocumentLoaded(() => {
	const button1 = document.getElementById("btn-part1");
	const part3 = document.getElementById("weather-part3");
	let temp1 = yahooToTemperatures1();
	let forcastonline = new ForecastOnline(part3, temp1);

	// console.log(l)
	button1.onclick = () => {
		forcastonline.reload();
	};
});


// Part 4 - interactive
async function yahooToTemperatures(city) {
	
	let url = QUERY_LAUSANNE.replace('Lausanne', city)
	let res = new Array()

	await fetch(url).then(text => text.json()).then(data => {
			a = data.query.results.channel.item.forecast;
			console.log(a)
			a.forEach(
			(n) => {
				res.push((parseInt(n["low"]) + parseInt(n["high"])) / 2);			
			}

		)
	}
);	
	console.log(res);
	return res
}

class ForecastOnlineCity extends Forecast {
	show() {
		console.log(this.container);
		console.log(this.temperatures);

		this.container.innerHTML = "";
		this.temperatures.then(t => {
			console.log(t);
			let p = document.createElement("p");
			// const headingText = document.createTextNode(toString(t));
			// p.appendChild(headingText)
			p.innerHTML = this.toString(t);

			this.container.appendChild(p);
		}
	)
}

	reload(temp) {
		console.log('in reload')
		this.temperatures = temp;
		this.show();
	}
}

whenDocumentLoaded(() => {
	const btn_city = document.getElementById("btn-city");
	const part4 = document.getElementById("weather-city");
	let forcastonlinecity = new ForecastOnlineCity(part4);

	// console.log(l)
	btn_city.onclick = () => {
		let cityName = document.getElementById("query-city").value;
		if (cityName == '') {
			alert('None');
		}
		let temp = yahooToTemperatures(cityName);
		// setTimeout(alert("Hello"), 2000);
		forcastonlinecity.reload(temp);
	};
});

