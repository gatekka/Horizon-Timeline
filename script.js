var line = document.getElementById("line");
var defaultcolor = line.style.background;
var placepoint = document.getElementById("placepoint");


function getPosition(event) {
    var x = event.pageX; //event.clientX
    var y = event.pageY; //event.clientY
    var positionText= "X: " + x + ", Y: " + y;
    document.getElementById("result").innerText = positionText;
    placepoint.style.left = x + "px";
}

line.addEventListener('mousemove', getPosition);

line.onmouseover = function placePoint() {
    line.style.background = "#8fD362";
    placepoint.style.opacity = "100%";
}
line.onmouseleave = function click() {
    line.style.background = defaultcolor;
    placepoint.style.opacity = "0%";
}