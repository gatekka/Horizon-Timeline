//TODO: Look into replacing arrays with object constructors? Might be more efficient.
const line = document.getElementById("line");
const hoverPoint = document.getElementById("hoverPoint");
const pointSubmissionContainer = document.getElementById("pointSubmissionContainer");
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
const pointDescription = document.getElementById("pointDescription");
const landingPage = document.getElementById("landingPage");
const landingCircle = document.getElementById("landingCircle");
const backgroundImage = document.getElementById("backgroundImage");

let isKeyboardPlottingActive = false;
let isEditingPoint = false;

const dataStore = JSON.parse(localStorage.getItem('dataLocalStorage')) || []; // imports from local storage, otherwise creates empty array

description_data.addEventListener('input', e => parseTextToDate(e.target.value));
const dateOutputText = document.getElementById('dateOutputText');
const dateOutputTimecode = document.getElementById('dateOutputTimecode');
function parseTextToDate(input) {
    let dateString = input.trim();
    const currentYear = new Date().getFullYear();
    if (/[A-Za-z]+$/.test(dateString)) {
        dateString = `${dateString} 1, ${currentYear}`;
    } else if (/[A-Za-z]+\s\b([1-9]|1[0-9]|2[0-9]|3[0-1])\b$/.test(dateString)) {
        dateString = `${dateString}, ${currentYear}`;
    }
    const convertToDate = new Date(dateString);
    dateOutputText.innerHTML = convertToDate;
    dateOutputTimecode.innerHTML = Date.parse(convertToDate);
    return Date.parse(convertToDate);
}

let idCount = 1;
renderPointsFromLocalStorage();
function renderPointsFromLocalStorage() {
    dataStore.forEach(element => {
        placePointOnLine(element.title, element.description)
        idCount++;
    });
}

//TODO: When clicking on timeline between 2 points, make it so that its somehow quicker to select date?
//TODO: Sort points ordered by date
submit_button.onclick = submitData;
function submitData() {
    if (titleInput.value === '' && description_data.value === '') {
        inactiveStylingActivate();
    } else if (isEditingPoint) { 
        const point = document.getElementById(`point${getCurrentDataStoreID + 1}`);
        const pointTitle = point.querySelector('.placedPointDisplay .pointTitle');
        const pointDescription = point.querySelector('.placedPointDisplay .pointDescription');
        pointTitle.innerText = titleInput.value;
        pointDescription.innerText = description_data.value;
        dataStore[getCurrentDataStoreID].title = titleInput.value;
        dataStore[getCurrentDataStoreID].description = description_data.value;
        dataStore[getCurrentDataStoreID].timecode = parseTextToDate(description_data.value);
        localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore));
        inactiveStylingActivate();
        console.log(`Confirmed edit for: ${JSON.stringify(dataStore[getCurrentDataStoreID])}`);
    } else {
        let objPointData = {
            id: dataStore.length + 1,
            title: titleInput.value,
            description: description_data.value,
            timecode: parseTextToDate(description_data.value)
        }
        dataStore.push(objPointData); // stores object into array
        localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore)); // serializes the array and stores in local storage
        placePointOnLine(objPointData.title, objPointData.description);
        inactiveStylingActivate();
        console.log('Point data stored: ' + JSON.stringify(objPointData)); // for logging purposes
    }
    idCount++;
}

let mousex;
let mousey;
document.addEventListener('mousemove', function getMousePosition(event) {
    mousex = event.pageX;
    mousey = event.pageY;
    const positionText= "X: " + mousex + ", Y: " + mousey;
    mouseXYposition.innerText = positionText;
    if (clickedOnLine === false) {
        hoverPoint.style.left = mousex + "px"; // move point with mouse
    }
});

let saveTransitionBehavior;
let point_dataMaxAllowablePosition
calculatePointDataMaxAllowablePosition();
window.addEventListener('resize', calculatePointDataMaxAllowablePosition)
function calculatePointDataMaxAllowablePosition() { // Temporarily exposes pointSubmissionContainer to store offsetWidth
    console.log('Initialized pointSubmissionContainer');
    saveTransitionBehavior = pointSubmissionContainer.style.transitionBehavior;
    pointSubmissionContainer.style.transitionBehavior = 'initial'
    pointSubmissionContainer.classList.remove('isHidden');
    point_dataMaxAllowablePosition = line.offsetWidth + line.offsetLeft - pointSubmissionContainer.offsetWidth;
    pointSubmissionContainer.classList.add('isHidden');
}

landingCircle.onclick = enterHorizon;
function enterHorizon() {
    console.log('Executed enterHorizon()');
    landingPage.classList.add('isHidden');
    lineContainer.classList.remove('isHidden');
    backgroundImage.classList.add('backgroundImage-postEffects');
    calculatePointDataMaxAllowablePosition();
}

