// --- Appliance images ---
const applianceImages = {
  TV: "tv.png",
  Fan: "fan.png",
  Lamp: "lamp.png",
  Computer: "laptop.png",
  Heater: "heater.png",
  AC: "air-conditioner.png",
  Charger: "charger.png"
};

// --- Rooms and positions ---
const rooms = [
  {
    title: "Room 1",
    background: "bedroom.png",
    inUseAssigned: false,
    appliances: [
      { name: "Fan", state: "on", topPx: 195, leftPx: 160, widthPx: 100, heightPx: 100, topPxMobile: 200, leftPxMobile: 160 },
      { name: "Lamp", state: "on", topPx: 255, leftPx: 730, widthPx: 100, heightPx: 100, topPxMobile: 260, leftPxMobile: 730 },
      { name: "Heater", state: "on", topPx: 390, leftPx: 650, widthPx: 120, heightPx: 120, topPxMobile: 400, leftPxMobile: 650 }
    ]
  },
  {
    title: "Room 2",
    background: "livingroom.png",
    inUseAssigned: false,
    appliances: [
      { name: "Charger", state: "on", topPx: 240, leftPx: 780, widthPx: 120, heightPx: 120, topPxMobile: 250, leftPxMobile: 780 },
      { name: "Computer", state: "on", topPx: 350, leftPx: 390, widthPx: 100, heightPx: 90, topPxMobile: 360, leftPxMobile: 390 },
      { name: "AC", state: "on", topPx: 30, leftPx: 600, widthPx: 170, heightPx: 180, topPxMobile: 40, leftPxMobile: 600 }
    ]
  },
  {
    title: "Room 3",
    background: "office.png",
    inUseAssigned: false,
    appliances: [
      { name: "AC", state: "on", topPx: 30, leftPx: 420, widthPx: 170, heightPx: 170, topPxMobile: 40, leftPxMobile: 420 },
      { name: "TV", state: "on", topPx: 140, leftPx: 270, widthPx: 280, heightPx: 200, topPxMobile: 150, leftPxMobile: 270 }
    ]
  }
];

// --- Game variables ---
let currentRoom = 0;
let selectedAppliance = null;
let energy = 100;
let timer;
let gameOver = false;

// --- DOM elements ---
const energyBar = document.getElementById("energy-bar");
const roomTitle = document.getElementById("room-title");
const appliancesDiv = document.getElementById("appliances");
const switchOffBtn = document.getElementById("switch-off-btn");
const messageDiv = document.getElementById("message");
const popupDiv = document.getElementById("popup-message");
const startPage = document.getElementById("startPage");
const startBtn = document.getElementById("startBtn");
const gameDiv = document.getElementById("game");
const resetBtn = document.getElementById("resetProgressBtn");

gameDiv.style.display = "none";

// --- Detect mobile ---
function isMobile() {
  return window.innerWidth <= 600;
}

// --- Assign random in-use appliances ---
function assignRandomInUse(room) {
  room.appliances.forEach(app => {
    if (app.state === "on" && Math.random() < 0.3) app.state = "in-use";
  });
  const hasOn = room.appliances.some(app => app.state === "on");
  if (!hasOn && room.appliances.length > 0) {
    const randIndex = Math.floor(Math.random() * room.appliances.length);
    room.appliances[randIndex].state = "on";
  }
}

// --- Popup messages ---
function showPopupMessage(text) {
  popupDiv.textContent = text;
  popupDiv.style.opacity = 1;
  setTimeout(() => popupDiv.style.opacity = 0, 1500);
}

// --- Start game ---
startBtn.addEventListener("click", () => {
  startPage.style.display = "none";
  gameDiv.style.display = "flex";
  startGame();
});

// --- Start game function ---
function startGame() {
  renderRoom();
  timer = setInterval(() => {
    if (gameOver) return;
    energy -= 4;
    if (energy <= 0) {
      energy = 0;
      updateEnergyBar();
      endGame(false);
      return;
    }
    updateEnergyBar();
  }, 1000);
}

