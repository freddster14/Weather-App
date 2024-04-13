let data;
let timeElement = '00:00';
let units = 'kph-c';

window.onload = (e => {
    document.querySelector('.loading-icon').classList.toggle('toggle')
    getData('new york')
});

document.getElementById('submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    getData(document.getElementById('search').value);
    loading();
});

document.getElementById('unit-change').addEventListener('click', e => {
    e.preventDefault();
    units == 'mph-f' ? units = 'kph-c' : units = 'mph-f'
    setUnits(data)
});


async function getData(location){
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=d884941f7f8e4303bfe14000241903&q=${location}&days=3&aqi=no&alerts=no`)
        data =  await response.json()
        logData(data)
        loading()
        console.log(data)
        return data
    } catch (error) {
        loading();
        // if(error == TypeError)
        return console.log(error.name)
        
    }
}


function loading(){
    document.querySelector('.info-container').classList.toggle('toggle');
    document.querySelector('.loading-icon').classList.toggle('toggle')
}

function logData(data){ 
    currentData(data)
    setUnits(data)
}

function currentData(data){ 
    setInterval(() =>  document.getElementById('current-time').textContent = new Date().toLocaleString("en-US", {month: 'long', day: 'numeric', hour12: 'false'}), 1000)
    document.getElementById('location').textContent = data.location.name
    document.getElementById('current-time').textContent = undefined
    document.getElementById('condition').textContent = data.current.condition.text
    document.getElementById('condition-icon').src = data.current.condition.icon
}

function hourForecast(data) {
    let i = 0;
    let day = 0;
    document.querySelectorAll('.time-forecast').forEach((timeDiv) => {
        if(i == 24) {day = 1; i = 0}

        timeElement = new Date(`${data.forecast.forecastday[day]}, ${data.forecast.forecastday[day].hour[i++].time}`);
        for(i; new Date() > timeElement; i++){
            timeElement = new Date(`${data.forecast.forecastday[day]}, ${data.forecast.forecastday[day].hour[i].time}`);
        };
        hourDataForecast(data, timeDiv, i);
        if(units == 'mph-f') {
            timeElement = timeElement.toLocaleTimeString()
            timeElement = timeElement.replace('00:', '');
            return timeDiv.textContent = timeElement
        } else {timeDiv.textContent = formatTime(timeElement);}
});
};

function setUnits(data){
    if(units == 'mph-f'){
        document.getElementById('temperature').textContent = Math.round(data.current.temp_f)
        document.getElementById('wind').textContent = Math.round(data.current.wind_mph)
        document.getElementById('wind-unit').textContent = 'MPH'
        document.getElementById('temp-icon').src = 'img/fahrenheit.png'
        hourForecast(data);
        dayForecast(data)
    }else {
        document.getElementById('temperature').textContent = Math.round(data.current.temp_c)
        document.getElementById('wind').textContent = Math.round(data.current.wind_kph)
        document.getElementById('wind-unit').textContent = 'KPH'
        document.getElementById('temp-icon').src = 'img/celsius.png'
        hourForecast(data);
        dayForecast(data)
    }
}

function formatTime(date){
    hour = (date.getHours()<10?'0':'') + date.getHours();
    minutes = (date.getMinutes()<10?'0':'') + date.getMinutes();
    return hour + ':' + minutes
}

function hourDataForecast(data, timeDiv, i){
    let day = 0;
    if(i == 24) {day = 1; i = 0}
    nextElement = timeDiv.nextElementSibling;
    
    nextElement.src = data.forecast.forecastday[day].hour[i].condition.icon;
    nextElement = nextElement.nextElementSibling;
    nextElement = nextElement.firstElementChild;
    (units !== 'mph-f') ? nextElement.textContent = Math.round(data.forecast.forecastday[day].hour[i].temp_c) 
    :nextElement.textContent = Math.round(data.forecast.forecastday[day].hour[i].temp_f)
}

function dayForecast(data) {
    let i = 0;
    const showDate = {weekday:'short', month: 'long', day:'numeric'}
    document.querySelectorAll('.day-forecast').forEach(dayDiv => {
        dayDiv.textContent = new Date(data.forecast.forecastday[i].date.replace(/-/g, '\/')).toLocaleDateString("en-US", showDate)
        dayDiv = dayDiv.nextElementSibling
        dayDiv.src = data.forecast.forecastday[i].day.condition.icon;
        dayDiv = dayDiv.nextElementSibling.children[0].children[1];
        (units !== 'mph-f') ?dayDiv.textContent = Math.round(data.forecast.forecastday[i].day.mintemp_c)
        :dayDiv.textContent = Math.round(data.forecast.forecastday[i].day.mintemp_f);
        dayDiv = dayDiv.parentElement.nextElementSibling.children[1];
        (units !== 'mph-f') ?dayDiv.textContent = Math.round(data.forecast.forecastday[i].day.maxtemp_c)
        :dayDiv.textContent = Math.round(data.forecast.forecastday[i].day.maxtemp_f);
        i++
    })
}
