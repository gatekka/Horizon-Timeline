// TODO: Display all data points on horizon line.
// TODO: Look into replacing arrays with object constructors? Might be more efficient.
const line = document.getElementById("line");
const hoverPoint = document.getElementById("hoverPoint");
const point_data = document.getElementById("point_data");
const lineContainer = document.getElementById("lineContainer");
const submit_button = document.getElementById("submit_button");
const titleInput = document.getElementById("titleInput");
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
const backgroundImage = document.getElementById("backgroundImage");

let isKeyboardPlottingActive = false;

const dataStore = JSON.parse(localStorage.getItem('dataLocalStorage')) || []; // imports from local storage, otherwise creates empty array

renderPointsFromLocalStorage();
function renderPointsFromLocalStorage() {
    dataStore.forEach(element => {
        placePointOnLine(element.title, element.description)
    });
}

submit_button.onclick = submitData;
function submitData() {
    let objPointData = {}
    objPointData.id = dataStore.length;
    objPointData.title = titleInput.value;
    objPointData.description = description_data.value;
    dataStore.push(objPointData); // stores into array
    localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore)); // serializes the array and stores in local storage
    
    placePointOnLine(objPointData.title, objPointData.description);
    inactiveStylingActivate();
    
    // console.log(localStorage); // for logging purposes
    // console.log(JSON.stringify(dataStore)); // for logging purposes
    console.log('Point data stored: ' + JSON.stringify(objPointData)); // for logging purposes
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

landingCircle.onclick = enterHorizon;
function enterHorizon() {
    console.log('Executed enterHorizon()');
    landingPage.classList.add('isHidden');
    lineContainer.classList.remove('isHidden');
    backgroundImage.classList.add('backgroundImage-postEffects');
    initializePointData();
}

clickedOnLine = false;
line.onclick = showPointData;
function showPointData() {
    if (!isKeyboardPlottingActive) {
        clickedOnLine = true;
        point_data.style.transitionBehavior = saveTransitionBehavior;
        if (mousex < point_dataMaxAllowablePosition) {
            point_data.style.left = mousex + "px";
        } else {
            point_data.style.left = point_dataMaxAllowablePosition + "px";
        }
        dataConnectionLine.classList.remove('isHidden');
        hoverPoint.classList.add('hoverPoint-onClick');
        hoverPoint.style.left = mousex + 'px';
        console.log("Clicked on timeline."); // Log to console
    } else {
        point_data.style.left = 'auto';
        console.log("Displaying pointData."); // Log to console
    }
    point_data.classList.remove('isHidden');
    setTimeout(() => {titleInput.focus()}, 1); // auto focuses to input field after 1 ms
}

function placePointOnLine(title, description) {
    pointTitle.innerText = title;
    pointDate.innerText = description;

    dataConnectionLine.classList.remove('isHidden');
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

line.onmouseover = function displayPoint() {
    hoverPoint.classList.remove('isHidden');
}

line.onmouseleave = function onMouseLeave(event) {
    if(clickedOnLine == false) {
        hoverPoint.classList.add('isHidden');
    }
}

window.addEventListener('resize', inactiveStylingActivate)
function inactiveStylingActivate() {
    point_data.classList.add('isHidden');
    dataConnectionLine.classList.add('isHidden');
    hoverPoint.classList.remove('hoverPoint-onClick');
    hoverPoint.classList.add('isHidden');

    clickedOnLine = false;
    isKeyboardPlottingActive = false;

    // Clearing input boxes
    titleInput.value = ""; 
    description_data.value = "";
}

titleInput.addEventListener('keydown', handleInputBoxesSubmit)
description_data.addEventListener('keydown', handleInputBoxesSubmit)
function handleInputBoxesSubmit(event) {
    switch (event.key) {
        case 'Enter':
            console.log("Pressed Enter"); // for logging purposes
            submitData();
            break;
        case 'Escape':
            inactiveStylingActivate();
        default:
            console.log(`"${event.key}" has been pressed.`)
            break;
    }
}

window.addEventListener('keydown', (event) => {
    if (!(getComputedStyle(point_data).display == 'flex')) {
        switch (event.key) {
            case 'Tab':
                console.log(`Pressed ${event.key}.`);
                isKeyboardPlottingActive = true;
                showPointData();
                break;
            case '?':
                // TODO: Open settings context menu
                console.log('TODO: Open settings context menu');
                break;
            default:
                break;
        }
    }
})

mouseXYposition.onclick = () => {
    alert(JSON.stringify(dataStore))
    localStorage.clear();
    location.reload();
}

if (dataStore.length > 0) {
    console.log('\'dataStore\' contains data. Entering Horizon.');
    enterHorizon();
}