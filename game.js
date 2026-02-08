const patches = [
  { name: "Клітинка", color: "#ef476f" },
  { name: "Хвиля", color: "#118ab2" },
  { name: "Листя", color: "#06d6a0" },
  { name: "Зигзаг", color: "#9b5de5" },
  { name: "Етно", color: "#f78c2f" },
  { name: "Мінімал", color: "#3a86ff" },
];

const questions = [
  {
    q: "Яка компетентність найкраще розвивається, коли ви комбінуєте різні фактури у єдину композицію?",
    options: ["Критичне мислення", "Фінансова грамотність", "Кулінарні навички"],
    correct: 0,
    skill: "Критичне мислення: порівняння і вибір оптимальних рішень",
  },
  {
    q: "Ви працюєте в парі, ділите ролі та погоджуєте стиль ковдри. Що тренуєте найбільше?",
    options: ["Командну взаємодію", "Механічну пам'ять", "Швидке читання"],
    correct: 0,
    skill: "Комунікація та командна робота",
  },
  {
    q: "Потрібно створити естетичний виріб з обмеженої кількості тканини. Яка навичка ключова?",
    options: ["Планування ресурсів", "Усне рахування", "Сліпе копіювання"],
    correct: 0,
    skill: "Проєктування і раціональне використання ресурсів",
  },
  {
    q: "Якщо ви переробляєте старий одяг у новий виріб, який підхід ви практикуєте?",
    options: ["Апсайклінг та сталий дизайн", "Деструктивний дизайн", "Пасивне споживання"],
    correct: 0,
    skill: "Екологічне мислення і відповідальність",
  },
  {
    q: "Що найкраще допомагає зберегти цілісність орнаменту в печворку?",
    options: ["Попередній ескіз і модульна сітка", "Випадкове розміщення", "Лише імпровізація без плану"],
    correct: 0,
    skill: "Візуальне планування та структурне мислення",
  },
];

const state = {
  round: 1,
  score: 0,
  timeLeft: 45,
  selectedCell: null,
  answersGiven: 0,
  usedSkills: new Set(),
  questionPool: [...questions].sort(() => Math.random() - 0.5),
};

const roundEl = document.getElementById("round");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const boardEl = document.getElementById("board");
const paletteEl = document.getElementById("palette");
const questionTextEl = document.getElementById("questionText");
const answersEl = document.getElementById("answers");
const resetBtn = document.getElementById("resetBtn");
const resultPanel = document.getElementById("resultPanel");
const resultText = document.getElementById("resultText");
const skillsList = document.getElementById("skillsList");

let timerId;

function renderBoard() {
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i += 1) {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", () => selectCell(cell));
    boardEl.append(cell);
  }
}

function renderPalette() {
  paletteEl.innerHTML = "";
  patches.forEach((patch) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "patch";
    btn.style.background = patch.color;
    btn.textContent = patch.name;
    btn.addEventListener("click", () => placePatch(patch));
    paletteEl.append(btn);
  });
}

function selectCell(cell) {
  if (state.selectedCell) {
    state.selectedCell.classList.remove("selected");
  }
  state.selectedCell = cell;
  state.selectedCell.classList.add("selected");
}

function placePatch(patch) {
  if (!state.selectedCell || state.round > 3) return;

  if (!state.selectedCell.dataset.filled) {
    state.score += 4;
  }
  state.selectedCell.style.background = patch.color;
  state.selectedCell.textContent = patch.name;
  state.selectedCell.dataset.filled = "1";
  state.selectedCell.classList.remove("selected");
  state.selectedCell = null;
  updateHeader();

  const filledCells = [...document.querySelectorAll(".cell")].filter((c) => c.dataset.filled).length;
  if (filledCells % 3 === 0) {
    state.round += 1;
    updateHeader();
  }

  if (state.round > 3) {
    finishGame();
  }
}

function showQuestion() {
  const current = state.questionPool[state.answersGiven % state.questionPool.length];
  questionTextEl.textContent = current.q;
  answersEl.innerHTML = "";

  current.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.textContent = option;

    btn.addEventListener("click", () => {
      if (answersEl.dataset.locked === "1") return;
      answersEl.dataset.locked = "1";
      state.answersGiven += 1;

      if (index === current.correct) {
        btn.classList.add("correct");
        state.score += 10;
        state.usedSkills.add(current.skill);
      } else {
        btn.classList.add("wrong");
      }

      updateHeader();
      setTimeout(() => {
        answersEl.dataset.locked = "";
        if (state.round <= 3) {
          showQuestion();
        }
      }, 500);
    });

    answersEl.append(btn);
  });
}

function updateHeader() {
  roundEl.textContent = Math.min(state.round, 3);
  scoreEl.textContent = state.score;
  timeEl.textContent = state.timeLeft;
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    state.timeLeft -= 1;
    updateHeader();
    if (state.timeLeft <= 0) {
      finishGame();
    }
  }, 1000);
}

function finishGame() {
  clearInterval(timerId);
  resultPanel.hidden = false;
  const competencyRate = state.usedSkills.size >= 3 ? "високий" : "базовий";

  resultText.textContent = `Твій результат: ${state.score} балів. Рівень розвитку компетентностей: ${competencyRate}.`;
  skillsList.innerHTML = "";

  if (state.usedSkills.size === 0) {
    const li = document.createElement("li");
    li.textContent = "Спробуй відповідати на запитання, щоб відкрити компетентності.";
    skillsList.append(li);
  } else {
    state.usedSkills.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      skillsList.append(li);
    });
  }
}

function resetGame() {
  state.round = 1;
  state.score = 0;
  state.timeLeft = 45;
  state.selectedCell = null;
  state.answersGiven = 0;
  state.usedSkills = new Set();
  state.questionPool = [...questions].sort(() => Math.random() - 0.5);
  resultPanel.hidden = true;

  renderBoard();
  renderPalette();
  showQuestion();
  updateHeader();
  startTimer();
}

resetBtn.addEventListener("click", resetGame);
resetGame();
