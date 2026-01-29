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

let xpValue = parseInt(localStorage.getItem("xp")) || 0
let levelValue = parseInt(localStorage.getItem("level")) || 1
let streakValue = parseInt(localStorage.getItem("streak")) || 0
let lastQuestionValue = parseInt(localStorage.getItem("lastQuestion")) || 0 // last question answered
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
    console.log(newXpValue)
    if (newXpValue >= levels[levelValue]) {
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
    if (currentTopicQuestions == null) {
        return;
    }

    if (lastQuestionValue && ((lastQuestionValue + 1) < currentTopicQuestions.length)) {
        currentTopicQuestion = lastQuestionValue
    } else {
        currentTopicQuestion = -1;
    }

    answerQuestion(false, true);
}

function answerQuestion(rightAnswer = false, firstQuestion = false) {
    currentTopicQuestion = currentTopicQuestion + 1;
    if (currentTopicQuestions[currentTopicQuestion] == null) {
        currentTopicQuestion = -1;
        answerQuestion(false, true)
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
        answerQuestion(rightAnswer)
    }

    const divs = []
    for (let index = 0; index < topicQuestion.questions.length; index++) {
        const question = topicQuestion.questions[index];
        let divEl = document.createElement("div")
        divEl.classList.add("answer")
        divEl.textContent = question

        function handleAnswerBtn() {
            const rightAnswer = topicQuestion.rightAnswer == index;
            if (rightAnswer == true) {
                console.log("Correct answer")
                streakValue = streakValue + 1;
                divEl.classList.add("correct")

                addXp(10.0);         
                updateStatElements()
            } else {
                console.log("Wrong answer")
                streakValue = 0;
                divEl.classList.add("false")
            }

            localStorage.setItem("lastQuestion", currentTopicQuestion)
            lastQuestionValue = currentTopicQuestion

            for (let index2 = 0; index2 < divs.length; index2++) {
                const div = divs[index2];
                div.classList.add("disabled")
                div.style.pointerEvents = "none"
            }

            nextBtnEl.disabled = false;
            
            function handleNextBtnClick() {
                onClickNextBtn(rightAnswer)
                nextBtnEl.removeEventListener("click", handleNextBtnClick)
            }
            nextBtnEl.addEventListener("click", handleNextBtnClick)   
        }

        divEl.addEventListener("click", handleAnswerBtn)
        divs.push(divEl)
        answersContainerEl.append(divEl)
    }
}

const totalQuestionsEl = document.getElementById("totalQuestions")
const currentQuestionsEl = document.getElementById("currentQuestions")
const modalQuestionsEl = document.querySelector(".modalQuestions")
const closeEl = document.querySelector(".modalQuestions .top .close")
const openQuestionsBtnEl = document.getElementById("openQuestionsBtn")
const aiPromptSendBtnEl = document.getElementById("ai-prompt-send")
const aiPromptInputEl = document.getElementById("ai-prompt-input")
const aiPromptLoaderEl = document.getElementById("ai-prompt-loader")

openQuestionsBtnEl.addEventListener("click", function(event) {
    modalQuestionsEl.classList.add("visible")
})
closeEl.addEventListener("click", function(event) {
    modalQuestionsEl.classList.remove("visible")
})

aiPromptSendBtnEl.addEventListener("click", async function(event) {
    if (aiPromptInputEl.value.length < 5) {
        return
    }
    aiPromptInputEl.disabled = true
    aiPromptSendBtnEl.disabled = true
    aiPromptSendBtnEl.pointerEvents = "none"

    console.log("add")
    aiPromptLoaderEl.classList.add("visible")

    const response = await generateQuestions(aiPromptInputEl.value)
    
    aiPromptInputEl.disabled = false
    aiPromptSendBtnEl.disabled = false
    aiPromptSendBtnEl.pointerEvents = "all"

    aiPromptLoaderEl.classList.remove("visible")

    console.log(response)
})


