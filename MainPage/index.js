const chosenTopic = localStorage.getItem("chosenTopic")

const chosenTopicEl = document.getElementById("chosenTopic")
if (chosenTopic) {
    chosenTopicEl.textContent = chosenTopic
}

const chosenTopicBtnEl = document.getElementById("changeTopicBtn")
chosenTopicBtnEl.addEventListener("click", function(event) {
    location.pathname = "/MainPage/UserPick.html"
})