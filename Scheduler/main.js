let tasks = [
    {name: 'Kitchen_monday', 	spots: 2},
    {name: 'Kitchen_thursday', 	spots: 2},
    {name: 'Kitchen_floor', 	spots: 2},
    {name: 'Household', 		spots: 1},
    {name: 'Bathroom', 			spots: 2},
    {name: 'Men_toilet', 		spots: 1},
    {name: 'Women_toilet', 		spots: 1},
    {name: 'Hallway', 			spots: 3},
    {name: 'Stock', 			spots: 2},
    {name: 'Finer', 			spots: 2},
    {name: 'Trash', 			spots: 3}
];

let people = [
    {name: 'Shey',		gender: 'female',	tasks: ['Kitchen_monday', 'Bathroom']},
    {name: 'Em',		gender: 'female',	tasks: ['Kitchen_monday', 'Bathroom']},
    {name: 'Leni',		gender: 'female',	tasks: ['Kitchen_thursday', 'Kitchen_floor']},
    {name: 'Nari',		gender: 'male',	tasks: ['Kitchen_thursday', 'Hallway']},
    {name: 'KZ',		gender: 'male',		tasks: ['Kitchen_floor', 'Stock', 'Trash']},
    {name: 'Gihan',		gender: 'male',		tasks: ['Kitchen_floor', 'Stock', 'Women_toilet']},
    {name: 'Tony',		gender: 'female',		tasks: ['Household', 'Hallway', 'Trash']},
    {name: 'Santi',		gender: 'male',		tasks: ['Bathroom', 'Finer']},
    {name: 'Elena',		gender: 'female',	tasks: ['Bathroom', 'Trash']},
    {name: 'Doma',		gender: 'female',	tasks: ['Women_toilet', 'Kitchen_monday']},
    {name: 'Eoghan',	gender: 'male',		tasks: ['Men_toilet', 'Household']},
    {name: 'Ali',		gender: 'female',		tasks: ['Hallway', 'Trash', 'Kitchen_thursday']},
    {name: 'Rosa',		gender: 'female',	tasks: ['Hallway']},
    {name: 'Pao',		gender: 'male',	tasks: ['Hallway', 'Kitchen_thursday', 'Stock']},
    {name: 'Tristan',	gender: 'male',		tasks: ['Stock', 'Men_toilet', 'Bathroom']},
    {name: 'Isa',		gender: 'female',	tasks: ['Stock', 'Hallway', 'Women_toilet']},
    {name: 'Cata',		gender: 'female',	tasks: ['Finer', 'Kitchen_monday']},
    {name: 'Juniper',	gender: 'female',	tasks: ['Trash', 'Women_toilet', 'Kitchen_floor']},
    {name: 'Tim',		gender: 'male',		tasks: ['Trash', 'Kitchen_thursday', 'Men_toilet']},
    {name: 'Kees',		gender: 'male',		tasks: ['Trash']},
    {name: 'Franz',		gender: 'female',		tasks: []},
];

function renderTasks() {
    const taskList = document.getElementById('tasks');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        taskList.innerHTML += `<li>
            ${task.name} 
            <input type="number" value="${task.spots}" onchange="updateTaskSpots(${index}, this.value)" />
            <button onclick="removeTask(${index})">Remove</button>
        </li>`;
    });
}

function updateTaskSpots(index, newSpots) {
    tasks[index].spots = parseInt(newSpots);
}

function addTask() {
    const taskName = document.getElementById('new-task-name').value;
    const taskSpots = document.getElementById('new-task-spots').value;
    tasks.push({name: taskName, spots: parseInt(taskSpots)});
    renderTasks();
}

function removeTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Render people with tasks on the same line
function renderPeople() {
    const peopleList = document.getElementById('people');
    peopleList.innerHTML = '';
    people.forEach((person, index) => {
        peopleList.innerHTML += `<li>
            <span>${person.name}</span> 
            <span>${person.tasks.join(', ')}</span> 
            <button onclick="removePerson(${index})">Remove</button>
        </li>`;
    });
}

function addPerson() {
    const personName = document.getElementById('new-person-name').value;
    people.push({name: personName, tasks: []});
    renderPeople();
}

