let posts = [];
function addpost() {
    let title = document.getElementById("Newposttitle").value;
    let desc = document.getElementById("Newpostdescription").value;
    if (title === "" || desc === "") {
        alert("Enter in both a title and description");
        return;
    }
    let post = {
        title: title,
        description: desc,
        questions: []
    };
    posts.push(post);
    document.getElementById("Newposttitle").value = "";
    document.getElementById("Newpostdescription").value = "";
    showpost();
}
function showpost() {
    let postsdiv = document.getElementById("list-posts");
    postsdiv.innerHTML = "";
    for (let i = 0; i < posts.length; i++) {
        let div = document.createElement("div");
        div.className = "postcard";
        div.innerHTML = "<h3>" + posts[i].title + "</h3>" +
                         "<p>" + posts[i].description + "</p>" +
                         "<button onclick='addquestion(" + i + ")'>New Question</button>" +
                         "<div id='q-list-" + i + "'></div>";
        postsdiv.appendChild(div);
    }
}
function addquestion(postindex) {
    let q = prompt("Enter a question");
    if (q !== null && q.trim() !== "") {
        let question = {
            title: q,
            answers: []
        };
        posts[postindex].questions.push(question);
        showquestions(postindex);
    } else {
        alert("Question was not entered");
    }
}
function showquestions(postindex) {
    let questiondiv = document.getElementById("q-list-" + postindex);
    questiondiv.innerHTML = "";
    for (let j = 0; j < posts[postindex].questions.length; j++) {
        let question = document.createElement("div");
        question.classname = "postcard";
        question.innerHTML = "<p><b>Q: </b>" + posts[postindex].questions[j].title + "</p>" +
                         "<textarea id='ans-input-" + postindex + "-" + j + "' placeholder='Type in an answer'></textarea>" +
                         "<button onclick='submitAns(" + postindex + ", " + j + ")'>Submit</button>" +
                         "<div id='ans-list-" + postindex + "-" + j + "'></div>";
        questiondiv.appendChild(question);
    }
}
function submitanswer(postidx, questionidx) {
    let answerarea = document.getElementById("answer-input-" + postidx + "-" + questionidx);
    let answer = answerarea.value;
    if (answer.trim() !== "") {
        posts[postidx].questions[questionidx].answers.push(answer);
        answerarea.value = "";
        showanswers(postidx, questionidx);
    } else {
        alert("Type in an answer");
    }
}
function showanswers(postidx, questionidx) {
    let answerdiv = document.getElementById("ans-list-" + postidx + "-" + questionidx);
    answerdiv.innerHTML = "";
    let allanswer = posts[postidx].questions[questionidx].answers;
    for (let k = 0; k < allanswer.length; k++) {
        let a = document.createElement("div");
        a.classname = "replyarea";
        a.innertext = allanswer[k];
        answerdiv.appendChild(a);
    }
}
