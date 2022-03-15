// Link HTML elements to JS
var highScoresDiv = document.getElementById('highScoresDiv');
var timerDiv = document.getElementById('timerDiv');
var quizAreaDiv = document.getElementById('quizAreaDiv');
var questionDiv = document.getElementById('questionDiv');
var answerOptionsDiv = document.getElementById('answerOptionsDiv');
var answerOptionsUL = document.getElementById('answerOptionsUL');
var startButtonDiv = document.getElementById('startButtonDiv');
var correctOrIncorrectDiv = document.getElementById('correctOrIncorrectDiv');
var formDiv = document.getElementById("formDiv");
var initials = document.getElementById("initials");
var submitInitialsButton = document.getElementById("submitInitialsButton");
var highScoresDisplayDiv = document.getElementById('highScoresDisplayDiv');
var highScoresDisplayUL = document.getElementById('highScoresDisplayUL');
var backButton = document.getElementById('backButton');
var clearButton = document.getElementById('clearButton');

// Declare Global Variables---------------------------------------------------------------------

var timerCount = 60;
var isWin = false;
var questionIndex = 0;
var scoreCount = 0;
var playerInitials = "";
var allHighScores = {};
var previousHighScores = {};
var thisHighScore = {};
var gameOver = false;

//  Create a set of questions for use
//  Note: Questions courtesy of w3schools.com
var question1 = {
    question: "Inside which HTML element do we put the JavaScript?",
    answer: "<script>",
    fake1: "<js>",
    fake2: "<scripting>",
    fake3: "<javascript>"
}

var question2 = {
    question: "Where is the correct place to insert a JavaScript?",
    answer: "<body>",
    fake1: "<header>",
    fake2: "<script>",
    fake3: "<footer>"
}

var question3 = {
    question: "What type of file has the .js extension?",
    answer: 'javascript',
    fake1: 'json',
    fake2: 'typescript',
    fake3: 'i dont know'
}

var question4 = {
    question: "How do you create a function in JavaScript?",
    answer: "function myFunction()",
    fake1: "makefunction myFunction()",
    fake2: "function = myFunction()",
    fake3: "function: myFunction()"
}

var question5 = {
    question: "How to write an IF statement for executing some code if 'i' is NOT equal to 5?",
    answer: "if (i != 5)",
    fake1: "if (i not = 5)",
    fake2: "if (i <> 5)",
    fake3: "if (i isnt 5)"
}

var questionsObjectsList = [question1, question2, question3, question4, question5];

// -------------------------------------------------------------------------------------------------------------

// RUN THE QUIZ ##################################################################################################
function startTimer() {
    var timer = setInterval(function () {
        timerDiv.textContent = "Time Left: " + timerCount;
        timerCount--;
        if (timerCount <= 0) {
            clearInterval(timer);
            timerDiv.textContent = "Time Left: " + timerCount;
            endPage();
        }
        if (gameOver) {
            clearInterval(timer);
        }
    }, 1000)
}


// Shuffling Function (from StackOVerflow)---------------------------------------------------------------------
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}
// ---------------------------------------------------------------------

function endPage() {
    // Return All done message and allow user to enter initials
    if (timerCount >= 0) {
        questionDiv.innerHTML = "<h2>All done!</h2>";
    } else {
        questionDiv.innerHTML = "<h2>Time's Up!</h2>";
    }

    answerOptionsDiv.innerHTML = "<p>Your final score is " + scoreCount + "</p>"
    correctOrIncorrectDiv.innerHTML = "";
    formDiv.setAttribute("style", "display: block");
    // Add listener to submit button
    submitInitialsButton.addEventListener("click", restart)

}

function restart(event) {
    event.preventDefault();
    playerInitials = initials.value;
    // Write the players score to localStorage
    thisHighScore[playerInitials] = scoreCount;
    // merge previous high scores and this high score
    allHighScores = {
        ...previousHighScores,
        ...thisHighScore
    }
    localStorage.setItem("allHighScores", JSON.stringify(allHighScores));
    console.log(localStorage.getItem("allHighScores"))

    // Reload the page to start again
    document.location.reload(false);
}

function correctAnswer() {
    correctOrIncorrectDiv.innerHTML = "<p>Correct! </p>";
    questionIndex++;
    scoreCount++;
    runQuiz();
}

function incorrectAnswer() {
    correctOrIncorrectDiv.innerHTML = "<p> Incorrect - You lost 10 seconds </p>";
    questionIndex++;
    timerCount = timerCount - 10;
    runQuiz();

}

function runQuiz() {



    // Determine if the test is over 
    if (questionIndex === questionsObjectsList.length - 1) {
        gameOver = true;
        endPage();
        return;
    }
    // Define which question we are on
    thisQuestion = questionsObjectsList[questionIndex];

    // Delete Start Button & Previous answerOptions
    answerOptionsUL.innerHTML = "";
    startButtonDiv.innerHTML = "";
    // Write the question
    questionDiv.innerHTML = "<h2>" + thisQuestion.question + "</h2>";

    // Render the answers
    var answerOptions = shuffle([thisQuestion.answer, thisQuestion.fake1, thisQuestion.fake2, thisQuestion.fake3]);
    for (var i = 0; i < answerOptions.length; i++) {
        var li = document.createElement("li");
        li.textContent = answerOptions[i];
        li.setAttribute("class", "startButtonClass")
        answerOptionsUL.append(li);
    }


};

// ###############################################################################

// HomePage and Start Quiz----------------------------------------------------------------------------------

function startQuiz(event) {
    event.preventDefault();
    scoreCount = 0;

    // Listen for clicks on answers
    answerOptionsUL.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var element = event.target;
        if (element.textContent == thisQuestion.answer) {
            correctAnswer();
        } else {
            incorrectAnswer();
        }
    });

    startTimer();
    runQuiz();
}

function homePage() {
    gameOver = false;
    questionIndex = 0;

    // Get all the previous high scores into a json object
    previousHighScores = JSON.parse(localStorage.getItem("allHighScores"));
    console.log("previous high scores " + previousHighScores)

    // Write a button item to the main div
    var startQuizButton = document.createElement("button");
    startQuizButton.textContent = "Start Quiz";
    startQuizButton.setAttribute("class", "startButtonClass")

    // Add button to div
    startButtonDiv.appendChild(startQuizButton);

    // Add Event Listeners
    startQuizButton.addEventListener("click", startQuiz);
}

// ----------------------------------------------------------------------------------

function showHighScores() {

    startButtonDiv.innerHTML = "";
    correctOrIncorrectDiv.innerHTML = "";
    quizAreaDiv.innerHTML = "";
    document.getElementById("bannerDiv").innerHTML = "";
    highScoresDisplayDiv.setAttribute("style", "display: block;");
    backButton.addEventListener("click", function () {
        document.location.reload(true);
    });

    // Render a list ofr all the high scores
    var listOfHighScores = JSON.parse(localStorage.getItem("allHighScores"));
    for (var key in listOfHighScores) {
        var li = document.createElement("li");
        li.textContent = "Initials:  " + key + ",  Score: " + listOfHighScores[key];
        highScoresDisplayUL.append(li);

    }

    clearButton.addEventListener("click", function () {
        localStorage.clear();
        allHighScores = {};
        document.location.reload(true);
    });

}

// Run the program --------------------------------------------------------------------------------------------------
homePage();

// Add Event Listeners
highScoresDiv.addEventListener("click", showHighScores);

// ---------------------------------------------------------------------------------------------------



