// TODO: Display all data points on horizon line.
// TODO: Look into replacing arrays with object constructors? Might be more efficient.
const line = document.getElementById("line");
const hoverPoint = document.getElementById("hoverPoint");
const point_data = document.getElementById("point_data");
const line_container = document.getElementById("line_container");
const submit_button = document.getElementById("submit_button");
const title_data = document.getElementById("title_data");
const description_data = document.getElementById("description_data");
const mouseXYposition = document.getElementById("mouseXYposition");
const placedPoint = document.getElementById("placedPoint");

let mousex;
let mousey;
document.addEventListener('mousemove', function getMousePosition(event) {
    mousex = event.pageX;
    mousey = event.pageY;
    const positionText= "X: " + mousex + ", Y: " + mousey;
    mouseXYposition.innerText = positionText;
    if (clickedOnLine == false) {
        hoverPoint.style.left = mousex + "px"; // move point with mouse
    }
});

let saveTransitionBehavior;
let point_dataMaxAllowablePosition
initializePointData();
function initializePointData() { // Temporarily exposes point_data to store offsetWidth
    console.log('Initialized point_data');
    saveTransitionBehavior = point_data.style.transitionBehavior;
    point_data.style.transitionBehavior = 'initial'
    point_data.classList.remove('isHidden');
    point_dataMaxAllowablePosition = line.offsetWidth + line.offsetLeft - point_data.offsetWidth;
    point_data.classList.add('isHidden');
}

 clickedOnLine = false;
line.onclick = function showPointData() {
    clickedOnLine = true;
    placePointOnLine();
    point_data.style.transitionBehavior = saveTransitionBehavior;
    if (mousex < point_dataMaxAllowablePosition) {
        point_data.style.left = mousex + "px";
    } else {
        point_data.style.left = point_dataMaxAllowablePosition + "px";
    }
    point_data.classList.remove('isHidden');
    hoverPoint.classList.add('hoverPoint-active');
    hoverPoint.style.left = mousex + 'px';
    title_data.focus(); // auto focuses to title input field
    console.log("Clicked on timeline."); // Log to console
}

function placePointOnLine() {
    placedPoint.classList.remove('isHidden');
    placedPoint.style.left = mousex + 'px';
    point_data.classList.add('isHidden');
    /* placedPoint.addEventListener('mouseover', function() {
        placedPoint.style.backgroundColor = 'red';
        point_data.classList.remove('isHidden');
    }); */
    line_container.appendChild(placedPoint.cloneNode(true));
    line_container.appendChild(point_data.cloneNode(true));
}

document.addEventListener('click', function(event) {  
    if (!line.contains(event.target) && !point_data.contains(event.target)) {
        inactiveStylingActivate();
        console.log('Point unfocused!'); // Log to console
    }
});

const defaultcolor = line.style.background;
line.onmouseover = function displayPoint() {
    line.style.background = "#8fD362";
    hoverPoint.classList.remove('isHidden');
}

line.onmouseleave = function onMouseLeave() {
    if(clickedOnLine == false) {
        hoverPoint.classList.add('isHidden');
    }
    line.style.background = defaultcolor;
}

function cancelData() {
    inactiveStylingActivate();
}

function inactiveStylingActivate() {
    point_data.classList.add('isHidden');
    hoverPoint.classList.add('isHidden');
    hoverPoint.classList.remove('hoverPoint-active');

    clickedOnLine = false;

    // Clearing input boxes
    title_data.value = ""; 
    description_data.value = "";
}

const dataStore = JSON.parse(localStorage.getItem('dataLocalStorage')) || []; // imports from local storage, otherwise creates empty array
let objPointData = {}
function SubmitData() {
    objPointData.id = dataStore.length;
    objPointData.title = title_data.value;
    objPointData.description = description_data.value;
    dataStore.push(objPointData); // stores into array
    localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore)); // serializes the array and stores in local storage

    inactiveStylingActivate();

    // console.log(localStorage); // for logging purposes
    // console.log(JSON.stringify(dataStore)); // for logging purposes
    console.log('Point data stored: ' + JSON.stringify(objPointData)); // for logging purposes
}

submit_button.onclick = SubmitData;

title_data.addEventListener('keydown', function(event) {
    if(event.key == 'Enter') {
        console.log("Pressed Enter"); // for logging purposes
        SubmitData();
    }
})

description_data.addEventListener('keydown', function(event) {
    if(event.key == 'Enter') {
        console.log("Pressed Enter"); // for logging purposes
        SubmitData();
    }
})

mouseXYposition.onclick = function displayPointData() {
    alert(JSON.stringify(dataStore))
}
