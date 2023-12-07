// Utility functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Global variables for chart instances
let waterIntakeChartInstance;
let weightChartInstance;

// Water Intake Tracker
let waterIntakeHistoryRaw = loadFromLocalStorage('waterIntakeHistory');
let waterIntakeHistory = {};

if (waterIntakeHistoryRaw && typeof waterIntakeHistoryRaw === 'object' && !Array.isArray(waterIntakeHistoryRaw)) {
    waterIntakeHistory = waterIntakeHistoryRaw;
}

const currentDate = getTodayDate();

if (!waterIntakeHistory[currentDate]) {
    waterIntakeHistory[currentDate] = 0;
}

const waterIntakeButton = document.getElementById('water-intake-button');
const waterIntakeResetButton = document.getElementById('water-intake-reset-button');
const waterIntakeDisplay = document.getElementById('water-intake-display');

waterIntakeButton.addEventListener('click', () => {
    waterIntakeHistory[currentDate]++;
    saveToLocalStorage('waterIntakeHistory', waterIntakeHistory);
    displayWaterIntake();
    generateWaterIntakeChart();
});

waterIntakeResetButton.addEventListener('click', () => {
    waterIntakeHistory[currentDate] = 0;
    saveToLocalStorage('waterIntakeHistory', waterIntakeHistory);
    displayWaterIntake();
    generateWaterIntakeChart();
});

function displayWaterIntake() {
    waterIntakeDisplay.textContent = `Cups today: ${waterIntakeHistory[currentDate]}`;
}

function generateWaterIntakeChart() {
    if (waterIntakeChartInstance) {
        waterIntakeChartInstance.destroy();
    }

    const ctx = document.getElementById('water-intake-chart').getContext('2d');
    const dates = Object.keys(waterIntakeHistory);
    const cups = Object.values(waterIntakeHistory);

    waterIntakeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Cups of Water',
                data: cups,
                backgroundColor: 'blue',
                borderColor: 'lightblue',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Weight Tracker
let weightDataRaw = loadFromLocalStorage('weightData');
let weightData = {};

if (weightDataRaw && typeof weightDataRaw === 'object' && !Array.isArray(weightDataRaw)) {
    weightData = weightDataRaw;
}

if (!weightData[currentDate]) {
    weightData[currentDate] = 0; // Default to 0 if no data is present
}

const weightInput = document.getElementById('weight-input');
const weightSetButton = document.getElementById('weight-set-button');
const weightDisplay = document.getElementById('weight-display');

weightSetButton.addEventListener('click', () => {
    const currentWeight = parseFloat(weightInput.value);
    if (!isNaN(currentWeight)) {
        weightData[currentDate] = currentWeight;
        saveToLocalStorage('weightData', weightData);
        displayWeight();
        generateWeightChart();
    }
});

function displayWeight() {
    weightDisplay.textContent = `Current weight: ${weightData[currentDate]?.toFixed(2) || 'Not set'} kg`;
}

function generateWeightChart() {
    if (weightChartInstance) {
        weightChartInstance.destroy();
    }

    const ctx = document.getElementById('weight-chart').getContext('2d');
    const dates = Object.keys(weightData);
    const weights = Object.values(weightData);

    weightChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Weight (kg)',
                data: weights,
                backgroundColor: 'green',
                borderColor: 'lightgreen',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

/* // Healthy Habits Checklist
let habitsData = loadFromLocalStorage('habitsData');

if (!Array.isArray(habitsData)) {
    habitsData = [];
}

const habitsChecklist = document.getElementById('habits-checklist');

function saveHabitChanges() {
    const updatedHabits = [];
    habitsChecklist.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        updatedHabits.push({ habit: checkbox.value, completed: checkbox.checked });
    });
    saveToLocalStorage('habitsData', updatedHabits);
}

function displayHabits() {
    habitsChecklist.innerHTML = '';
    habitsData.forEach(habit => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = habit.habit;
        checkbox.checked = habit.completed;
        checkbox.addEventListener('change', saveHabitChanges);
        label.appendChild(checkbox);
        label.append(habit.habit);
        habitsChecklist.appendChild(label);
    });
} */

console.log("Loaded weightData from localStorage:", weightData);
console.log("Loaded waterIntakeHistory from localStorage:", waterIntakeHistory);

// Initial display and chart generation
/* displayHabits(); */
displayWaterIntake();
generateWaterIntakeChart();
displayWeight();
generateWeightChart();
