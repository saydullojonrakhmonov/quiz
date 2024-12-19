const settingsBtn = document.querySelector(".settings-btn");
const modal = document.getElementById("modal");
const applyBtn = document.querySelector(".apply-btn");
const quizType = document.getElementById("quiz-types");
const quizAmount = document.getElementById("quiz-amount");

// Toggle modal visibility
settingsBtn.addEventListener("click", () => {
  modal.classList.toggle("hide");
});

// Debounce to prevent excessive API calls
let debounceTimeout;

applyBtn.addEventListener("click", () => {
  // Clear any existing debounce timeout
  clearTimeout(debounceTimeout);

  // Set a new debounce timeout
  debounceTimeout = setTimeout(() => {
    const selectedDifficulty = quizType.value;
    const selectedAmount = quizAmount.value;

    // API call
    axios
      .get(
        `https://opentdb.com/api.php?amount=${selectedAmount}&category=21&difficulty=${selectedDifficulty}&type=multiple`
      )
      .then((response) => {
        const responseData = response.data;
        console.log("Quiz Data:", responseData.results);

        // Close the modal after applying settings
        modal.classList.toggle("hide");

        // You can process or display the quiz data here
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, 100); 
});
