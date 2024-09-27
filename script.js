//TODO: Look into replacing arrays with object constructors? Might be more efficient.
const elements = {
    line: document.getElementById("line"),
    hoverPoint: document.getElementById("hoverPoint"),
    pointSubmissionContainer: document.getElementById("pointSubmissionContainer"),
    lineContainer: document.getElementById("lineContainer"),
    submit_button: document.getElementById("submit_button"),
    titleInput: document.getElementById("titleInput"),
    description_data: document.getElementById("description_data"),
    mouseXYposition: document.getElementById("mouseXYposition"),
    dataConnectionLine: document.getElementById("dataConnectionLine"),
    hoverPointInnerCircle: document.getElementById("hoverPointInnerCircle"),
    flex_horizontal_points: document.getElementById("flex_horizontal_points"),
    placedPointDisplay: document.getElementById("placedPointDisplay"),
    pointTitle: document.getElementById("pointTitle"),
    pointDescription: document.getElementById("pointDescription"),
    landingPage: document.getElementById("landingPage"),
    landingCircle: document.getElementById("landingCircle"),
    backgroundImage: document.getElementById("backgroundImage"),
    dateOutputText: document.getElementById('dateOutputText'),
    dateOutputTimecode: document.getElementById('dateOutputTimecode'),
}

let isKeyboardPlottingActive = false;
let isEditingPoint = false;
let isHotkeysEnabled = false;

const dataStore = JSON.parse(localStorage.getItem('dataLocalStorage')) || []; // imports from local storage, otherwise creates empty array
dataStore.sort((a, b) => a.timecode - b.timecode);

elements.description_data.addEventListener('input', e => parseTextToDate(e.target.value));
function parseTextToDate(input) {
    let dateString = input.trim();
    const currentYear = new Date().getFullYear();
    if (/[A-Za-z]+$/.test(dateString)) {
        dateString = `${dateString} 1, ${currentYear}`;
    } else if (/[A-Za-z]+\s\b([1-9]|1[0-9]|2[0-9]|3[0-1])\b$/.test(dateString)) {
        dateString = `${dateString}, ${currentYear}`;
    }
    const convertToDate = new Date(dateString);
    elements.dateOutputText.innerHTML = convertToDate;
    elements.dateOutputTimecode.innerHTML = Date.parse(convertToDate);
    return Date.parse(convertToDate);
}

let currentSelectedPointId;
renderPointsFromLocalStorage();
function renderPointsFromLocalStorage() {
    dataStore.forEach(element => {
        currentSelectedPointId = element.id;
        placePointOnLine(element.title, element.description)
    });
}

//TODO: When clicking on timeline between 2 points, make it so that its somehow quicker to select date?
elements.submit_button.onclick = submitData;
function submitData() {
    if (elements.titleInput.value === '' && elements.description_data.value === '') {
        inactiveStylingActivate();
        return;
    }
    
    if (isEditingPoint) { 
        updatePoint();
    } else {
        addNewPoint();
    }

    dataStore.sort((a, b) => a.timecode - b.timecode);
    renderAllPoints();
}

let editingElementId;
let getArrayToEdit = {};
function editPoint(elementID) {
    inactiveStylingActivate();
    isEditingPoint = true;
    editingElementId = parseInt(elementID.substring(5));
    getArrayToEdit = dataStore.find(element => element.id === editingElementId);
    // const pointToEdit = document.getElementById(elementID);
    // pointToEdit.style.background = 'red';
    console.log(`Now editing: ${JSON.stringify(getArrayToEdit)}`);
    showSubmissionContainer();
}

function updatePoint() {
    const point = document.getElementById(`point${editingElementId}`);
    const pointTitle = point.querySelector('.placedPointDisplay .pointTitle');
    const pointDescription = point.querySelector('.placedPointDisplay .pointDescription');
    currentSelectedPointId = editingElementId;
    pointTitle.innerText = elements.titleInput.value;
    pointDescription.innerText = elements.description_data.value;
    getArrayToEdit.title = elements.titleInput.value;
    getArrayToEdit.description = elements.description_data.value;
    getArrayToEdit.timecode = parseTextToDate(elements.description_data.value);
    localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore));
    restoreAnimations(point);
    inactiveStylingActivate();
    console.log(`Confirmed edit for: ${JSON.stringify(dataStore[editingElementId])}`);
}

function addNewPoint() {
    let objPointData = {
        id: dataStore.length + 1,
        title: elements.titleInput.value,
        description: elements.description_data.value,
        timecode: parseTextToDate(elements.description_data.value)
    }
    currentSelectedPointId = objPointData.id;
    dataStore.push(objPointData); // stores object into array
    localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore)); // serializes the array and stores in local storage
    placePointOnLine(objPointData.title, objPointData.description);
    inactiveStylingActivate();
    console.log('Point data stored: ' + JSON.stringify(objPointData)); // for logging purposes
}

function renderAllPoints() {
    dataStore.forEach(element => {
        const pointElement = document.getElementById(`point${element.id}`);
        if (element.id != currentSelectedPointId) {
            // pointElement.style.animation = 'none';
            // pointElement.querySelector('.placedPointDisplay').style.animation = 'none';
            // pointElement.querySelector('.dataConnectionLine').style.animation = 'none';
            disableAnimations(pointElement)
        }
        elements.flex_horizontal_points.appendChild(pointElement);
    });
}

function restoreAnimations(element) {
    element.offsetHeight; // Force reflow to reset animations
    element.style.animation = '';

    const children = element.querySelectorAll('.placedPointDisplay, .dataConnectionLine');
    children.forEach(child => {
        child.offsetHeight; // Force reflow to reset animations
        child.style.animation = '';
    });
}

