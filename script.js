// Selecting modal
const settingsBtn = document.querySelector(".settings-btn");
const modal = document.getElementById("modal");
const applyBtn = document.querySelector(".apply-btn");
const quizType = document.getElementById("quiz-types");
const quizAmount = document.getElementById("quiz-amount");
const quizCategory = document.getElementById("quiz-category");

// Selecting questions container
const startBtn = document.getElementById("start-btn");
const questionsBox = document.querySelector(".question-box");
const questionTitle = document.querySelector(".question-title");
const exitBtn = document.getElementById("exit");
const starQuiztBtn = document.getElementById("start");
const quizBox = document.getElementById("quiz-box");
const timeLeftText = document.getElementById("time-left-text");
const secondTimer = document.getElementById("timer-second");
const timeLine = document.getElementById("time-line");
const optionsList = document.getElementById("options-list");
const resultBox = document.getElementById("result-box");
const totalQuestion = document.getElementById("total-questions");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const quitBtn = document.getElementById("quit-btn");

settingsBtn.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

let changeLevels;

applyBtn.addEventListener("click", () => {
  clearInterval(changeLevels);

  changeLevels = setTimeout(() => {
    const selectedDifficulty = quizType.value;
    const selectedAmount = quizAmount.value;
    const selectedCategory = quizCategory.value;

    if (!selectedDifficulty || !selectedAmount || !selectedCategory) {
      alert(
        `Plese select difficulty level level, questions amount and category`
      );
      return;
    }

    axios
      .get(
        `https://opentdb.com/api.php?amount=${selectedAmount}&category=${selectCategory}&difficulty=${selectedDifficulty}&type=multiple`
      )
      .then((res) => {
        questions = res.data.results.map((question, index) => ({
          number: index + 1,
          question: question.question,
          options: [...question.incorrect_answer, question.correct_answer].sort(
            () => Math.random() - 0.5
          ),
          answer: question.correct_answer,
        }));
        modal.classList.toggle("hide");
      })
      .catch((err) => console.log(`Error ${err}`));
  }, 100);
});


let timeValue = 20;
let questionCount = 0;
let questionNumber = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

startBtn.addEventListener('click', () =>{
  if (questions.length() == 0 ) {
    alert("Please select questions difficulty level, amount and category from settings!")
    return
  }
  quizBox.classList.add('active-info')
})


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

// Reset Quiz
function resetQuiz() {
  timeValue = 20;
  questionCount = 0;
  questionNumber = 1;
  userScore = 0;
  widthValue = 0;
}

// Move to the next question
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



