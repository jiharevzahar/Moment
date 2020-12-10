document.addEventListener('DOMContentLoaded', () => {
    go();
    getQuote();
    loadName();
    checkAndLoadTask();
    setCurrentDate();
    getWeather();
});

function go() {
    window.timerId = window.setInterval(timer, 500);
}
function timer() {
    var clock = document.querySelector('.content__clock');
    var date = new Date();
    checkTimeOfDayBackground(date);
    checkTimeOfDayGreeting(date);

    clock.innerHTML = addZero(date.getHours()) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
}
function addZero(num) {
    if (num <= 9) return '0' + num;
    else return num;
}

const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');

// если в ссылке заменить lang=en на lang=ru, цитаты будут на русском языке
// префикс https://cors-anywhere.herokuapp.com используем для доступа к данным с других сайтов если браузер возвращает ошибку Cross-Origin Request Blocked 
async function getQuote() {
    const url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
    const res = await fetch(url);
    const data = await res.json();
    blockquote.textContent = data.quoteText;
    figcaption.textContent = data.quoteAuthor;
}
let footerButton = document.querySelector('.footer__button')
footerButton.addEventListener('click', getQuote);


let greetingInput = document.querySelector('.greeting__personName');
greetingInput.addEventListener('blur', function () {
    if (this.value != '') {
        window.localStorage.setItem('name', this.value);
    }
});

function loadName() {
    greetingInput.value = window.localStorage.getItem('name');
}

function setCurrentDate() {
    let contentDate = document.querySelector('.content_date');
    let currentDate = new Date();
    contentDate.innerHTML = new Intl.DateTimeFormat('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }).format(currentDate);
}

function checkTimeOfDayBackground(date) {
    let mainBlock = document.querySelector('.main');
    let currentDayInMonth = date.getDate();

    currentDayInMonth = ('0' + currentDayInMonth).slice(-2);

    if (date.getHours() >= 6 && date.getHours() <= 12) {
        mainBlock.style.backgroundImage = `("../assets/images/morning/${currentDayInMonth}.jpg");`
    }
    else if (date.getHours() >= 12 && date.getHours() <= 18) {
        mainBlock.style.backgroundImage = `url("../assets/images/day/${currentDayInMonth}.jpg")`;
    }
    else if (date.getHours() >= 18 && date.getHours() <= 23) {
        mainBlock.style.backgroundImage = `url("../assets/images/evening/${currentDayInMonth}.jpg")`;
    }
    else if (date.getHours() >= 0 && date.getHours() <= 6) {
        mainBlock.style.backgroundImage = `url("../assets/images/night/${currentDayInMonth}.jpg")`;
    }
}

function checkTimeOfDayGreeting(date) {
    let greetingBlock = document.querySelector('.greeting__dayOfTime');
    let currentDayInMonth = date.getDate();

    if (date.getHours() >= 6 && date.getHours() <= 12) {
        greetingBlock.innerHTML = 'Good morning, ';
    }
    else if (date.getHours() >= 12 && date.getHours() <= 18) {
        greetingBlock.innerHTML = 'Good day, ';
    }
    else if (date.getHours() >= 18 && date.getHours() <= 0) {
        greetingBlock.innerHTML = 'Good evening, ';
    }
    else if (date.getHours() >= 0 && date.getHours() <= 6) {
        greetingBlock.innerHTML = 'Good night, ';
    }
}

let contentToday = document.querySelector(".content__today");
let contentTask = document.querySelector(".content__task");
let blockText = document.querySelector(".block__text");

function checkAndLoadTask() {
    let taskValue = window.localStorage.getItem('task');
    if (taskValue == null || taskValue == '') {
        return;
    } else {
        blockText.innerHTML = taskValue;
        contentToday.style.display = 'none';
        contentTask.style.display = 'flex';
    }
    // if ()
}

let todayInput = document.querySelector(".today__input");

todayInput.addEventListener('keydown', function () {
    if (event.keyCode === 13) {
        if (this.value != '') {



            blockText.innerHTML = this.value;

            window.localStorage.setItem('task', this.value);

            contentToday.style.display = 'none';
            contentTask.style.display = 'flex';
        }
    }
});

let taskCheckbox = document.querySelector(".task_checkbox");
let tick = document.querySelector('.tick');
// let blockText = document.querySelector('.block__text');
let checkBoxValue = false;

taskCheckbox.addEventListener('click', function () {

    if (checkBoxValue == false) {
        blockText.style.textDecoration = 'line-through';
        tick.style.opacity = 1;
    } else {
        blockText.style.textDecoration = 'none';
        tick.style.opacity = 0;
    }
    checkBoxValue = !checkBoxValue;
})

let cross = document.querySelector('#cross');
cross.addEventListener('click', function () {


    window.localStorage.removeItem('task');
    contentToday.style.display = 'flex';
    contentTask.style.display = 'none';
    blockText.style.textDecoration = 'none';
    todayInput.value = '';
    tick.style.opacity = 0;

});


const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const windSpeed = document.querySelector('.windSpeed');
const humidity = document.querySelector('.humidity');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');

async function getWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=ru&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
        windSpeed.textContent = `${data.wind.speed}m/s`;
        humidity.textContent = `${data.main.humidity}%`;
        weatherDescription.textContent = data.weather[0].description;
        console.log(data);
    } catch (e) {
        alert('City name is incorrect')
    }
}

function setCity(event) {
    if (event.code === 'Enter') {
        getWeather();
        city.blur();
    }
}

city.addEventListener('keypress', setCity);