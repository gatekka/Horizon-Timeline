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
const dataConnectionLine = document.getElementById("dataConnectionLine");
const hoverPointInnerCircle = document.getElementById("hoverPointInnerCircle");
const flex_horizontal_points = document.getElementById("flex_horizontal_points");
const placedPointDisplay = document.getElementById("placedPointDisplay");
const pointTitle = document.getElementById("pointTitle");
const pointDate = document.getElementById("pointDate");
const landingPage = document.getElementById("landingPage");
const landingCircle = document.getElementById("landingCircle");

const dataStore = JSON.parse(localStorage.getItem('dataLocalStorage')) || []; // imports from local storage, otherwise creates empty array

if (dataStore.length > 0) {
    console.log('dataStore has more than 0')
    line_container.classList.remove('isHidden')
    landingPage.classList.add('isHidden')
}

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
window.addEventListener('resize', initializePointData)
initializePointData();
function initializePointData() { // Temporarily exposes point_data to store offsetWidth
    console.log('Initialized point_data');
    saveTransitionBehavior = point_data.style.transitionBehavior;
    point_data.style.transitionBehavior = 'initial'
    point_data.classList.remove('isHidden');
    point_dataMaxAllowablePosition = line.offsetWidth + line.offsetLeft - point_data.offsetWidth;
    point_data.classList.add('isHidden');
}

landingCircle.onclick = function enterHorizon() {
    landingPage.classList.add('isHidden');
    line_container.classList.remove('isHidden');
    initializePointData();
}

 clickedOnLine = false;
line.onclick = function showPointData() {
    clickedOnLine = true;
    point_data.style.transitionBehavior = saveTransitionBehavior;
    if (mousex < point_dataMaxAllowablePosition) {
        point_data.style.left = mousex + "px";
    } else {
        point_data.style.left = point_dataMaxAllowablePosition + "px";
    }
    point_data.classList.remove('isHidden');
    dataConnectionLine.classList.remove('isHidden');
    hoverPoint.classList.add('hoverPoint-onClick');
    hoverPoint.style.left = mousex + 'px';
    title_data.focus(); // auto focuses to title input field
    console.log("Clicked on timeline."); // Log to console
}

function placePointOnLine() {
    pointTitle.innerText = title_data.value;
    pointDate.innerText = description_data.value;

    placedPointDisplay.classList.remove('isHidden');
    hoverPoint.classList.remove('hoverPoint-onClick')
    hoverPoint.classList.remove('isHidden');
    hoverPoint.classList.add('hoverPoint-onPlace');
    flex_horizontal_points.appendChild(hoverPoint.cloneNode(true));
    placedPointDisplay.classList.add('isHidden');
    hoverPoint.classList.add('isHidden');
    hoverPoint.classList.remove('hoverPoint-onPlace');
}

document.addEventListener('click', function unfocusElement(event) {  
    if (!line.contains(event.target) && !point_data.contains(event.target)) {
        inactiveStylingActivate();
        console.log('Point unfocused!'); // Log to console
    }
});

const defaultcolor = line.style.background;
line.onmouseover = function displayPoint() {
    hoverPoint.classList.remove('isHidden');
}

/* document.addEventListener('mousemove', function onMouseLeave(event) {
    if(clickedOnLine == false && !line.contains(event.target) && !hoverPoint.contains(event.target)) {
        hoverPoint.classList.add('isHidden');
        console.log('uhh');
    }
}) */
line.onmouseleave = function onMouseLeave(event) {
    if(clickedOnLine == false) {
        hoverPoint.classList.add('isHidden');
    }
}

function cancelData() {
    inactiveStylingActivate();
}

window.addEventListener('resize', inactiveStylingActivate)
function inactiveStylingActivate() {
    point_data.classList.add('isHidden');
    dataConnectionLine.classList.add('isHidden');
    hoverPoint.classList.remove('hoverPoint-onClick');
    hoverPoint.classList.add('isHidden');

    clickedOnLine = false;

    // Clearing input boxes
    title_data.value = ""; 
    description_data.value = "";
}

function SubmitData() {
    let objPointData = {}
    objPointData.id = dataStore.length;
    objPointData.title = title_data.value;
    objPointData.description = description_data.value;
    dataStore.push(objPointData); // stores into array
    localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore)); // serializes the array and stores in local storage
    
    placePointOnLine();
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
