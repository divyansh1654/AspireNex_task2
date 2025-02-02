

var currentQuestion = -1;
var numberOfQuestions = 0;
var answerKey = [];
var statusClass = {
  "current": "btn btn-warning btn-sm",
  "valid": "btn btn-success btn-sm",
  "invalid": "btn btn-danger btn-sm"
};

var statusBar = [];

function getOptionRadioNodes(questionId) {
  return document.querySelectorAll("#question-"+questionId+"-section > tr > td > p > input[type=\"radio\"]");
}

function updateStatus(questionId, status) {
  var statusNode = document.getElementById("status-"+questionId);
  statusNode.setAttribute("class", statusClass[status]);
}

function addToStatusBar(questionId) {
  statusBar.push("valid");
  var statusContainerNode = document.getElementById("question-status");
  var statusNode = document.createElement("button");
  statusNode.setAttribute("type", "button");
  statusNode.setAttribute("class", statusClass["valid"]);
  statusNode.setAttribute("id", "status-"+questionId);
  statusNode.addEventListener("click", function() {
    changeQuestionTo(this);
  });
  statusNode.innerHTML = (questionId===numberOfQuestions)?"Result":((questionId+1).toString());
  statusContainerNode.appendChild(statusNode);
  statusContainerNode.appendChild(document.createTextNode("\u00A0"));
}

function createSymbolNode(type) {
  var symbolNode = document.createElement("span");
  symbolNode.setAttribute("class", "glyphicon glyphicon-"+type);
  symbolNode.setAttribute("aria-hidden", "true");
  symbolNode.innerHTML = " ";
  return symbolNode;
}

function createQuestionTextNode(questionText) {

  // create tr node
  var rowNode = document.createElement("tr");

  // create td node
  var tdNode = document.createElement("td");
  tdNode.setAttribute("colspan", "2");

  // create blockquote node
  var blockQuoteNode = document.createElement("blockquote");

  // create question text node
  var questionTextNode = document.createElement("p");
  questionTextNode.setAttribute("class", "lead");
  questionTextNode.innerHTML = questionText;

  // build block
  blockQuoteNode.appendChild(questionTextNode);
  tdNode.appendChild(blockQuoteNode);
  rowNode.appendChild(tdNode);

  return rowNode;
}

function createOptionNode(questionId, optionId, optionText) {
  // create tr node
  var rowNode = document.createElement("tr");

  // create td node
  var tdNode = document.createElement("td");
  tdNode.setAttribute("colspan", "2");

  // create option block node
  var optionBlockNode = document.createElement("p");
  optionBlockNode.setAttribute("class", "text-lg");

  // create radio node
  var radioNode = document.createElement("input");
  radioNode.setAttribute("type", "radio");
  radioNode.setAttribute("name", "question-"+questionId+"-option");
  radioNode.setAttribute("value", "option-"+optionId);

  // attach all
  optionBlockNode.appendChild(radioNode);
  optionBlockNode.appendChild(document.createTextNode(" "+optionText));

  tdNode.appendChild(optionBlockNode);
  rowNode.appendChild(tdNode);

  return rowNode;
}

function renderQuestion(questionId, questionData) {
  var text = questionData["question"];
  var options = questionData["options"];

  var controlNode = document.getElementById("quiz-control");
  var tableNode = controlNode.parentNode;

  // Create tbody
  var sectionNode = document.createElement("tbody");
  sectionNode.setAttribute("id", "question-"+questionId+"-section");
  sectionNode.setAttribute("hidden", "");
  sectionNode.appendChild(createQuestionTextNode(text));
  for (var optionId = 0; optionId<options.length; optionId++) {
    var optionText = options[optionId];
    sectionNode.appendChild(createOptionNode(questionId, optionId, optionText));
  }

  // attach before control node
  tableNode.insertBefore(sectionNode, controlNode);
}

function extractQuestionsData(questionsData) {
  for (var index=0; index<questionsData.length; index++) {
    var questionData = questionsData[index];
    renderQuestion(index, questionData);
    answerKey.push(questionData["correct-option"]);
  }
}

function setCurrentQuestionTo(questionId) {
  if (currentQuestion !== -1) {
    // Update status bar
    updateStatus(currentQuestion, statusBar[currentQuestion]);
    // Hide current question
    var currentQuestionNode = document.getElementById("question-"+currentQuestion+"-section")||document.getElementById("result-section");
    currentQuestionNode.setAttribute("hidden", "");
  }

  // Change current question
  currentQuestion = questionId;
  // Update title with current question
  document.getElementById("current-question-title").innerHTML = (currentQuestion===numberOfQuestions)?"Result":"Question "+(currentQuestion+1);
  // Remove hidden attribute from current question
  var newCurrentQuestionNode = document.getElementById("question-"+currentQuestion+"-section")||document.getElementById("result-section");
  newCurrentQuestionNode.removeAttribute("hidden");

  updateStatus(questionId, "current");

  var nextButtonNode = document.querySelector("#quiz-control > tr > td > button.btn.btn-primary.btn-lg");
  if (questionId >= numberOfQuestions-1) {
    nextButtonNode.setAttribute("disabled", "");
  }
  else {
    nextButtonNode.removeAttribute("disabled");
  }
}

