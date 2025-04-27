let topics = [];
function createTopic() {
    const title = document.getElementById('topicTitle').value;
    const description = document.getElementById('topicDescription').value;
    if (title.trim() === "" || description.trim() === "") {
        alert("Please fill in both fields.");
        return;
    }
    const newTopic = {
        title,
        description,
        questions: []
    };
    topics.push(newTopic);
    document.getElementById('topicTitle').value = '';
    document.getElementById('topicDescription').value = '';
    renderTopics();
}
function renderTopics() {
    const container = document.getElementById('topicsContainer');
    container.innerHTML = '';

    topics.forEach((topic, topicIndex) => {
        const topicElement = document.createElement('div');
        topicElement.classList.add('topic');

        topicElement.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
            <button onclick="addQuestion(${topicIndex})">Add Question</button>
            <div id="questions-${topicIndex}"></div>
        `; 
        container.appendChild(topicElement);
    });
}
function addQuestion(topicIndex) {
    const questionTitle = prompt("Enter your question:");
    if (questionTitle.trim() !== "") {
        const newQuestion = {
            title: questionTitle,
            answers: []
        };
        topics[topicIndex].questions.push(newQuestion);
        renderQuestions(topicIndex);
    }
}
function renderQuestions(topicIndex) {
    const questionsContainer = document.getElementById(`questions-${topicIndex}`);
    questionsContainer.innerHTML = '';
    topics[topicIndex].questions.forEach((question, questionIndex) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('topic');
        questionElement.innerHTML = `
            <p><strong>Q:</strong> ${question.title}</p>
            <div class="answer-section">
                <textarea class="answer-input" placeholder="Write your answer"></textarea>
                <button class="post-answer" onclick="postAnswer(${topicIndex}, ${questionIndex})">Post Answer</button>
            </div>
            <div id="answers-${topicIndex}-${questionIndex}"></div>
        `;
        questionsContainer.appendChild(questionElement);
    });
}
function postAnswer(topicIndex, questionIndex) {
    const answerInput = document.querySelector(`#answers-${topicIndex}-${questionIndex} .answer-input`);
    const answer = answerInput.value;
    if (answer.trim() !== "") {
        topics[topicIndex].questions[questionIndex].answers.push(answer);
        answerInput.value = '';
        renderAnswers(topicIndex, questionIndex);
    }
}
function renderAnswers(topicIndex, questionIndex) {
    const answersContainer = document.getElementById(`answers-${topicIndex}-${questionIndex}`);
    answersContainer.innerHTML = '';
    topics[topicIndex].questions[questionIndex].answers.forEach(answer => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('answer');
        answerElement.innerText = answer;
        answersContainer.appendChild(answerElement);
    });
}
