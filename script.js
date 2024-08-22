// TODO: Display all data points on horizon line.
// TODO: Look into replacing arrays with object constructors? Might be more efficient.
const line = document.getElementById("line");
const defaultcolor = line.style.background;
const placepoint = document.getElementById("placepoint");
const point_data = document.getElementById("point_data");
const line_container = document.getElementById("line_container");
const submit_button = document.getElementById("submit_button");
const title_data = document.getElementById("title_data");
const description_data = document.getElementById("description_data");
const mouseXYposition = document.getElementById("mouseXYposition");


document.addEventListener('mousemove', getPosition);
var mousex;
var mousey;
function getPosition(event) {
    mousex = event.pageX;
    mousey = event.pageY;
    var positionText= "X: " + mousex + ", Y: " + mousey;
    mouseXYposition.innerText = positionText;
    placepoint.style.left = mousex + "px"; // move point with mouse
}

line.onclick = function placePoint() {
    point_data.classList.remove('isHidden');
    point_data.style.left = mousex + "px";
    point_data.style.transition = '1s';
    title_data.focus(); // auto focuses to title input field
    console.log("clicked horizon");
}

line.onmouseover = function displayPoint() {
    line.style.background = "#8fD362";
    placepoint.classList.remove('isHidden');
}

line.onmouseleave = function onMouseLeave() {
    line.style.background = defaultcolor;
    placepoint.classList.add('isHidden');
}

// FIX: Rework uniqueid. Currently restarts back to 1 after importing from localStorage. Make it random x-length string instead of increasing by 1?
var dataStore = JSON.parse(localStorage.getItem('dataLocalStorage')) || []; // imports from local storage, otherwise creates empty array
var uniqueid = 1;
function SubmitData() {
    var obj = {
        id: uniqueid,
        title: title_data.value,
        description: description_data.value
    }
    dataStore.push(obj); // stores into array
    localStorage.setItem('dataLocalStorage', JSON.stringify(dataStore)); // serializes the array and stores in local storage
    uniqueid++;

    point_data.classList.add('isHidden');

    // Clearing input boxes
    title_data.value = ""; 
    description_data.value = "";

    // console.log(localStorage); // for logging purposes
    // console.log(JSON.stringify(dataStore)); // for logging purposes
    console.log(dataStore); // for logging purposes
}

submit_button.onclick = SubmitData;

title_data.addEventListener('keydown', (ev) => {
    if(ev.key == 'Enter') {
        SubmitData();
        console.log("pressed enter"); // for logging purposes
    }
})

description_data.addEventListener('keydown', (ev) => {
    if(ev.key == 'Enter') {
        SubmitData();
        console.log("pressed enter"); // for logging purposes
    }
})

mouseXYposition.onclick = function displayPointData() {
    alert(JSON.stringify(dataStore))
}
