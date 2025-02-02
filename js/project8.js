/************************************************
 * 1. Narrative / Story Data
 ************************************************/
/*
  Each "scene" in the story has:
    - id: unique identifier
    - text: the scene's narrative
    - choices: array of choices, each with:
        -- text: label on the button
        -- nextScene: id of the scene the choice leads to
  A "nextScene" of null can represent an ending.
*/
const storyData = [
  {
    id: "start",
    text: "You awake in a dark forest. You can hear the rustling of leaves around you...",
    choices: [
      { text: "Look around", nextScene: "lookAround" },
      { text: "Call out for help", nextScene: "callHelp" }
    ]
  },
  {
    id: "lookAround",
    text: "As your eyes adjust, you notice a faint path leading deeper into the forest.",
    choices: [
      { text: "Follow the path", nextScene: "followPath" },
      { text: "Stay where you are", nextScene: "stayPut" }
    ]
  },
  {
    id: "callHelp",
    text: "Your voice echoes among the trees, but no one responds. Suddenly you hear a howl in the distance...",
    choices: [
      { text: "Run away from the howl", nextScene: "followPath" },
      { text: "Hide behind a tree", nextScene: "stayPut" }
    ]
  },
  {
    id: "followPath",
    text: "You follow the path deeper into the forest, eventually finding a small cabin with a warm light inside.",
    choices: [
      { text: "Enter the cabin", nextScene: "cabinInside" },
      { text: "Circle around it cautiously", nextScene: "cabinOutside" }
    ]
  },
  {
    id: "stayPut",
    text: "You decide to stay put. Hours pass, and the forest grows quiet. Eventually, you doze off...",
    choices: [
      { text: "Wake up later", nextScene: "followPath" },
      { text: "Give up", nextScene: null }
    ]
  },
  {
    id: "cabinInside",
    text: "Inside the cabin, you find a cozy room. A friendly old woman offers you soup. She promises to guide you out of the forest safely.",
    choices: [
      { text: "Accept her help (End)", nextScene: null },
      { text: "Refuse and leave", nextScene: "wanderForest" }
    ]
  },
  {
    id: "cabinOutside",
    text: "Circling the cabin, you notice a small trapdoor leading under the structure...",
    choices: [
      { text: "Open the trapdoor", nextScene: "trapdoor" },
      { text: "Knock on the front door", nextScene: "cabinInside" }
    ]
  },
  {
    id: "wanderForest",
    text: "You wander aimlessly in the woods. Eventually, you find a road leading back to safety. You vow never to return to this forest again. (End)",
    choices: []
  },
  {
    id: "trapdoor",
    text: "You open the trapdoor and discover a hidden cellar filled with old artifacts. One artifact glows with a strange light. You feel you've unlocked a secret. (End)",
    choices: []
  },
  {
    id: "forestClearing",
    text: "You reach a clearing with a strange stone altar at its center. The air hums with energy.",
    choices: [
      { text: "Inspect the altar", nextScene: "inspectAltar" },
      { text: "Avoid it and continue walking", nextScene: "findCave" }
    ]
  },
  {
    id: "inspectAltar",
    text: "The altar is covered in ancient runes. As you touch it, a vision of a forgotten past fills your mind.",
    choices: [
      { text: "Embrace the vision", nextScene: "visionPast" },
      { text: "Pull your hand away", nextScene: "findCave" }
    ]
  },
  {
    id: "findCave",
    text: "You come across a dark cave. Cold air drifts from within, hinting at unknown dangers.",
    choices: [
      { text: "Enter the cave", nextScene: "exploreCave" },
      { text: "Camp outside", nextScene: "campNight" }
    ]
  },
  {
    id: "visionPast",
    text: "The vision reveals a story of guardians who once protected the forest. They warn you of an ancient curse.",
    choices: [
      { text: "Heed their warning", nextScene: "returnPath" },
      { text: "Dismiss it and move on", nextScene: "exploreCave" }
    ]
  },
  {
    id: "exploreCave",
    text: "Inside the cave, you find strange markings and hear distant echoes. The path splits ahead.",
    choices: [
      { text: "Take the left path", nextScene: "leftPath" },
      { text: "Take the right path", nextScene: "rightPath" }
    ]
  },
  {
    id: "campNight",
    text: "You set up camp near the cave entrance. The night is peaceful, but you feel like something is watching you.",
    choices: [
      { text: "Investigate the feeling", nextScene: "ghostEncounter" },
      { text: "Ignore it and sleep", nextScene: "morningDawn" }
    ]
  },
  {
    id: "ghostEncounter",
    text: "A ghostly figure appears, warning you of the cave's dangers.",
    choices: [
      { text: "Listen to the ghost", nextScene: "returnPath" },
      { text: "Challenge the ghost", nextScene: "battleGhost" }
    ]
  },
  {
    id: "morningDawn",
    text: "You awaken to the sound of birds. The forest feels less menacing in the daylight.",
    choices: [
      { text: "Resume your journey", nextScene: "returnPath" },
      { text: "Explore the surroundings", nextScene: "forestClearing" }
    ]
  },
  {
    id: "battleGhost",
    text: "You face off with the ghost in a supernatural duel. It vanishes after a fierce struggle.",
    choices: [
      { text: "Press on into the cave", nextScene: "exploreCave" },
      { text: "Retreat to safety", nextScene: "returnPath" }
    ]
  },
  {
    id: "leftPath",
    text: "The left path leads you to an underground spring. You feel rejuvenated.",
    choices: [
      { text: "Rest by the spring", nextScene: "springRest" },
      { text: "Continue deeper", nextScene: "hiddenChamber" }
    ]
  },
  {
    id: "rightPath",
    text: "The right path leads to a dead end filled with strange carvings.",
    choices: [
      { text: "Examine the carvings", nextScene: "visionPast" },
      { text: "Turn back", nextScene: "exploreCave" }
    ]
  }
];


