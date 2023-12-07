// Utility functions
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Water Intake Tracker
let waterIntakeHistory = loadFromLocalStorage('waterIntakeHistory') || {};
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
    const ctx = document.getElementById('water-intake-chart').getContext('2d');
    const dates = Object.keys(waterIntakeHistory);
    const cups = Object.values(waterIntakeHistory);

    new Chart(ctx, {
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
let weightData = loadFromLocalStorage('weightData') || {};
const weightInput = document.getElementById('weight-input');
const weightAdjustButton = document.getElementById('weight-adjust-button');
const weightDisplay = document.getElementById('weight-display');

if (!weightData[currentDate]) {
    weightData[currentDate] = parseFloat(weightData[Object.keys(weightData).pop()]) || 0; // Ensure number
}

weightAdjustButton.addEventListener('click', () => {
    const adjustment = parseFloat(weightInput.value);
    if (!isNaN(adjustment)) {
        weightData[currentDate] = (weightData[currentDate] || 0) + adjustment; // Ensure arithmetic addition
        saveToLocalStorage('weightData', weightData);
        displayWeight();
        generateWeightChart();
    }
});

function displayWeight() {
    weightDisplay.textContent = `Current weight: ${weightData[currentDate].toFixed(2)} kg`; // Rounded to 2 decimal places
}

function generateWeightChart() {
    const ctx = document.getElementById('weight-chart').getContext('2d');
    const dates = Object.keys(weightData);
    const weights = Object.values(weightData);

    new Chart(ctx, {
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

// Healthy Habits Checklist
const habitsData = loadFromLocalStorage('habitsData') || [];
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
}
displayHabits();

// Initial display and chart generation
displayWaterIntake();
generateWaterIntakeChart();
displayWeight();
generateWeightChart();