function renderStatus() {
  for(var questionId=0;questionId<numberOfQuestions;questionId++) {
    addToStatusBar(questionId);
  }
}

function changeQuestionTo(target) {
  var questionId = (target.innerHTML!=="Result")?(parseInt(target.innerHTML)-1):numberOfQuestions;
  setCurrentQuestionTo(questionId);
}

function nextQuestion() {
  setCurrentQuestionTo(currentQuestion+1);
}

function getQuestionsDataFromStorage() {
  var questionsData = JSON.parse(localStorage.getItem("quiz"));
  numberOfQuestions = questionsData.length;

  // extract and render all questions and options
  extractQuestionsData(questionsData);



  // Render status questions
  renderStatus(numberOfQuestions);

  setCurrentQuestionTo(0);
}

function checkAnswers() {

  var numberOfCorrectQuestions = 0;
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {

    var chosenOption = -1;

    var optionRadioNodes = getOptionRadioNodes(questionId);
    for(var index=0; index<optionRadioNodes.length; index++) {
      var optionRadioNode = optionRadioNodes[index];
      if (optionRadioNode.checked) {
        chosenOption = index;
      }
    }

    if (chosenOption === answerKey[questionId]) {
      numberOfCorrectQuestions++;
      statusBar[questionId] = "valid";
    }
    else {
      statusBar[questionId] = "invalid";
    }
  }

  return numberOfCorrectQuestions;
}

function disableQuestions() {
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {

    var optionRadioNodes = getOptionRadioNodes(questionId);
    for(var index=0; index<optionRadioNodes.length; index++) {
      var optionRadioNode = optionRadioNodes[index];
      optionRadioNode.setAttribute("disabled", "");
    }
  }
}

function displayCorrectAnswer() {
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {
    var cssPathToCorrectOptionText = "#question-" + questionId + "-section > tr:nth-child(" + (answerKey[questionId]+2) + ") > td > p";
    var correctOptionNode = document.querySelector(cssPathToCorrectOptionText);
    correctOptionNode.appendChild(createSymbolNode("ok"));
  }
}

function updateAllStatus() {
  for(var questionId=0; questionId<numberOfQuestions; questionId++) {
    updateStatus(questionId, statusBar[questionId]);
  }
}

function displayResult() {
  var controlNode = document.getElementById("quiz-control");
  var tableNode = controlNode.parentNode;
  var numberOfCorrectQuestions = checkAnswers();

  // Add result section
  var sectionNode = document.createElement("tbody");
  sectionNode.setAttribute("id", "result-section");
  sectionNode.setAttribute("hidden", "");
  sectionNode.appendChild(createQuestionTextNode("You got "+numberOfCorrectQuestions+" correct out of "+numberOfQuestions+" questions!"));

  tableNode.insertBefore(sectionNode, controlNode);

  // Add to status bar
  addToStatusBar(numberOfQuestions);
  setCurrentQuestionTo(numberOfQuestions);

  updateAllStatus();

  // Disable all options
  disableQuestions();
  displayCorrectAnswer();

  // Disable finisih options
  document.querySelector("#quiz-control > tr > td > button.btn.btn-success.btn-lg").setAttribute("disabled", "");

}
function resetPage() {
  window.location.href = 'index.html';
}

function addQuizControlEventListener() {
  // Add Option Button
  document.querySelector("#quiz-control > tr > td > button.btn.btn-primary.btn-lg").addEventListener("click", function() {
    nextQuestion();
  });

  // Add Finish Button
  document.querySelector("#quiz-control > tr > td > button.btn.btn-success.btn-lg").addEventListener("click", function() {
    displayResult();
    stopTimer();
  });

  // reset
  document.querySelector("#reset").addEventListener("click", function() {
    resetPage();
  });
}

(function() {
  getQuestionsDataFromStorage();
  addQuizControlEventListener();
})();

function resetAnswers() {
  for (var questionId = 0; questionId < numberOfQuestions; questionId++) {
    var optionRadioNodes = getOptionRadioNodes(questionId);
    for (var index = 0; index < optionRadioNodes.length; index++) {
      var optionRadioNode = optionRadioNodes[index];
      optionRadioNode.checked = false; // Uncheck radio buttons
      optionRadioNode.removeAttribute("disabled"); // Enable radio buttons if disabled
    }
    statusBar[questionId] = ""; // Reset status bar for this question
    updateStatus(questionId, ""); // Update status to default
  }
}

// Function to handle reset button click
function resetPage() {
  resetAnswers(); // Call the function to reset answers
}
