// Api Keys
const apiKey = '79dd632cb283ac528ac230f97674643d';
const apiNinjaKey = 'BsvsUjQWtu/gDc8Y+s4WIQ==H8sc2fwxjy928cWN';
//Select Elements from the HTML
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');
const factElement = document.querySelector('.fact p');

// App data
const weather = {};

weather.temperature = {
	unit: 'celsius',
};

const KELVIN = 273;

if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(setPosition, showErorr);
} else {
	notificationElement.style.display = 'block';
	notificationElement.innerHTML = '<p> Your browser does not support this application :( </p>';
}

function setPosition(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;

	getWeather(latitude, longitude);
}

function showErorr(error) {
	notificationElement.style.display = 'block';
	notificationElement.innerHTML = `<p> ${error.message}, please Enable Location Services in order to use the app</p>`;
}

function getWeather(latitude, longitude) {
	let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
	fetch(api)
		.then(function (response) {
			let data = response.json();
			return data;
		})
		.then(function (data) {
			weather.temperature.value = Math.floor(data.main.temp - KELVIN);
			weather.description = data.weather[0].description;
			weather.iconId = data.weather[0].icon;
			weather.city = data.name;
			weather.country = data.sys.country;
			console.log(data);
		})
		.then(function () {
			displayWeather();
		});
}

// DISPLAY WEATHER TO UI
function displayWeather() {
	iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="" />`;

	tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
	descElement.innerHTML = weather.description;
	locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion Based on Google CALC
function celsiusToFahrenheit(temperature) {
	return (temperature * 9) / 5 + 32;
}

// ACTION: WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener('click', function () {
	if (weather.temperature.value === undefined) return;

	if (weather.temperature.unit == 'celsius') {
		let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
		fahrenheit = Math.floor(fahrenheit);

		tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
		weather.temperature.unit = 'fahrenheit';
	} else {
		tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
		weather.temperature.unit = 'celsius';
	}
});

getFact();
//send random fact
function getFact() {
	$.ajax({
		method: 'GET',
		url: 'https://api.api-ninjas.com/v1/facts?limit=' + 1,
		headers: { 'X-Api-Key': 'BsvsUjQWtu/gDc8Y+s4WIQ==H8sc2fwxjy928cWN' },
		contentType: 'application/json',
		success: function (result) {
			factElement.innerHTML = `${result[0].fact} 😲`;
		},
		error: function ajaxError(jqXHR) {
			console.error('Error: ', jqXHR.responseText);
		},
	});
}

document.getElementById('newFact').addEventListener('click', getFact);