function positionPointData() {
    pointSubmissionContainer.style.transitionBehavior = saveTransitionBehavior;
    if (mousex < point_dataMaxAllowablePosition) {
        pointSubmissionContainer.style.left = mousex + "px";
    } else {
        pointSubmissionContainer.style.left = point_dataMaxAllowablePosition + "px";
    }
}

clickedOnLine = false;
line.addEventListener('click', showSubmissionContainer)
function showSubmissionContainer() {
    unfocusedPoint = false;
    if (isEditingPoint) {
        titleInput.value = dataStore[getCurrentDataStoreID].title;
        description_data.value = dataStore[getCurrentDataStoreID].description;
        positionPointData();
    } else if (!isKeyboardPlottingActive) {
        clickedOnLine = true;
        clearInputs();
        positionPointData();
        dataConnectionLine.classList.remove('isHidden');
        hoverPoint.classList.add('hoverPoint-onClick');
        hoverPoint.style.left = mousex + 'px';
        console.log("Clicked on timeline."); // Log to console
    } else {
        pointSubmissionContainer.style.left = 'auto';
        console.log("Displaying pointData."); // Log to console
        isKeyboardPlottingActive = false;
    }
    pointSubmissionContainer.classList.remove('isHidden');
    setTimeout(() => {titleInput.focus()}, 1); // auto focuses to input field after 1 ms
}

let getCurrentDataStoreID;
function editPoint(elementID) {
    inactiveStylingActivate();
    isEditingPoint = true;
    getCurrentDataStoreID = elementID.substring(5) - 1;
    // const pointToEdit = document.getElementById(elementID);
    // pointToEdit.style.background = 'red';
    showSubmissionContainer();
    console.log(`Now editing: '${JSON.stringify(dataStore[getCurrentDataStoreID])}'`);
}

function placePointOnLine(title, description) {
    pointTitle.innerText = title;
    pointDescription.innerText = description;

    const clonedPoint = hoverPoint.cloneNode(true);
    clonedPoint.id = `point${idCount}`;
    clonedPoint.classList.remove('hoverPoint-onClick');
    clonedPoint.classList.remove('isHidden');
    clonedPoint.classList.add('hoverPoint-onPlace');
    clonedPoint.querySelector('.placedPointDisplay').classList.remove('isHidden');
    clonedPoint.querySelector('.dataConnectionLine').classList.remove('isHidden');
    clonedPoint.addEventListener('click', e => {
        if (e.target === clonedPoint || e.target.closest('.placedPointDisplay') || e.target.closest('.dataConnectionLine')) {
            console.log(`Clicked '${clonedPoint.id}'`);
            editPoint(clonedPoint.id);
        }
    });    
    flex_horizontal_points.appendChild(clonedPoint);
}
    

let unfocusedPoint = true;
document.addEventListener('click', function unfocusElement(event) {  
    if (unfocusedPoint === false && !line.contains(event.target) && !pointSubmissionContainer.contains(event.target) && !flex_horizontal_points.contains(event.target)) {
        inactiveStylingActivate();
        unfocusedPoint = true;
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

let isResizingWindow = false;
window.addEventListener('resize', () => {
    isResizingWindow = true;
    inactiveStylingActivate();
})

function clearInputs() {
    titleInput.value = ""; 
    description_data.value = "";
}

// let isPointNotActive = false;
function inactiveStylingActivate() {
    // isPointNotActive = true;
    hideElement(pointSubmissionContainer);
    hideElement(hoverPoint);
    pointSubmissionContainer.classList.add('isHidden');
    hoverPoint.classList.remove('hoverPoint-onClick');
    hoverPoint.classList.add('isHidden');
    dataConnectionLine.classList.add('isHidden');
    dataConnectionLine.style.animation = null;

    clickedOnLine = false;
    isEditingPoint = false;
    isKeyboardPlottingActive = false;
    isResizingWindow = false;
    clearInputs();
}

function hideElement(element) {
    if (isResizingWindow === false) {
        const clonedElement = element.cloneNode(true)
        element.parentNode.appendChild(clonedElement);
        clonedElement.id = 'temporaryFadeOutElement';
        clonedElement.classList.add('fadeOut');
        clonedElement.addEventListener('animationend', () => {
            clonedElement.classList.remove('fadeOut');
            clonedElement.classList.add('isHidden');
            clonedElement.remove();
            document.querySelectorAll('#temporaryFadeOutElement').forEach(element => element.remove());
            // isPointNotActive = false;
        });
    }
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
            // console.log(`"${event.key}" has been pressed.`)
            break;
    }
}

//TODO: Implement case that toggles delete mode? Or maybe only when holding down key is better.
window.addEventListener('keydown', (event) => {
    if (!(getComputedStyle(pointSubmissionContainer).display == 'flex')) {
        switch (event.key) {
            case 'Tab':
                console.log(`Pressed ${event.key}.`);
                isKeyboardPlottingActive = true;
                showSubmissionContainer();
                break;
            case '?':
                //TODO: Open settings context menu
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