let posts = [];
function addpost() {
    let title = document.getelementbyid("Newposttitle").value;
    let desc = document.getelementbyid("Newpostdescription").value;
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
    document.getelementbyid("Newposttitle").value = "";
    document.getelementbyid("Newpostdescription").value = "";
    showpost();
}
function showpost() {
    let postsdiv = document.getelementbyid("list-posts");
    postsdiv.innerHTML = "";
    for (let i = 0; i < posts.length; i++) {
        let div = document.createelement("div");
        div.classname = "postcard";
        div.innerHTML = "<h3>" + posts[i].title + "</h3>" +
                         "<p>" + posts[i].description + "</p>" +
                         "<button onclick='addquestion(" + i + ")'>New Question</button>" +
                         "<div id='q-list-" + i + "'></div>";
        postsdiv.appendchild(div);
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
    let questiondiv = document.getelementbyid("q-list-" + postindex);
    questiondiv.innerHTML = "";
    for (let j = 0; j < posts[postindex].questions.length; j++) {
        let question = document.createelement("div");
        question.classname = "postcard";
        question.innerHTML = "<p><b>Q: </b>" + posts[postindex].questions[j].title + "</p>" +
                         "<textarea id='ans-input-" + postindex + "-" + j + "' placeholder='Type in an answer'></textarea>" +
                         "<button onclick='submitAns(" + postindex + ", " + j + ")'>Submit</button>" +
                         "<div id='ans-list-" + postindex + "-" + j + "'></div>";
        questiondiv.appendchild(question);
    }
}
function submitanswer(postidx, questionidx) {
    let answerarea = document.getelementbyid("answer-input-" + postidx + "-" + questionidx);
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
    let answerdiv = document.getelementbyid("ans-list-" + postidx + "-" + questionidx);
    answerdiv.innerHTML = "";
    let allanswer = posts[postidx].questions[questionidx].answers;
    for (let k = 0; k < allanswer.length; k++) {
        let a = document.createelement("div");
        a.classname = "replyarea";
        a.innertext = allanswer[k];
        answerdiv.appendchild(a);
    }
}