// --- Update energy bar ---
function updateEnergyBar() {
  energyBar.style.width = energy + "%";
  if (energy > 50) energyBar.style.background = "linear-gradient(to right, #4caf50, #81c784)";
  else if (energy > 20) energyBar.style.background = "linear-gradient(to right, #ff9800, #ffb74d)";
  else energyBar.style.background = "linear-gradient(to right, #f44336, #e57373)";
}

// --- Render room ---
function renderRoom() {
  if (gameOver) return;
  const room = rooms[currentRoom];
  if (!room.inUseAssigned) {
    assignRandomInUse(room);
    room.inUseAssigned = true;
  }

  const mobile = isMobile();
  roomTitle.textContent = room.title;
  appliancesDiv.style.backgroundImage = room.background ? `url(${room.background})` : "none";
  appliancesDiv.innerHTML = "";
  switchOffBtn.disabled = true;
  selectedAppliance = null;
  messageDiv.textContent = "";

  room.appliances.forEach((app, index) => {
    const div = document.createElement("div");
    div.classList.add("appliance", app.state);

    const img = document.createElement("img");
    img.src = applianceImages[app.name] || "https://img.icons8.com/ios/96/question-mark.png";
    img.alt = app.name;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    div.appendChild(img);

    div.style.position = "absolute";

    // Use separate offsets for desktop and mobile
    if (mobile) {
      div.style.top = app.topPxMobile + "px";
      div.style.left = app.leftPxMobile + "px";
      div.style.width = app.widthPx + "px";
      div.style.height = app.heightPx + "px";
    } else {
      div.style.top = (app.topPx - "80") + "px";
      div.style.left = app.leftPx + "px";
      div.style.width = app.widthPx + "px";
      div.style.height = app.heightPx + "px";
    }

    div.addEventListener("click", () => {
      if (gameOver) return;
      if (app.state === "on") {
        document.querySelectorAll(".appliance").forEach(a => a.classList.remove("selected"));
        div.classList.add("selected");
        selectedAppliance = index;
        switchOffBtn.disabled = false;
        messageDiv.textContent = "";
      } else if (app.state === "in-use") {
        selectedAppliance = null;
        switchOffBtn.disabled = true;
        showPopupMessage("⚡ Appliance in use — cannot switch off");
      }
    });

    if (app.state === "in-use") {
      div.style.opacity = 0.6;
      div.title = "Currently in use — cannot switch off";
      div.style.cursor = "pointer";
    }

    appliancesDiv.appendChild(div);
  });
}

// --- Switch off button ---
switchOffBtn.addEventListener("click", () => {
  if (gameOver) return;
  if (selectedAppliance !== null) {
    const room = rooms[currentRoom];
    if (room.appliances[selectedAppliance].state === "on") {
      room.appliances[selectedAppliance].state = "off";
      renderRoom();
      checkRoomClear();
    }
  }
});

// --- Check room cleared ---
function checkRoomClear() {
  const room = rooms[currentRoom];
  const unfinished = room.appliances.some(app => app.state === "on");
  if (!unfinished) {
    currentRoom++;
    if (currentRoom < rooms.length) renderRoom();
    else endGame(true);
  }
}

// --- End game ---
function endGame(win) {
  clearInterval(timer);
  gameOver = true;
  switchOffBtn.disabled = true;
  document.querySelectorAll(".appliance").forEach(div => div.style.pointerEvents = "none");
  messageDiv.textContent = win
    ? "🎉 Congratulations! You saved all the energy!"
    : "💀 Game Over! Energy depleted!";
}

// --- Reset progress ---
resetBtn.addEventListener("click", () => {
  currentRoom = 0;
  selectedAppliance = null;
  energy = 100;
  gameOver = false;
  rooms.forEach(room => {
    room.inUseAssigned = false;
    room.appliances.forEach(app => { if(app.state !== "off") app.state = "on"; });
  });
  updateEnergyBar();
  messageDiv.textContent = "";
  renderRoom();
  clearInterval(timer);
  startGame();
});

// --- Re-render on window resize ---
window.addEventListener("resize", () => renderRoom());
