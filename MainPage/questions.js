let questions = {
    "matte": [
        {
            label: "Vad är värdet av 3x + 5 om x = 2?",
            questions: ["11", "10", "9", "8"],
            rightAnswer: 0
        },
        {
            label: "Lös ekvationen: 2x + 4 = 10",
            questions: ["2", "3", "4", "5"],
            rightAnswer: 1
        },
        {
            label: "Vad är 25 % av 200?",
            questions: ["25", "40", "50", "75"],
            rightAnswer: 2
        },
        {
            label: "Vilket uttryck är förenklat korrekt?",
            questions: ["2a + 3a = 5a", "2a · 3a = 5a", "2a + a = 2a", "a · a = 2a"],
            rightAnswer: 0
        },
        {
            label: "Vad är lutningen (k-värdet) i funktionen y = 3x + 2?",
            questions: ["2", "3", "5", "x"],
            rightAnswer: 1
        },
        {
            label: "Vad är konstanten (m-värdet) i y = -2x + 7?",
            questions: ["-2", "2", "7", "-7"],
            rightAnswer: 2
        },
        {
            label: "Lös ekvationen: x² = 16",
            questions: ["4", "-4", "±4", "8"],
            rightAnswer: 2
        },
        {
            label: "Vad är omkretsen av en rektangel med sidorna 5 cm och 3 cm?",
            questions: ["8 cm", "15 cm", "16 cm", "30 cm"],
            rightAnswer: 2
        },
        {
            label: "Vad är arean av en triangel med bas 10 cm och höjd 4 cm?",
            questions: ["20 cm²", "40 cm²", "10 cm²", "80 cm²"],
            rightAnswer: 0
        },
        {
            label: "Förenkla uttrycket: 4(x + 3)",
            questions: ["4x + 3", "4x + 12", "x + 12", "7x"],
            rightAnswer: 1
        },
        {
            label: "Vad är 2³?",
            questions: ["6", "8", "9", "16"],
            rightAnswer: 1
        },
        {
            label: "Hur många procent är 30 av 150?",
            questions: ["15 %", "20 %", "25 %", "30 %"],
            rightAnswer: 1
        },
        {
            label: "Vilket tal är störst?",
            questions: ["0,25", "1/3", "0,2", "1/5"],
            rightAnswer: 1
        },
        {
            label: "Vad är värdet av |−7|?",
            questions: ["-7", "7", "0", "14"],
            rightAnswer: 1
        },
        {
            label: "Lös ekvationen: 5x = 20",
            questions: ["2", "3", "4", "5"],
            rightAnswer: 2
        },
        {
            label: "Vad är medelvärdet av talen 2, 4 och 6?",
            questions: ["3", "4", "5", "6"],
            rightAnswer: 1
        },
        {
            label: "Vad händer med y-värdet om x ökar i y = 2x?",
            questions: [
                "Det minskar",
                "Det är konstant",
                "Det ökar",
                "Det blir 0"
            ],
            rightAnswer: 2
        },
        {
            label: "Vilket är ett linjärt uttryck?",
            questions: ["x² + 2", "2x + 1", "x · x", "1/x"],
            rightAnswer: 1
        },
        {
            label: "Vad är 10⁻¹?",
            questions: ["10", "1", "0,1", "0,01"],
            rightAnswer: 2
        },
        {
            label: "Lös: x + 7 = 3",
            questions: ["-10", "-4", "4", "10"],
            rightAnswer: 1
        }
    ]
}

function modifyQuestions(topic, newValue) {
    localStorage.setItem(`modifiedQuestions-${topic}`, JSON.stringify(newValue))
    loadModifiedQuestions()
}

function loadModifiedQuestions() {
    for ((topic) in questions) {
        let modifiedQuestions = localStorage.getItem(`modifiedQuestions-${topic}`)
        if (modifiedQuestions) {
            modifiedQuestions = JSON.parse(modifiedQuestions)
            if (modifiedQuestions != null) {
                questions[topic] = modifiedQuestions
            }
        }
    }
    loadModal()
}