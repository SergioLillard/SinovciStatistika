// DISPLAY STATS IN THE TABLE:

const tableBody = document.getElementById("table-body");

function displayStats() {
  tableBody.innerHTML = "";
  let storedPlayers;

  if (localStorage.getItem("Players") === null) {
    storedPlayers = [];
  } else {
    storedPlayers = JSON.parse(localStorage.getItem("Players"));
  }

  storedPlayers.forEach((item) => {
    const tableRow = document.createElement("tr");
    const igracOutput = document.createElement("td");
    const matchesOutput = document.createElement("td");
    const goalsOutput = document.createElement("td");
    const gpmOutput = document.createElement("td");
    const assistsOutput = document.createElement("td");
    const apmOutput = document.createElement("td");
    const contributionOutput = document.createElement("td");
    const cpmOutput = document.createElement("td");
    const deletePlayer = document.createElement("td");

    const goalsPerMatch = (item.goals / item.matches).toFixed(2);
    const assistsPerMatch = (item.assists / item.matches).toFixed(2);
    const contribution = item.goals + item.assists;
    const contributionPerMatch = (contribution / item.matches).toFixed(2);

    igracOutput.innerHTML = item.name;
    matchesOutput.innerHTML = item.matches;
    goalsOutput.innerHTML = item.goals;
    gpmOutput.innerHTML = goalsPerMatch;
    assistsOutput.innerHTML = item.assists;
    apmOutput.innerHTML = assistsPerMatch;
    contributionOutput.innerHTML = contribution;
    cpmOutput.innerHTML = contributionPerMatch;

    const deletePlayerButton = document.createElement("button");
    deletePlayerButton.innerHTML = "X";
    deletePlayerButton.classList.add("delete");
    deletePlayerButton.addEventListener("click", showDeleteMsg);
    deletePlayerButton.id = item.name;
    deletePlayer.appendChild(deletePlayerButton);

    tableRow.appendChild(igracOutput);
    tableRow.appendChild(matchesOutput);
    tableRow.appendChild(goalsOutput);
    tableRow.appendChild(gpmOutput);
    tableRow.appendChild(assistsOutput);
    tableRow.appendChild(apmOutput);
    tableRow.appendChild(contributionOutput);
    tableRow.appendChild(cpmOutput);
    tableRow.append(deletePlayer);
    tableBody.appendChild(tableRow);
  });
  sortPlayersArray();
}

displayStats();

// REMOVE A PLAYER:
let deleteAPlayerName;
let confirmResponse;

function showDeleteMsg(e) {
  deleteAPlayerName = e.srcElement;
  confirmResponse = confirm(
    `Da li si siguran da želiš da izbrišeš igrača ${deleteAPlayerName.id}?`,
    "Ukoliko si siguran, pritisni 'OK'"
  );

  if (confirmResponse === true) {
    deleteAPlayer();
  }
}

function deleteAPlayer() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));
  const index = storedPlayers.findIndex(
    (item) => item.name === deleteAPlayerName.id
  );

  deleteAPlayerName.parentElement.parentElement.remove();

  storedPlayers.splice(index, 1);

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  addCheckboxes();
  addSelectOptions();
}

// ADD SELECT OPTIONS:

const selectPlayer = document.getElementById("select-player");

function addSelectOptions() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  selectPlayer.innerHTML = "";
  storedPlayers.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.name;
    option.innerHTML = item.name;
    selectPlayer.appendChild(option);
  });
}

addSelectOptions();

// SHOW CHECKBOXES:

const checkboxes = document.getElementById("checkboxes");

function addCheckboxes() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  checkboxes.innerHTML = "";
  storedPlayers.forEach((item) => {
    const div = document.createElement("div");

    const label = document.createElement("label");

    label.textContent = item.name;
    label.for = item.name;
    div.appendChild(label);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item.name;
    checkbox.classList.add("checkbox");
    div.appendChild(checkbox);

    div.classList.add("checkbox-div");
    checkboxes.appendChild(div);
  });

  sortPlayersArray();

  // displayStats();
}

