const cubeSizesContainer = document.querySelector(".cube-size");
const btnScramble = document.querySelector(".btn__scramble");
const scrambleOutcome = document.querySelector(".scramble__output");
const timer = document.querySelector(".timer");
const btnStart = document.querySelector(".btn-start");
const resultsTable = document.querySelector(".results");
let timerRun = false;
let myTimer;
let msec;
let sec;
let min;
let h;

const cubeSizes = [
    "2x2x2", 
    "3x3x3", 
    "4x4x4", 
    "5x5x5", 
    "6x6x6", 
    "7x7x7", 
    "8x8x8", 
    "9x9x9"
];
const permutations = [
    "L", "R", "D", "B", "U", "F", "L2", "R2", "D2", "B2", "U2", "F2", "L'", "R'", "D'", "B'", "U'", "F'"
];

window.addEventListener("load", async e => {
    await cubeSizesToSelect();
    await displayResultsFromLocalStorage();
    displayTopFiveResults();
    scramble();
});

function cubeSizesToSelect() {
    cubeSizesContainer.innerHTML = cubeSizes
        .map(cubeSize => `<option value=${cubeSize} ${cubeSize === "3x3x3" ? "selected" : ""}>${cubeSize}</option>`)
        .join('\n');
};

btnScramble.addEventListener("click", scramble);

function scramble() {
    let scrambleOutput = [];
    for( let i = 0; i < 25; i++){
        scrambleOutput.push(permutations[Math.floor(Math.random() * permutations.length)]);
    }
    scrambleOutcome.innerText = scrambleOutput.join(" ");
};

btnStart.addEventListener("click", handleTimer);

function handleTimer() {
    if (!timerRun) {
        timerStart();
        btnStart.innerText = "stop";
    } else {
        timerStop();
        addResultToLocalStorage();
        displayResultsFromLocalStorage();
        displayTopFiveResults();
        scramble();
        btnStart.innerText = "start";
    }
}



function timerStart() {
    msec = "00"; sec = "00"; min = "00"; h = "";
    myTimer = setInterval(updateTime, 1);
    timerRun = true;
}

function timerStop() {
    clearInterval(myTimer);
    timerRun = false;
}

let time = "";

function updateTime() {

    msec++;

    if(msec < 10) {
        msec = "0" + msec;
    }
    if(msec > 99) {
        msec = "00";
        sec++;
        if(sec < 10) {
            sec = ("0"+sec);
        }
        if(sec > 59) {
            sec = "00";
            min++;
            if(min < 10) {
                min = ("0"+min);
            }
            if(min > 59) {
                h++;
                if(h < 10) {
                    h = "0"+h;
                }
                h += ":";
            }  
        }
    }

    time = h + min + ":" + sec + ":" + msec;
    timer.innerText = time;
}

async function addResultToLocalStorage() {
    const uniqueID = new Date().getTime();
    localStorage[uniqueID] = time;
}

async function displayResultsFromLocalStorage() {
    let arrayOfResults = []
    for(let i = 1; i <= localStorage.length; i++){
        arrayOfResults.push(`<tr><td>ID: ${i}</td><td>KEY: ${localStorage.key(i-1)}</td><td>${localStorage[localStorage.key(i-1)]}</td>
        <td><button onclick="removeFromStorage(${localStorage.key(i-1)})">X</button></td></tr>`)
    }
    resultsTable.innerHTML = await arrayOfResults.join("");

}

async function removeFromStorage(id) {
    localStorage.removeItem(id);
    console.log("Done", id);
    displayResultsFromLocalStorage();
}

async function displayTopFiveResults(id) {
    let arrayOfTopFiveResults = []

    for(let i = 1; i <= localStorage.length; i++){
        arrayOfTopFiveResults.push(localStorage[localStorage.key(i-1)])
    }
    arrayOfTopFiveResults.sort();

    for(let j = 0; j < 5; j++){
        console.log(arrayOfTopFiveResults[j])
    }

}