function disableAnimations(element) {
    element.style.animation = 'none';
    const children = element.querySelectorAll('.placedPointDisplay, .dataConnectionLine');
    children.forEach(child => child.style.animation = 'none');
}

let mouseXPosition;
let mouseYPosition;
document.addEventListener('mousemove', function getMousePosition(event) {
    mouseXPosition = event.pageX;
    mouseYPosition = event.pageY;
    const positionText= "X: " + mouseXPosition + ", Y: " + mouseYPosition;
    elements.mouseXYposition.innerText = positionText;
    if (clickedOnLine === false) {
        elements.hoverPoint.style.left = mouseXPosition + "px"; // move point with mouse
    }
});

let saveTransitionBehavior;
let point_dataMaxAllowablePosition
calculatePointDataMaxAllowablePosition();
window.addEventListener('resize', calculatePointDataMaxAllowablePosition)
function calculatePointDataMaxAllowablePosition() { // Temporarily exposes pointSubmissionContainer to store offsetWidth
    console.log('Initialized pointSubmissionContainer');
    saveTransitionBehavior = elements.pointSubmissionContainer.style.transitionBehavior;
    elements.pointSubmissionContainer.style.transitionBehavior = 'initial'
    elements.pointSubmissionContainer.classList.remove('isHidden');
    point_dataMaxAllowablePosition = elements.line.offsetWidth + elements.line.offsetLeft - elements.pointSubmissionContainer.offsetWidth;
    elements.pointSubmissionContainer.classList.add('isHidden');
}

elements.landingCircle.onclick = enterHorizon;
function enterHorizon() {
    console.log('Executed enterHorizon()');
    elements.landingPage.classList.add('isHidden');
    elements.lineContainer.classList.remove('isHidden');
    document.body.classList.add('bodyTimeline');
    elements.backgroundImage.classList.add('backgroundImage-postEffects');
    calculatePointDataMaxAllowablePosition();
    setTimeout(() => {
        isKeyboardPlottingActive = true;
        showSubmissionContainer();
        isHotkeysEnabled = true;
    }, 1000);
}

function positionPointData() {
    elements.pointSubmissionContainer.style.transitionBehavior = saveTransitionBehavior;
    if (mouseXPosition < point_dataMaxAllowablePosition) {
        elements.pointSubmissionContainer.style.left = mouseXPosition + "px";
    } else {
        elements.pointSubmissionContainer.style.left = point_dataMaxAllowablePosition + "px";
    }
}

clickedOnLine = false;
elements.line.addEventListener('click', showSubmissionContainer)
function showSubmissionContainer() {
    unfocusedPoint = false;
    if (isEditingPoint) {
        elements.titleInput.value = getArrayToEdit.title;
        elements.description_data.value = getArrayToEdit.description;
        positionPointData();
    } else if (!isKeyboardPlottingActive) {
        clickedOnLine = true;
        clearInputs();
        positionPointData();
        elements.dataConnectionLine.classList.remove('isHidden');
        elements.hoverPoint.classList.add('hoverPoint-onClick');
        elements.hoverPoint.style.left = mouseXPosition + 'px';
        console.log("Clicked on timeline."); // Log to console
    } else {
        elements.pointSubmissionContainer.style.left = 'auto';
        console.log("Displaying pointData."); // Log to console
        isKeyboardPlottingActive = false;
    }
    elements.pointSubmissionContainer.classList.remove('isHidden');
    setTimeout(() => {elements.titleInput.focus()}, 1); // auto focuses to input field after 1 ms
}

function placePointOnLine(title, description) {
    elements.pointTitle.innerText = title;
    elements.pointDescription.innerText = description;

    const clonedPoint = elements.hoverPoint.cloneNode(true);
    clonedPoint.id = `point${currentSelectedPointId}`;
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
    elements.flex_horizontal_points.appendChild(clonedPoint);
}
    

let unfocusedPoint = true;
document.addEventListener('click', function unfocusElement(event) {  
    if (unfocusedPoint === false && !elements.line.contains(event.target) && !elements.pointSubmissionContainer.contains(event.target) && !elements.flex_horizontal_points.contains(event.target)) {
        inactiveStylingActivate();
        unfocusedPoint = true;
        console.log('Point unfocused!'); // Log to console
    }
});

elements.line.onmouseover = function displayPoint() {
    elements.hoverPoint.classList.remove('isHidden');
}

elements.line.onmouseleave = function onMouseLeave(event) {
    if(clickedOnLine == false) {
        elements.hoverPoint.classList.add('isHidden');
    }
}

let isResizingWindow = false;
window.addEventListener('resize', () => {
    isResizingWindow = true;
    inactiveStylingActivate();
})

function clearInputs() {
    elements.titleInput.value = ""; 
    elements.description_data.value = "";
}

function inactiveStylingActivate() {
    hideElement(elements.pointSubmissionContainer);
    hideElement(elements.hoverPoint);
    elements.pointSubmissionContainer.classList.add('isHidden');
    elements.hoverPoint.classList.remove('hoverPoint-onClick');
    elements.hoverPoint.classList.add('isHidden');
    elements.dataConnectionLine.classList.add('isHidden');
    elements.dataConnectionLine.style.animation = null;

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
        });
    }
}

[elements.titleInput, elements.description_data].forEach(element => {
    element.addEventListener('keydown', handleInputBoxesSubmit);
});

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
    if (isHotkeysEnabled && !(getComputedStyle(elements.pointSubmissionContainer).display == 'flex')) {
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

elements.mouseXYposition.onclick = () => {
    // alert(JSON.stringify(dataStore)) // for debugging
    localStorage.clear();
    location.reload();
}

if (dataStore.length > 0) {
    console.log('\'dataStore\' contains data. Entering Horizon.');
    enterHorizon();
}