/************************************************
 * 2. State & DOM Elements
 ************************************************/
let currentSceneId = "start"; // Where in the story we currently are
let visitedScenes = new Set(); // Keep track of visited scenes for progress

const storyText = document.getElementById("storyText");
const choicesContainer = document.getElementById("choicesContainer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

/************************************************
 * 3. Initialization
 ************************************************/
window.addEventListener("load", () => {
  // Check if there's a saved scene in localStorage
  const savedScene = localStorage.getItem("adventureScene");
  const savedVisited = localStorage.getItem("adventureVisited");
  if (savedScene && savedVisited) {
    currentSceneId = savedScene;
    visitedScenes = new Set(JSON.parse(savedVisited));
  }

  displayScene(currentSceneId);
});

/************************************************
 * 4. Display Scene
 ************************************************/
function displayScene(sceneId) {
  const scene = storyData.find(s => s.id === sceneId);
  if (!scene) return;

  // Mark scene as visited
  if (!visitedScenes.has(sceneId)) {
    visitedScenes.add(sceneId);
  }

  // Update text
  storyText.textContent = scene.text;

  // Clear old choices
  choicesContainer.innerHTML = "";

  // If no choices => it's an ending
  if (!scene.choices || scene.choices.length === 0) {
    const endMsg = document.createElement("p");
    endMsg.textContent = "The End.";
    choicesContainer.appendChild(endMsg);
  } else {
    // Create a button for each choice
    scene.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.classList.add("choice-btn");
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        // If nextScene is null => it's an end
        if (choice.nextScene === null) {
          storyText.textContent = "You have reached an ending. Thanks for playing!";
          choicesContainer.innerHTML = "";
          visitedScenes.add("end");
          updateProgress();
          return;
        } else {
          currentSceneId = choice.nextScene;
          displayScene(currentSceneId);
        }
      });
      choicesContainer.appendChild(btn);
    });
  }

  // Update progress bar
  updateProgress();
}

/************************************************
 * 5. Update Progress Bar
 ************************************************/
function updateProgress() {
  // Calculate how many scenes have been visited
  // out of total possible scenes (excluding the "null" endings).
  const totalScenes = storyData.length;
  const visitedCount = visitedScenes.size;

  const percent = Math.floor((visitedCount / totalScenes) * 100);
  progressBar.style.setProperty("--progress-percent", `${percent}%`);
  // Update the bar's width via ::after, or we can set inline style if we want:
  progressBar.style.setProperty("position", "relative");
  progressBar.style.setProperty("--progress-width", `${percent}%`);

  // We'll update the pseudo-element with:
  progressBar.style.setProperty("overflow", "hidden");
  progressBar.style.setProperty("background", "#ccc");
  progressBar.style.setProperty("border-radius", "5px");

  // We can do this trick: progressBar::after => width: var(--progress-width).
  // For simplicity, let's just set the bar's after using direct style injection:
  progressBar.style.setProperty("background-image", `linear-gradient(to right, #3f51b5 ${percent}%, #ccc ${percent}%)`);

  // Alternatively, if using the .progress-bar::after approach from CSS:
  const barElement = document.querySelector(".progress-bar::after");
  // but we can't set pseudo-element styles directly from JS easily. So let's keep it simpler:
  // We'll do a direct approach in the CSS by default. Or inline approach.

  progressText.textContent = `Progress: ${percent}%`;
}

/************************************************
 * 6. Save & Reset
 ************************************************/
saveBtn.addEventListener("click", () => {
  // Save current scene & visited scenes to localStorage
  localStorage.setItem("adventureScene", currentSceneId);
  localStorage.setItem("adventureVisited", JSON.stringify([...visitedScenes]));
  alert("Game saved!");
});

resetBtn.addEventListener("click", () => {
  // Clear localStorage and reset
  localStorage.removeItem("adventureScene");
  localStorage.removeItem("adventureVisited");
  currentSceneId = "start";
  visitedScenes.clear();
  displayScene("start");
});

// Reference to the story elements
const sceneTextDisplay = document.getElementById('storyText');
const sceneChoicesContainer = document.getElementById('choicesContainer');
const scenePathTree = document.getElementById('pathTree');

// Track visited paths to avoid duplicates
const visitedPaths = new Set();

// Function to display a story scene
function displayScene(sceneId) {
    const scene = storyData.find(s => s.id === sceneId);

    // Update the story text
    sceneTextDisplay.textContent = scene.text;

    // Clear and update choices
    sceneChoicesContainer.innerHTML = '';
    scene.choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        button.onclick = () => {
            if (choice.nextScene) {
                addPathNode(sceneId, scene.text); // Add path node for navigation if new
                displayScene(choice.nextScene);   // Navigate to the next scene
            }
        };
        sceneChoicesContainer.appendChild(button);
    });
}

// Function to add a path node if it hasn't been added yet
function addPathNode(sceneId, text) {
    if (visitedPaths.has(sceneId)) return;  // Prevent duplicates

    const node = document.createElement('div');
    node.className = 'path-node visible';

    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = () => displayScene(sceneId); // Navigate back to this scene
    node.appendChild(button);

    scenePathTree.appendChild(node);
    visitedPaths.add(sceneId);
}

// Initial scene setup
displayScene('start');