function removePerson(index) {
    people.splice(index, 1);
    renderPeople();
}

let taskAssignments = {}; // Object to hold task assignments
let generatedScheduleJson = ""; // To hold the JSON schedule

// Function to generate random assignments of tasks
function assignTasks() {
    taskAssignments = {}; // Reset task assignments
    const availableTasks = [];

    // Populate the availableTasks array based on spots
    for (const task of tasks) {
        for (let i = 0; i < task.spots; i++) {
            availableTasks.push(task.name);
        }
    }

    // Shuffle the available tasks array
    availableTasks.sort(() => Math.random() - 0.5);

    // Shuffle the people array
    const shuffledPeople = [...people].sort(() => Math.random() - 0.5);

    // Create a mapping for gender-specific tasks
    const genderSpecificTasks = {
        'Men_toilet': 'male',
        'Women_toilet': 'female'
    };

    // Assign each person a unique task
    for (let i = 0; i < shuffledPeople.length; i++) {
        const person = shuffledPeople[i];

        // Check if the person can be assigned a gender-specific task
        const genderTask = genderSpecificTasks[availableTasks[i]];

        if (genderTask && person.gender !== genderTask) {
            // Skip this person for gender-specific tasks
            continue;
        }

        if (i < availableTasks.length) {
            const task = availableTasks[i];

            if (!taskAssignments[task]) {
                taskAssignments[task] = [];
            }
            taskAssignments[task].push(person.name);
        }
    }

    // Display the task assignments in the specified order
    displaySchedule(taskAssignments);

    // Show the confirm button
    document.getElementById("confirmButton").style.display = "block";
}

// Function to generate and display the schedule by tasks
function generateSchedule() {
    const scheduleTableContainer = document.getElementById('schedule-table-container');
    scheduleTableContainer.innerHTML = '';  // Clear previous schedule

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create the header row for the schedule table
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Task</th>
        <th>Assigned People</th>
    `;
    thead.appendChild(headerRow);

    // Generate task assignments
    assignTasks();

    // Create table rows for each task in the original order
    for (const task of tasks) {
        const assignedPeople = taskAssignments[task.name] || []; // Get assigned people or an empty array
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${assignedPeople.join(', ')}</td>
        `;
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    scheduleTableContainer.appendChild(table);
}

document.getElementById("confirmButton").addEventListener("click", function() {
    // Update people's tasks and generate JSON
    for (const task in taskAssignments) {
        taskAssignments[task].forEach(personName => {
            const person = people.find(p => p.name === personName);
            if (person) {
                updatePersonTasks(person, task); // Update the person's tasks
            }
        });
    }

    // Generate JSON of the schedule
    generatedScheduleJson = JSON.stringify(taskAssignments, null, 2);
    console.log("Generated Schedule JSON:", generatedScheduleJson);

    // Save updated people array to localStorage
    localStorage.setItem('people', JSON.stringify(people));

    // Create a Blob from the JSON data
    const blob = new Blob([generatedScheduleJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule.json'; // Name of the downloaded file
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Clean up

    // Optionally, you can reset or clear the tasks for the next assignment
});
// Function to update person's task array
function updatePersonTasks(person, newTask) {
    person.tasks.unshift(newTask); // Add the new task to the beginning
    if (person.tasks.length > 3) {
        person.tasks.pop(); // Remove the last task if there are more than 3
    }
}

function displaySchedule(taskAssignments) {
    // Your existing logic for displaying the schedule
    console.log(taskAssignments); // Display task assignments for debugging
}

window.onload = function() {
    const savedPeople = localStorage.getItem('people');
    if (savedPeople) {
        people = JSON.parse(savedPeople);
    }
    renderPeople(); // Render the updated people list
    renderTasks(); // Render the tasks, if needed
};


// Attach event listener to the "Generate Schedule" button
document.getElementById('generate-schedule-btn').addEventListener('click', generateSchedule);

// Attach event listener to the "Generate Schedule" button
document.getElementById('generate-schedule-btn').addEventListener('click', generateSchedule);

document.getElementById('add-person-btn').addEventListener('click', addPerson);
renderPeople();

document.getElementById('add-task-btn').addEventListener('click', addTask);
renderTasks();
