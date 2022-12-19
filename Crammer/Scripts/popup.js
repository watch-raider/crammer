function CollectText(keyPhrasesArray) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { todo: "showResult", resultArray: keyPhrasesArray });
    });
}

function displayText(text) {

    /*** Key Phrases list for live ***/
    var result = Text_validations(text);
    if (!result) return;

    const data = JSON.stringify({
        "text": text,
        "language": "en"
    });

    fetch(protocol + endpoint + analytics_route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': user.Token
        },
        body: data,
        })
            .then((response) => response.json())
            .then((responsed_data) => {
                if (responsed_data.Result == -1)
                {
                    alert("Text not suitable for analysis");
                    analysisLoading(false);
                    return;
                }
                if (responsed_data.title == "Not Found") {
                    AddAccount(token, email);
                    alert("An error occured on our end. Please try again");
                    analysisLoading(false);
                    return;
                }
                
                CollectText(responsed_data.Phrases);
                console.log('Success:', responsed_data);
            })
            .catch((error) => {
                console.log('Error:', error);
            });
}

window.onload = function () {

    analysisBtn.addEventListener("click", analysisBtn_Clicked);

    hideBtn.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { todo: "hideResult" });
        });
    });

    if (typeof (localStorage.language) !== "undefined") {
        if (localStorage.language !== null) {
            languageBtn.innerText = localStorage.language;
        }
    }


    for (let i = 0; i < languageList.length; i++) {
        languageList[i].addEventListener("click", function (e) {
            if (choice !== null) {
                choice.classList.remove("w3-teal");
            }
            choice = document.getElementById(e.target.attributes.id.value);
            choice.classList.add("w3-teal");
            languageBtn.innerText = choice.innerText;
            localStorage.language = choice.innerText;
        });
    }

    userIdentity();
    
    StarRating();

    overlaySetup();
};

function Text_validations(text) {
    if (text == null) {
        count++;
        if (count <= 2) {
            setTimeout(StartAnalysis, 1000);
        }
        else {
            alert("Text not suitable for analysis");
            analysisLoading(false);
            count = 0;
        }
        return false;
    }
    if (text == null || text.length == null || text.length <= 0 || text.length <= 100) {
        alert("Text not suitable for analysis");
        analysisLoading(false);
        return false;
    }
    return true;
}

function analysisBtn_Clicked() {
    if (user.Token === null || user.Token === "" || user.Token === "undefined") {
        alert("Please make sure sync is turned on in your Chrome settings and data permissions allowed to use this app");
        return;
    }
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            files: ['Scripts/content.js']
          });
        analysisLoading(true);
        chrome.scripting.insertCSS({
            target: {tabId: tabs[0].id},
            files: ['Stylesheets/content.css', 'Stylesheets/bulma.min.css']
          });
    });

    StartAnalysis();
    UpdateUsage();
}

function StartAnalysis() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { todo: "analyseText" }, displayText);
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendresponse) {
    if (request.todo == "FinishLoading") {
        analysisBtn.removeEventListener("click", analysisBtn_Clicked);
        analysisLoading(false);
    }
});