const newQuestionInput = document.getElementById("new-question-input")
const textInputs = document.querySelectorAll(".newQuestion .alternatives div input[type=text]")
const createQuestionBtn = document.getElementById("createQuestionBtn")

createQuestionBtn.addEventListener("click", function(event) {
    const label = newQuestionInput.value;
    const questions = [];
    for (let index = 0; index < textInputs.length; index++) {
        const textInput = textInputs[index];
        questions.push(textInput.value)
    }
    const rightAnswer = selectedBox;
    const question = {
        label: label,
        questions: questions,
        rightAnswer: rightAnswer
    }
    currentTopicQuestions.push(question)
    modifyQuestions(chosenTopic, currentTopicQuestions)
})

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

        const deleteBtnEl = document.createElement("button")
        deleteBtnEl.textContent = "Ta Bort"
        deleteBtnEl.addEventListener("click", function (event) {
            currentTopicQuestions.splice(index, 1)

            currentTopicQuestion = currentTopicQuestion - 1
            loadModal()
            modifyQuestions(chosenTopic, currentTopicQuestions)
        })


        const divEl = document.createElement("div")
        divEl.className = "top"
        divEl.append(pEl, deleteBtnEl)
        
        const divEl2 = document.createElement("div")
        divEl2.className = "question"
        const hrEl = document.createElement("hr")

        divEl2.append(divEl, alternativesEl)
        currentQuestionsEl.append(divEl2, hrEl)
    }

    const checkBoxes = document.querySelectorAll(".newQuestion .alternatives div input[type=checkbox]")
    
    let selectedBox = 0;
    checkBoxes[0].checked = true
    for (let index = 0; index < checkBoxes.length; index++) {
        const checkBox = checkBoxes[index];
        checkBox.addEventListener("change", function() {
            if (selectedBox === index) {
                checkBox.checked = true;
                return;
            }

            selectedBox = index;

            for (let i = 0; i < checkBoxes.length; i++) {
                const el = checkBoxes[i];
                el.checked = i === selectedBox;
            }
        })
    }
}

function modifyQuestions(topic, newValue) {
    localStorage.setItem(`modifiedQuestions-${topic}`, JSON.stringify(newValue))
    loadModifiedQuestions()
}

function loadModifiedQuestions() {
    for (const topic in questions) {
        let modifiedQuestions = localStorage.getItem(`modifiedQuestions-${topic}`)
        if (modifiedQuestions) {
            modifiedQuestions = JSON.parse(modifiedQuestions)
            if (modifiedQuestions != null) {
                currentTopicQuestions = modifiedQuestions
            }
        }
    }
    answerQuestion(false, true);
    loadModal()
}


async function generateQuestions(prompt) {
    try {
        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY,
                },
                body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `kan du ge mig instruderingsfrågor ämnet som kommer nedan och ge mig det i en json array utifrån denna template och ge mig ingen text, bara frågorna, ge mig inte med \`\`\` formattering tack, sätt också. [ { "label": "Vilket ord betyder samma som “happy”?", "questions": ["sad", "angry", "glad", "tired"], "rightAnswer": 2 } ] ämne: "${prompt}"`,
                            },
                        ],
                    },
                ],
            }),
        });

        const data = await res.json();
        console.log(data);
        let jsonText = data.candidates[0].content.parts[0].text; // vi ber att det fungerar, fungerar det inte så vet jag ej
        console.log(jsonText)
        const jsonParsed = JSON.parse(jsonText)
        console.log(jsonParsed)
        for (let index = 0; index < jsonParsed.length; index++) {
            const question = jsonParsed[index];
            console.log(question)   
            currentTopicQuestions.push(question)
        }
        modifyQuestions(chosenTopic, currentTopicQuestions)
        return jsonParsed

    } catch (err) {
        console.error(err);
    }
}
// generateQuestions("plugga SO, första världskriget");


loadQuestions();
loadModifiedQuestions();
updateStatElements();
// loadModal();

console.log(currentTopicQuestions)