var line = document.getElementById("line");
var defaultcolor = line.style.background;
var placepoint = document.getElementById("placepoint");
var point_data = document.getElementById("point_data");
var line_container = document.getElementById("line_container");

document.addEventListener('mousemove', getPosition);

function getPosition(event) {
    var x = event.pageX; //event.clientX
    var y = event.pageY; //event.clientY
    var positionText= "X: " + x + ", Y: " + y;
    document.getElementById("result").innerText = positionText;
    placepoint.style.left = x + "px"; // move point with mouse
}

line.onmouseover = function displayPoint() {
    line.style.background = "#8fD362";
    placepoint.style.opacity = "100%";
}

line.onclick = function placePoint() {
    point_data.style.opacity = "100%";
    console.log("clicked horizon");
}

line.onmouseleave = function onMouseLeave() {
    line.style.background = defaultcolor;
    placepoint.style.opacity = "0%";
}