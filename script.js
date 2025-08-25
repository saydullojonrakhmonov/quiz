// ====== Elements ======
const settingsBtn = document.querySelector(".settings-btn");
const modal = document.getElementById("modal");
const applyBtn = document.querySelector(".apply-btn");
const quizType = document.getElementById("quiz-types");
const quizAmount = document.getElementById("quiz-amount");
const quizCategory = document.getElementById("quiz-category");
const startBtn = document.getElementById("startBtn");

let changeLevels;
let questions = [];

settingsBtn.addEventListener("click", (e) => {
  addRipple(e);
  modal.classList.toggle("hide");
});

applyBtn.addEventListener("click", (e) => {
  addRipple(e);
  clearTimeout(changeLevels);

  changeLevels = setTimeout(() => {
    const selectedDifficulty = quizType.value;
    const selectedAmount = quizAmount.value;
    const selectCategory = quizCategory.value;

    if (!selectedDifficulty || !selectedAmount || !selectCategory) {
      alert("Please select difficulty, category and question amount!");
      return;
    }

    axios
      .get(
        `https://opentdb.com/api.php?amount=${selectedAmount}&category=${selectCategory}&difficulty=${selectedDifficulty}&type=multiple`
      )
      .then((response) => {
        questions = response.data.results.map((question, index) => ({
          number: index + 1,
          question: question.question,
          options: [...question.incorrect_answers, question.correct_answer].sort(
            () => Math.random() - 0.5
          ),
          answer: question.correct_answer,
        }));
        modal.classList.toggle("hide");
        // Show start button container if you were hiding it elsewhere
        startBtn.classList.toggle("display-start");
      })
      .catch(() => {
        console.error("Something went wrong");
      });
  }, 100);
});

// ====== Quiz Elements ======
const infoBox = document.querySelector(".info-box");
const exitBtn = infoBox.querySelector(".quit");
const continueBtn = infoBox.querySelector(".restart");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");
const optionList = document.querySelector(".option-list");
const timeLine = document.querySelector(".time-line");
const timeText = document.querySelector(".time-left-text");
const timeCount = document.querySelector(".timer-second");
const restartQuizBtn = resultBox.querySelector(".restart");
const quitQuizBtn = resultBox.querySelector(".quit");
const nextBtn = document.querySelector(".next-btn");
const totalQuestion = document.querySelector(".total-question");

let timeValue = 20;
let questionIndex = 0;
let questionNumber = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

// ====== Start / Flow ======
startBtn.onclick = () => {
  if (questions.length === 0) {
    alert(
      "Please select questions difficulty level, amount, and category from settings!"
    );
    return;
  }
  infoBox.classList.add("activeInfo");
  animateIn(infoBox);
};

exitBtn.onclick = (e) => {
  addRipple(e);
  infoBox.classList.remove("activeInfo");
};

continueBtn.onclick = (e) => {
  addRipple(e);
  infoBox.classList.remove("activeInfo");
  quizBox.classList.add("activeQuiz");
  animateIn(quizBox);
  startQuiz();
};

restartQuizBtn.onclick = (e) => {
  addRipple(e);
  resultBox.classList.remove("activeResult");
  quizBox.classList.add("activeQuiz");
  animateIn(quizBox);
  resetQuiz();
  startQuiz();
};

quitQuizBtn.onclick = (e) => {
  addRipple(e);
  window.location.reload();
};

nextBtn.onclick = (e) => {
  addRipple(e);
  nextQuestion();
};

// ====== Core ======
function startQuiz() {
  showQuestions(questionIndex);
  questionCounter(questionNumber);
  startTimer(timeValue);
  startTimerLine(widthValue);
}

function resetQuiz() {
  timeValue = 20;
  questionIndex = 0;
  questionNumber = 1;
  userScore = 0;
  widthValue = 0;
  timeLine.style.width = "0%";
}

function nextQuestion() {
  if (questionIndex < questions.length - 1) {
    questionIndex++;
    questionNumber++;
    updateQuiz();
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    showResult();
  }
}

function updateQuiz() {
  showQuestions(questionIndex);
  questionCounter(questionNumber);
  clearInterval(counter);
  clearInterval(counterLine);
  startTimer(timeValue);
  startTimerLine(widthValue);
  timeText.innerHTML = "Time Left";
  nextBtn.classList.remove("show");
}

