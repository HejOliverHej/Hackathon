const chosenTopic = localStorage.getItem("chosenTopic")
if (!chosenTopic) {
    location.pathname = "/MainPage/UserPick.html"
}

const chosenTopicEl = document.getElementById("chosenTopic")
if (chosenTopic) {
    chosenTopicEl.textContent = chosenTopic
}

const chosenTopicBtnEl = document.getElementById("changeTopicBtn")
chosenTopicBtnEl.addEventListener("click", function(event) {
    location.pathname = "/MainPage/UserPick.html"
})

const xpEl = document.getElementById("xp")
const xpNextEl = document.getElementById("xpNext")
const levelEl = document.getElementById("level")
const streakEl = document.getElementById("streak")
const nextBtnEl = document.getElementById("nextBtn")

const questionTextEl = document.getElementById("questionText")
const questionIndexEl = document.getElementById("questionIndex")
const questionTotalEl = document.getElementById("questionTotal")

// localStorage.clear()

let xpValue = localStorage.getItem("xp") || 0
let levelValue = localStorage.getItem("level") || 1
let streakValue = localStorage.getItem("streak") || 0
let lastQuestionValue = localStorage.getItem("lastQuestion") || 0 // last question answered
levels = levels // loaded from levels.js
questions = questions // loaded from questions.js
let currentTopicQuestions;
let currentTopicQuestion;
const answersContainerEl = document.getElementById("answersContainer")


function updateStatElements() {
    xpEl.textContent = xpValue;
    xpNextEl.textContent = levels[levelValue]
    levelEl.textContent = levelValue;
    streakEl.textContent = streakValue;
}
function levelUp(newXpValue) {
    let xpValueOver = newXpValue - levels[levelValue];
    localStorage.setItem("xp", xpValueOver)
    console.log(newXpValue)
    xpValue = xpValueOver;
    levelValue = levelValue + 1;
}
function addXp(amount) {
    let newXpValue = xpValue + amount;
    if (newXpValue > levels[levelValue]) {
        levelUp(newXpValue)
    } else {
        localStorage.setItem("xp", newXpValue)
        xpValue = newXpValue
    }
}

function getQuestions(topic) {
    const topicQuestions = questions[topic];
    if (!topicQuestions) {
        return null;
    }

    return topicQuestions;
}
function loadQuestions() {
    currentTopicQuestions = getQuestions(chosenTopic);
    console.log(chosenTopic)
    if (currentTopicQuestions == null) {
        return;
    }
    currentTopicQuestion = -1;

    answerQuestion(false, true);
}

function answerQuestion(rightAnswer = false, firstQuestion = false) {
    currentTopicQuestion = currentTopicQuestion + 1;
    if (currentTopicQuestions[currentTopicQuestion] == null) {
        console.log("null question")
        return;
    }
    localStorage.setItem("streak", streakValue)
    updateStatElements()
    

    while (answersContainerEl.firstChild) {
        answersContainerEl.removeChild(answersContainerEl.firstChild);
    }

    const topicQuestion = currentTopicQuestions[currentTopicQuestion];
    questionIndexEl.textContent = currentTopicQuestion + 1;
    questionTotalEl.textContent = currentTopicQuestions.length
    questionTextEl.textContent = topicQuestion.label;


    function onClickNextBtn(rightAnswer) {
        nextBtnEl.disabled = true;
        console.log(rightAnswer);
        if(rightAnswer){
            answerQuestion(rightAnswer)
        }
    }

    for (let index = 0; index < topicQuestion.questions.length; index++) {
        const question = topicQuestion.questions[index];
        let divEl = document.createElement("div")
        divEl.classList.add("answer")
        divEl.textContent = question

        divEl.addEventListener("click", function(event) {
            const rightAnswer = topicQuestion.rightAnswer == index;
            if (rightAnswer == true) {
                console.log("Correct answer")
                streakValue = streakValue + 1;
                divEl.classList.add("correct")

                addXp(10.0);
                nextBtnEl.disabled = false;
                
                function handleNextBtnClick() {
                    onClickNextBtn(rightAnswer)
                    nextBtnEl.removeEventListener("click", handleNextBtnClick)
                }
                nextBtnEl.addEventListener("click", handleNextBtnClick)            
            } else {
                console.log("Wrong answer")
                streakValue = 0;
                divEl.classList.add("false")
            }

          
        })
        answersContainerEl.append(divEl)
    }
}

const totalQuestionsEl = document.getElementById("totalQuestions")
const currentQuestionsEl = document.getElementById("currentQuestions")
function loadModal() {
    totalQuestionsEl.textContent = currentTopicQuestions.length;

    while (currentQuestionsEl.firstChild) {
        currentQuestionsEl.removeChild(currentQuestionsEl.firstChild);
    }

    for (let index = 0; index < currentTopicQuestions.length; index++) {
        const question = currentTopicQuestions[index];

        const alternativesEl = document.createElement("div")
        alternativesEl.className = "alternatives"

        let selectedBox = question.rightAnswer;
        for (let index2 = 0; index2 < question.questions.length; index2++) {
            const alternative = question.questions[index2];
            const labelInputEl = document.createElement("label")
            labelInputEl.for = `alternative-${index}-${index2}-input`
            labelInputEl.textContent = `${index2 + 1}: `

            const inputEl = document.createElement("input")
            inputEl.type = "text"
            inputEl.name = `alternative-${index}-${index2}-input`
            inputEl.id = `alternative-${index}-${index2}-input`
            inputEl.value = alternative

            inputEl.addEventListener("change", function(event) {
                currentTopicQuestions[index].questions[index2] = inputEl.value;
                modifyQuestions(chosenTopic, currentTopicQuestions);
            })

            const labelCheckboxEl = document.createElement("label")
            labelCheckboxEl.for = `alternative-${index}-${index2}-checkbox`
            labelCheckboxEl.textContent = `Rätt Svar:`

            const checkboxEl = document.createElement("input")
            checkboxEl.type = "checkbox"
            checkboxEl.name = `alternative-${index}-${index2}-checkbox`
            checkboxEl.id = `alternative-${index}-${index2}-checkbox`
            if (index2 == selectedBox) {
                checkboxEl.checked = true
            }
            checkboxEl.addEventListener("change", function(event) {
                if (selectedBox === index2) {
                    checkboxEl.checked = true;
                    return;
                }

                selectedBox = index2;

                for (let i = 0; i < alternativesEl.children.length; i++) {
                    const el = alternativesEl.children[i].children[3];
                    el.checked = i === selectedBox;
                }

                currentTopicQuestions[index].rightAnswer = selectedBox;
                modifyQuestions(chosenTopic, currentTopicQuestions);
            })


            const divEl = document.createElement("div")
            divEl.append(labelInputEl, inputEl, labelCheckboxEl, checkboxEl)
            alternativesEl.append(divEl)
        }

        const pEl = document.createElement("p")
        pEl.innerHTML = `${index + 1}: Fråga: "<span id="label">${question.label}</span>`
        
        const divEl = document.createElement("div")
        divEl.className = "question"
        const hrEl = document.createElement("hr")

        divEl.append(pEl, alternativesEl)
        currentQuestionsEl.append(divEl, hrEl)
    }
}

loadQuestions();
updateStatElements();
loadModal();