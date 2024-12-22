const settingsBtn = document.querySelector(".settings-btn");
const modal = document.getElementById("modal");
const applyBtn = document.querySelector(".apply-btn");
const quizType = document.getElementById("quiz-types");
const quizAmount = document.getElementById("quiz-amount");
const quizCategory = document.getElementById("quiz-category");

settingsBtn.addEventListener('click', () =>{
  modal.classList.toggle('hide')
})

let changeLevels;