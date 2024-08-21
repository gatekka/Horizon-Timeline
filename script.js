var line = document.getElementById("line");
var defaultcolor = line.style.background;
var placepoint = document.getElementById("placepoint");
var point_data = document.getElementById("point_data");
var line_container = document.getElementById("line_container");
var submit_button = document.getElementById("submit_button");

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

submit_button.onclick = function SubmitData() {
    point_data.style.opacity = "0%";
}