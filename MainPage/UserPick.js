const chosenTopic = localStorage.getItem("chosenTopic")
const chosenTopicEl = document.getElementById("chosenTopic")
if (chosenTopic) {
    chosenTopicEl.textContent = chosenTopic
}

const cardBodiesButton = document.querySelectorAll(".card-body button")
for (let index = 0; index < cardBodiesButton.length; index++) {
    const button = cardBodiesButton[index];
    const topic = button.dataset.topic;

    button.onclick = function() {
        localStorage.setItem("chosenTopic", topic)
        chosenTopicEl.textContent = topic
    }
}

const goBackBtnEl = document.getElementById("goBackBtn")
goBackBtnEl.addEventListener("click", function(event) {
    location.pathname = "/MainPage/"
})