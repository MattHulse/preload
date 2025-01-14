const gameContainer = document.getElementById("game");
const stickerDisplay = document.getElementById("sticker");
const feedback = document.getElementById("feedback");
const toggleZoneIds = document.getElementById("toggleZoneIds");
const toggleZoneIdsLabel = document.getElementById("toggleZoneIdsLabel");

const correctSound = new Audio('sounds/ding.mp3');
const incorrectSound = new Audio('sounds/buzzer.mp3');

const zones = [
    // RHS
    { id: "1000", side: "rhs", layer: "top" },
    { id: "1500", side: "rhs", layer: "top" },
    { id: "5000", side: "rhs", layer: "top" },
    { id: "5500", side: "rhs", layer: "top" },
    { id: "2000", side: "rhs", layer: "middle" },
    { id: "2500", side: "rhs", layer: "middle" },
    { id: "6000", side: "rhs", layer: "middle" },
    { id: "6500", side: "rhs", layer: "middle" },
    { id: "1000FL", side: "rhs", layer: "bottom" },
    { id: "2000FL", side: "rhs", layer: "bottom" },
    { id: "1500FL", side: "rhs", layer: "bottom" },
    { id: "2500FL", side: "rhs", layer: "bottom" },
    { id: "5000FL", side: "rhs", layer: "bottom" },
    { id: "6000FL", side: "rhs", layer: "bottom" },
    { id: "5500FL", side: "rhs", layer: "bottom" },
    { id: "6500FL", side: "rhs", layer: "bottom" },

    // LHS
    { id: "3000", side: "lhs", layer: "top" },
    { id: "3500", side: "lhs", layer: "top" },
    { id: "7000", side: "lhs", layer: "top" },
    { id: "7500", side: "lhs", layer: "top" },
    { id: "4000", side: "lhs", layer: "middle" },
    { id: "4500", side: "lhs", layer: "middle" },
    { id: "8000", side: "lhs", layer: "middle" },
    { id: "8500", side: "lhs", layer: "middle" },
    { id: "3000FL", side: "lhs", layer: "bottom" },
    { id: "4000FL", side: "lhs", layer: "bottom" },
    { id: "3500FL", side: "lhs", layer: "bottom" },
    { id: "4500FL", side: "lhs", layer: "bottom" },
    { id: "7000FL", side: "lhs", layer: "bottom" },
    { id: "8000FL", side: "lhs", layer: "bottom" },
    { id: "7500FL", side: "lhs", layer: "bottom" },
    { id: "8500FL", side: "lhs", layer: "bottom" }
];

// Create shelves and zones in the game area
const shelves = { rhs: {}, lhs: {} };

zones.forEach((zone) => {
    if (!shelves[zone.side][zone.layer]) {
        const shelf = document.createElement("div");
        shelf.className = `shelf ${zone.side} ${zone.layer}`;
        shelves[zone.side][zone.layer] = shelf;
        gameContainer.appendChild(shelf);
    }

    const div = document.createElement("div");
    div.className = `zone ${zone.side} ${zone.layer}`;
    div.dataset.id = zone.id;
    div.innerText = zone.id;

    div.addEventListener("dragover", (e) => {
        e.preventDefault();
        div.classList.add("drag-over");
    });
    div.addEventListener("dragleave", () => {
        div.classList.remove("drag-over");
    });
    div.addEventListener("drop", (e) => {
        e.preventDefault();
        div.classList.remove("drag-over");
        handleZoneClick(e);
    });

    shelves[zone.side][zone.layer].appendChild(div);
});

// Add the walkway component
const walkway = document.createElement("div");
walkway.className = "walkway";
gameContainer.appendChild(walkway);

// Toggle zone IDs visibility
toggleZoneIds.addEventListener("change", () => {
    const zones = document.querySelectorAll(".zone");
    zones.forEach(zone => {
        zone.style.color = toggleZoneIds.checked ? "transparent" : "black"; // Hide only the text
    });
    toggleZoneIdsLabel.innerHTML = `<input type="checkbox" id="toggleZoneIds" ${toggleZoneIds.checked ? "checked" : ""}> ${toggleZoneIds.checked ? "Show Zone IDs" : "Hide Zone IDs"}`;
});

// Toggle checkbox when label is clicked
toggleZoneIdsLabel.addEventListener("click", () => {
    toggleZoneIds.checked = !toggleZoneIds.checked;
    toggleZoneIds.dispatchEvent(new Event("change"));
});

// Game logic
let currentTarget = null;

// Generate a random target zone
function generateTarget() {
    const randomIndex = Math.floor(Math.random() * zones.length);
    const zoneId = zones[randomIndex].id;
    const baseId = zoneId.includes("FL") ? zoneId.slice(0, -4) : zoneId.slice(0, -2); // Strip off the "FL" suffix if present
    const randomDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Generate random last two digits
    currentTarget = baseId + randomDigits + (zoneId.includes("FL") ? "FL" : ""); // Add "FL" back if it was present
    stickerDisplay.innerText = currentTarget; // Only display the address itself
    stickerDisplay.setAttribute("draggable", true);
}

// Handle zone clicks
function handleZoneClick(e) {
    const clickedZone = e.target.dataset.id;

    const baseClickedZone = clickedZone.includes("FL") ? clickedZone.slice(0, -4) : clickedZone.slice(0, -2);
    const baseCurrentTarget = currentTarget.includes("FL") ? currentTarget.slice(0, -4) : currentTarget.slice(0, -2);

    const clickedZoneFL = clickedZone.includes("FL");
    const currentTargetFL = currentTarget.includes("FL");

    if (baseClickedZone === baseCurrentTarget && clickedZoneFL === currentTargetFL) {
        feedback.innerText = `Correct!`;
        feedback.style.color = "green";
        correctSound.play();
        feedback.classList.remove("hide");
        feedback.classList.add("show");
        setTimeout(() => {
            feedback.classList.remove("show");
            feedback.classList.add("hide");
            feedback.innerText = ''; // Clear the text
        }, 2000);
        generateTarget(); // Next round
    } else {
        feedback.innerText = `Wrong! Try again.`;
        feedback.style.color = "red";
        incorrectSound.play();
        feedback.classList.remove("hide");
        feedback.classList.add("show");
        setTimeout(() => {
            feedback.classList.remove("show");
            feedback.classList.add("hide");
            feedback.innerText = ''; // Clear the text
        }, 2000);
    }
}

// Handle sticker drag start
stickerDisplay.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", currentTarget);
    stickerDisplay.classList.add("dragging");
});

// Handle sticker drag end
stickerDisplay.addEventListener("dragend", () => {
    stickerDisplay.classList.remove("dragging");
    document.querySelectorAll(".zone").forEach(zone => zone.classList.remove("drag-over"));
});

// Handle zone clicks
gameContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("zone")) return;
    handleZoneClick(e);
});

// Start the game
generateTarget();