addCheckboxes();

// ADD A MATCH TO CHOSEN PLAYERS:

const addMatcesButton = document.getElementById("add-matches");

addMatcesButton.addEventListener("click", addOneMatchToMultiplePlayers);

let allCheckboxes;

function addOneMatchToMultiplePlayers() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  allCheckboxes = checkboxes.querySelectorAll("input");

  allCheckboxes.forEach((item) => {
    if (item.checked) {
      storedPlayers.forEach((player) => {
        if (item.id == player.name) {
          player.matches += 1;
        }
      });
    }
  });

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  allCheckboxes.forEach((item) => {
    item.checked = false;
  });
  displayStats();
}

// REMOVE A MATCH FROM CHOSEN PLAYERS:

const removeMatcesButton = document.getElementById("remove-matches");

removeMatcesButton.addEventListener("click", removeOneMatchFromMultiplePlayers);

function removeOneMatchFromMultiplePlayers() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  allCheckboxes = checkboxes.querySelectorAll("input");

  allCheckboxes.forEach((item) => {
    if (item.checked) {
      storedPlayers.forEach((player) => {
        if (item.id == player.name) {
          player.matches -= 1;
        }
      });
    }
  });

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  allCheckboxes.forEach((item) => {
    item.checked = false;
  });
  displayStats();
}

// ADD A CERTAIN STAT TO A CHOSEN PLAYER:

const goalAstMatch = document.getElementById("goal-or-assist");

const quantity = document.getElementById("quantity");

const addStatsButton = document.getElementById("add-stats");
addStatsButton.addEventListener("click", addStats);

function addStats() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  const numba = Number(quantity.value);

  const playersName = storedPlayers.map((item) => {
    if (item.name === selectPlayer.value) {
      const chosenPlayer = item;
      if (goalAstMatch.value === "gol") {
        chosenPlayer.goals += numba;
      } else if (goalAstMatch.value === "asistencija") {
        chosenPlayer.assists += numba;
      } else if (goalAstMatch.value === "mečevi") {
        chosenPlayer.matches += numba;
      }

      localStorage.setItem("Players", JSON.stringify(storedPlayers));

      displayStats();

      // RESET FIELDS:
      selectPlayer.value = "Amke";
      quantity.value = "";
    }

    return item.name == selectPlayer.value;
  });
}

// ADD A NEW PLAYER:

class Player {
  constructor(name, matches, goals, assists, contribution) {
    (this.name = name),
      (this.matches = matches),
      (this.goals = goals),
      (this.assists = assists),
      (this.contribution = contribution);
  }
}

const nameInput = document.getElementById("name-input");
const matchesInput = document.getElementById("matches-input");
const goalsInput = document.getElementById("goals-input");
const assistsInput = document.getElementById("assists-input");

const addPlayerButton = document.getElementById("add-player");

addPlayerButton.addEventListener("click", addPlayer);

function addPlayer() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  const matchesInput = document.getElementById("matches-input");
  const newPlayer = new Player(
    nameInput.value,
    Number(matchesInput.value),
    Number(goalsInput.value),
    Number(assistsInput.value),
    Number(goalsInput.value) + Number(assistsInput.value)
  );
  storedPlayers.push(newPlayer);

  allCheckboxes = checkboxes.querySelectorAll("input");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  sortPlayersArray();

  addCheckboxes();
  addSelectOptions();

  displayStats();

  nameInput.value = "";
  matchesInput.value = "";
  goalsInput.value = "";
  assistsInput.value = "";
}

// SORT THE PLAYERS ARRAY BY NAME:

function sortPlayersArray() {
  let storedPlayers;

  if (localStorage.getItem("Players") === null) {
    storedPlayers = [];
  } else {
    storedPlayers = JSON.parse(localStorage.getItem("Players"));
  }

  storedPlayers.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    return nameA.localeCompare(nameB);
  });
  localStorage.setItem("Players", JSON.stringify(storedPlayers));
}

