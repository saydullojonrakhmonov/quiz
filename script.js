const settingsBtn = document.querySelector(".settings-btn");
const modal = document.getElementById("modal");
const applyBtn = document.querySelector(".apply-btn");
const quizType = document.getElementById("quiz-types");
const quizAmount = document.getElementById("quiz-amount");
const quizCategory = document.getElementById("quiz-category");

let changeLevels;
let questions = []
settingsBtn.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

applyBtn.addEventListener("click", () => {
  clearTimeout(changeLevels);

  changeLevels = setTimeout(() => {
    const selectedDifficulty = quizType.value;
    const selectedAmount = quizAmount.value;
    const selectCategory = quizCategory.value;

    if (!selectedDifficulty || !selectedAmount) {
      alert("Please select difficulty and question amount!");
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
          options: [
            ...question.incorrect_answers,
            question.correct_answer,
          ].sort(() => Math.random() - 0.5),
          answer: question.correct_answer,
        }));
        console.log("Quiz Data:", questions);
        modal.classList.toggle("hide");
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, 100);
});

const startBtn = document.querySelector(".start-btn");
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
const bottomQuestionCounter = document.querySelector(".total-question");

let timeValue = 20;
let questionCount = 0;
let questionNumber = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

startBtn.onclick = () => {
  if (questions.length === 0) {
    alert(
      "Please select questions difficulty level, amount, and category from settings!"
    );
    return;
  }
  infoBox.classList.add("activeInfo");
};

exitBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
};

continueBtn.onclick = () => {
  infoBox.classList.remove("activeInfo");
  quizBox.classList.add("activeQuiz");
  startQuiz();
};

restartQuizBtn.onclick = () => {
  resultBox.classList.remove("activeResult");
  quizBox.classList.add("activeQuiz");
  resetQuiz();
  startQuiz();
};

quitQuizBtn.onclick = () => {
  window.location.reload();
};

nextBtn.onclick = () => {
  nextQuestion();
};

function startQuiz() {
  showQuestions(questionCount);
  questionCounter(questionNumber);
  startTimer(timeValue);
  startTimerLine(widthValue);
}

function resetQuiz() {
  timeValue = 20;
  questionCount = 0;
  questionNumber = 1;
  userScore = 0;
  widthValue = 0;
}

function nextQuestion() {
  if (questionCount < questions.length - 1) {
    questionCount++;
    questionNumber++;
    updateQuiz();
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    showResult();
  }
}

function updateQuiz() {
  showQuestions(questionCount);
  questionCounter(questionNumber);
  clearInterval(counter);
  clearInterval(counterLine);
  startTimer(timeValue);
  startTimerLine(widthValue);
  timeText.innerHTML = "Time Left";
  nextBtn.classList.remove("show");
}

function showQuestions(index) {
  const queText = document.querySelector(".question-text");
  let questionTag = `<span> ${questions[index].number}.  ${questions[index].question} </span>`;
  let optionTag = questions[index].options
    .map((option) => `<div class="option"><span>${option}</span></div>`)
    .join("");
  queText.innerHTML = questionTag;
  optionList.innerHTML = optionTag;

  optionList.querySelectorAll(".option").forEach((option) => {
    option.onclick = () => optionSelected(option);
  });
}

function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  let userAnswer = answer.textContent;
  let correctAnswer = questions[questionCount].answer;

  if (userAnswer === correctAnswer) {
    userScore++;
    answer.classList.add("correct");
    answer.insertAdjacentHTML("beforeend", trueIconTag);
  } else {
    answer.classList.add("incorrect");
    answer.insertAdjacentHTML("beforeend", falseIconTag);
    markCorrectAnswer(correctAnswer);
  }

  disableOptions();
  nextBtn.classList.add("show");
}

function markCorrectAnswer(correctAnswer) {
  for (let i = 0; i < optionList.children.length; i++) {
    if (optionList.children[i].textContent === correctAnswer) {
      optionList.children[i].classList.add("correct");
      optionList.children[i].insertAdjacentHTML("beforeend", trueIconTag);
    }
  }
}

function disableOptions() {
  for (let i = 0; i < optionList.children.length; i++) {
    optionList.children[i].classList.add("disabled");
  }
}

function showResult() {
    infoBox.classList.remove("activeInfo");
    quizBox.classList.remove("activeQuiz");
    resultBox.classList.add("activeResult");
    const scoreText = resultBox.querySelector(".score-text");
    
    let scoreTag =
      userScore > 3
        ? `<span>and congrats! 🎉, You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`
        : userScore > 1
        ? `<span>nice 👏, You got <p>${userScore}</p> out of <p>${questions.length}</p></span>`
        : `<span>sorry 🥲, You got only <p>${userScore}</p> out of <p>${questions.length}</p></span>`;
    
    scoreText.innerHTML = scoreTag;
  
    // Check if the current score is higher than the saved high score
    const savedScore = localStorage.getItem("quizScore");
    if (!savedScore || userScore > parseInt(savedScore)) {
      // If no saved score or current score is higher, update the high score
      localStorage.setItem("quizScore", userScore);
      displayHighScore();
    }
  }
  
  function displayHighScore() {
    const savedScore = localStorage.getItem("quizScore");
    if (savedScore) {
      const highScore = document.querySelector("#highScore");
      highScore.textContent = `Your high score: ${savedScore}`;
    }
  }
  

function startTimer(time) {
  counter = setInterval(() => {
    timeCount.textContent = time > 9 ? time : `0${time}`;
    time--;
    if (time < 0) {
      clearInterval(counter);
      timeText.innerHTML = "Time Off";
      markCorrectAnswer(questions[questionCount].answer);
      disableOptions();
      nextBtn.classList.add("show");
      setTimeout(() => nextQuestion(), 3000); 
    }
  }, 1000);
}

function startTimerLine(time) {
  const totalTime = 720;
  counterLine = setInterval(() => {
    time += 1;
    let progressPercentage = (time / totalTime) * 100;
    timeLine.style.width = `${progressPercentage}%`;
    if (time >= totalTime) {
      clearInterval(counterLine);
      timeLine.style.width = "100%";
    }
  }, 30);
}

function questionCounter(index) {
  let totalQuestionCountTag = `<div class='numberOfQuestion'><h3><p> ${index}  </p>     of    <p> ${questions.length} </p></h3></div>`;
  bottomQuestionCounter.innerHTML = totalQuestionCountTag;
}

const trueIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const falseIconTag =
  '<div class="icon cross"><i class="fas fa-times"></i></div>';
