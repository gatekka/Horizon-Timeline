var line = document.getElementById("line");
var defaultcolor = line.style.background;
var placepoint = document.getElementById("placepoint");
var point_data = document.getElementById("point_data");
var line_container = document.getElementById("line_container");
var submit_button = document.getElementById("submit_button");
var title_data = document.getElementById("title_data");
var description_data = document.getElementById("description_data");

document.addEventListener('mousemove', getPosition);

var mousex;
var mousey;

function getPosition(event) {
    mousex = event.pageX;
    mousey = event.pageY;
    var positionText= "X: " + mousex + ", Y: " + mousey;
    document.getElementById("result").innerText = positionText;
    placepoint.style.left = mousex + "px"; // move point with mouse
}

line.onmouseover = function displayPoint() {
    line.style.background = "#8fD362";
    placepoint.style.opacity = "100%";
}

line.onclick = function placePoint() {
    point_data.style.opacity = "100%";
    point_data.style.left = mousex + "px";
    console.log("clicked horizon");
}

line.onmouseleave = function onMouseLeave() {
    line.style.background = defaultcolor;
    placepoint.style.opacity = "0%";
}

var dataStore = JSON.parse(localStorage.getItem('dataLocalStorage')) || []; // imports from local storage, otherwise creates empty array
var uniqueid = 1;
submit_button.onclick = function SubmitData() {
    var obj = {
        id: uniqueid,
        title: title_data.value,
        description: description_data.value
    }
    dataStore.push(obj); // stores into array
    uniqueid++;
    point_data.style.opacity = "0%";
    localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore)); // serializes the array and stores in local storage
    console.log(JSON.stringify(dataStore)); // for logging purposes
    // console.log(dataStore); // for logging purposes
}