// SORTING THE TABLE:

const arrowNames = document.getElementById("arrow-names");
const arrowMatches = document.getElementById("arrow-matches");
const arrowGoals = document.getElementById("arrow-goals");
const arrowGPM = document.getElementById("arrow-gpm");
const arrowAst = document.getElementById("arrow-ast");
const arrowAPM = document.getElementById("arrow-apm");
const arrowContribution = document.getElementById("arrow-contribution");
const arrowCPM = document.getElementById("arrow-cpm");

const arrows = document.querySelectorAll(".arrow");

let order = true;

function sortNames() {
  order = !order;

  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  if (order === true) {
    storedPlayers.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      arrows.forEach((arrow) => {
        arrow.classList.remove("flip");
      });

      return nameA.localeCompare(nameB);
    });
  } else if (order === false) {
    storedPlayers.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      arrows.forEach((arrow) => {
        arrow.classList.remove("flip");
      });
      arrowNames.classList.add("flip");

      return nameB.localeCompare(nameA);
    });
  }

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowNames.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}

function sortMatches() {
  order = !order;

  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  if (order === true) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
    arrowMatches.classList.add("flip");
  } else if (order === false) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
  }

  storedPlayers.sort((a, b) => {
    const matchesA = a.matches;
    const matchesB = b.matches;
    return order ? matchesA - matchesB : matchesB - matchesA;
  });

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowMatches.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}

function sortGoals() {
  order = !order;

  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  if (order === true) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });

    arrowGoals.classList.add("flip");
  } else if (order === false) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
  }

  storedPlayers.sort((a, b) => {
    const goalsA = a.goals;
    const goalsB = b.goals;
    return order ? goalsA - goalsB : goalsB - goalsA;
  });

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowGoals.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}

function sortGPM() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  order = !order;

  if (order === true) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });

    arrowGPM.classList.add("flip");
  } else if (order === false) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
  }

  storedPlayers.sort((a, b) => {
    const gpmA = a.goals / a.matches;
    const gpmB = b.goals / b.matches;
    return order ? gpmA - gpmB : gpmB - gpmA;
  });

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowGPM.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}

function sortAst() {
  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  order = !order;

  if (order === true) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });

    arrowAst.classList.add("flip");
  } else if (order === false) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
  }

  storedPlayers.sort((a, b) => {
    const astA = a.assists;
    const astB = b.assists;
    return order ? astA - astB : astB - astA;
  });

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowAst.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}

function sortAPM() {
  order = !order;

  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  if (order === true) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });

    arrowAPM.classList.add("flip");
  } else if (order === false) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
  }

  storedPlayers.sort((a, b) => {
    const apmA = a.assists / a.matches;
    const apmB = b.assists / b.matches;
    return order ? apmA - apmB : apmB - apmA;
  });

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowAPM.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}

function sortContribution() {
  order = !order;

  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  if (order === true) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });

    arrowContribution.classList.add("flip");
  } else if (order === false) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
  }

  storedPlayers.sort((a, b) => {
    const contributionA = a.goals + a.assists;
    const contributionB = b.goals + b.assists;
    return order
      ? contributionA - contributionB
      : contributionB - contributionA;
  });

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowContribution.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}

function sortCPM() {
  order = !order;

  const storedPlayers = JSON.parse(localStorage.getItem("Players"));

  if (order === true) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });

    arrowCPM.classList.add("flip");
  } else if (order === false) {
    arrows.forEach((arrow) => {
      arrow.classList.remove("flip");
    });
  }
  storedPlayers.sort((a, b) => {
    const cpmA = (a.goals + a.assists) / a.matches;
    const cpmB = (b.goals + b.assists) / b.matches;
    return order ? cpmA - cpmB : cpmB - cpmA;
  });

  arrows.forEach((arrow) => {
    arrow.classList.remove("sorted-column");
  });
  arrowCPM.classList.add("sorted-column");

  localStorage.setItem("Players", JSON.stringify(storedPlayers));

  displayStats();
}