function showQuestions(index) {
  const questionText = document.querySelector(".question-text");
  const questionTag = `<span>${questions[index].number}. ${questions[index].question}</span>`;
  const optionTag = questions[index].options
    .map((option) => `<div class="option"><span>${option}</span></div>`)
    .join("");

  questionText.innerHTML = questionTag;
  optionList.innerHTML = optionTag;

  // animate entry
  questionText.classList.remove("q-enter");
  optionList.classList.remove("q-enter");
  void questionText.offsetWidth; // reflow to restart animation
  questionText.classList.add("q-enter");
  optionList.classList.add("q-enter");

  optionList.querySelectorAll(".option").forEach((option) => {
    option.onclick = () => optionSelected(option);
  });
}

function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  const userAnswer = answer.textContent;
  const correctAnswer = questions[questionIndex].answer;

  if (userAnswer === correctAnswer) {
    userScore++;
    answer.classList.add("correct");
    answer.insertAdjacentHTML("beforeend", trueIcon);
  } else {
    answer.classList.add("incorrect");
    answer.insertAdjacentHTML("beforeend", falseIcon);
    markCorrectAnswer(correctAnswer);
  }

  disableOptions();
  nextBtn.classList.add("show");
}

function markCorrectAnswer(correctAnswer) {
  for (let i = 0; i < optionList.children.length; i++) {
    if (optionList.children[i].textContent === correctAnswer) {
      optionList.children[i].classList.add("correct");
      optionList.children[i].insertAdjacentHTML("beforeend", trueIcon);
    }
  }
}

function disableOptions() {
  for (let i = 0; i < optionList.children.length; i++) {
    optionList.children[i].classList.add("disabled");
  }
}

// ====== High Score ======
document.addEventListener("DOMContentLoaded", () => {
  displayHighScore();
});

function showResult() {
  const scoreText = resultBox.querySelector(".score-text");

  infoBox.classList.remove("activeInfo");
  quizBox.classList.remove("activeQuiz");
  resultBox.classList.add("activeResult");
  animateIn(resultBox);

  const msg =
    userScore > 3
      ? "congrats! 🎉"
      : userScore > 1
      ? "nice 👏"
      : "sorry 🥲";

  scoreText.innerHTML = `<span>${msg}, You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`;

  const savedScore = localStorage.getItem("quizScore");
  if (!savedScore || userScore > parseInt(savedScore)) {
    localStorage.setItem("quizScore", userScore);
    displayHighScore();
  }
}

function displayHighScore() {
  const savedScore = localStorage.getItem("quizScore");
  if (savedScore) {
    const highScore = document.querySelector("#highScore");
    highScore.innerHTML = `Your high score: ${savedScore}`;
  }
}

// ====== Timers ======
function startTimer(time) {
  clearInterval(counter);
  counter = setInterval(() => {
    timeCount.textContent = time > 9 ? time : `0${time}`;
    time--;
    if (time < 0) {
      clearInterval(counter);
      timeText.innerHTML = "Time Off";
      markCorrectAnswer(questions[questionIndex].answer);
      disableOptions();
      nextBtn.classList.add("show");
      setTimeout(() => nextQuestion(), 1200);
    }
  }, 1000);
}

function startTimerLine(time) {
  clearInterval(counterLine);
  const totalTime = 720;
  counterLine = setInterval(() => {
    time += 1;
    const progressPercentage = (time / totalTime) * 100;
    timeLine.style.width = `${progressPercentage}%`;
    if (time >= totalTime) {
      clearInterval(counterLine);
      timeLine.style.width = "100%";
    }
  }, 30);
}

// ====== Footer counter ======
function questionCounter(index) {
  const totalQuestionText = `<div class='numberOfQuestion'><h3><p>${index}</p> of <p>${questions.length}</p></h3></div>`;
  totalQuestion.innerHTML = totalQuestionText;
}

// ====== Icons ======
const trueIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const falseIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// ====== Micro-animations helpers ======
function animateIn(el){
  el.style.willChange = "transform, opacity";
  el.classList.add("q-enter");
  setTimeout(()=> (el.style.willChange = "auto"), 400);
}

// click ripple for any button-like element
function addRipple(e){
  const target = e.currentTarget;
  const rect = target.getBoundingClientRect();
  const span = document.createElement("span");
  span.className = "ripple";
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size/2;
  const y = e.clientY - rect.top - size/2;
  span.style.width = span.style.height = `${size}px`;
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  target.appendChild(span);
  setTimeout(()=> span.remove(), 650);
}

// Enable ripple on common buttons created later as well
document.addEventListener("click", (e)=>{
  const btnLike = e.target.closest(".btn, .apply-btn, .next-btn, .buttons button, .settings-btn, .info-box .buttons button");
  if(btnLike){ addRipple(e); }
}, {capture:true});
