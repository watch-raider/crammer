var analysisSpinner = document.getElementById("analyseSpinner");
var analysisBtn = document.getElementById("analysisBtn");
var count = 0;
var choice = null;
var hideBtn = document.getElementById("hideBtn");
var languageBtn = document.getElementById("languageBtn");
var languageList = document.getElementsByClassName("list-item");

//var uri = 'https://crammerapi.azurewebsites.net/api/Users/';

function getLanguageChoice() {
        switch (localStorage.language) {
            case "Spanish":
                return "es";
            case "German":
                return "de";
            case "Italian":
                return "it";
            case "Japanese":
                return "ja";
            case "Korean":
                return "ko";
            case "Portugues":
                return "pt-PT";
            case "Russian":
                return "ru";
            default:
                return "en";
        }
}

function analysisLoading(isLoading) {
    if(isLoading)
    {
        analysisBtn.style.display = "none";
        analysisSpinner.style.display = "inline";
    }
    else 
    {
        analysisSpinner.style.display = "none";
        analysisBtn.style.display = "inline";
    }
}

function Format_text(text) {
    var textLen = text.length;
    var documents = { 'documents': []};
    var languageCode = getLanguageChoice();

    for (var i = 0; i < textLen; i++) 
    {
        documents.documents[i] = { 'id': (i+1).toString(), 'language': languageCode, 'text': text[i] };
    } 
    return documents;
}

function StarRating() {
    var stars = document.getElementsByClassName('checked');
    for (let i = 0; i < stars.length; i++) {
        stars[i].addEventListener("click", function (e) {
            var starId = e.target.attributes.id.value;
            switch (starId) {
                case "star1":
                    document.getElementById("star1").style.color = "orange";
                    document.getElementById("star2").style.color = "black";
                    document.getElementById("star3").style.color = "black";
                    document.getElementById("star4").style.color = "black";
                    document.getElementById("star5").style.color = "black";
                    SaveStarRating(1);
                    break;
                case "star2":
                    document.getElementById("star1").style.color = "orange";
                    document.getElementById("star2").style.color = "orange";
                    document.getElementById("star3").style.color = "black";
                    document.getElementById("star4").style.color = "black";
                    document.getElementById("star5").style.color = "black";
                    SaveStarRating(2);
                    break;
                case "star3":
                    document.getElementById("star1").style.color = "orange";
                    document.getElementById("star2").style.color = "orange";
                    document.getElementById("star3").style.color = "orange";
                    document.getElementById("star4").style.color = "black";
                    document.getElementById("star5").style.color = "black";
                    SaveStarRating(3);
                    break;
                case "star4":
                    document.getElementById("star1").style.color = "orange";
                    document.getElementById("star2").style.color = "orange";
                    document.getElementById("star3").style.color = "orange";
                    document.getElementById("star4").style.color = "orange";
                    document.getElementById("star5").style.color = "black";
                    SaveStarRating(4);
                    break;
                case "star5":
                    document.getElementById("star1").style.color = "orange";
                    document.getElementById("star2").style.color = "orange";
                    document.getElementById("star3").style.color = "orange";
                    document.getElementById("star4").style.color = "orange";
                    document.getElementById("star5").style.color = "orange";
                    SaveStarRating(5);
                    break;
                default:
                    document.getElementById("star1").style.color = "black";
                    document.getElementById("star2").style.color = "black";
                    document.getElementById("star3").style.color = "black";
                    document.getElementById("star4").style.color = "black";
                    document.getElementById("star5").style.color = "black";
                    break;
            }
        });
    }
}

function SaveStarRating(rating) {

    if (user == null || user.Token === "undefined" || token === "") {
        //alert("No Data for User!");
        return;
    }
    
    const data = { "ID": user.ID, "Token": user.Token, "Email": user.Email, "DateAdded": user.DateAdded, "StarRating": rating };
    //alert(uri + user.Token);
    fetch(protocol + endpoint + user_route + user.Token, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log('Error:', error);
        });
}

function UpdateUsage() {
    if (user == null || user.Token === "undefined" || token === "") {
        //alert("No Data for User!");
        return;
    }
    fetch(protocol + endpoint + usage_route + user.Token, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
        })
        .catch((error) => {
            console.log('Error:', error);
        });
}

/* Open when someone clicks on the span element */
function openNavFeedback() {
    document.getElementById("feedback-rating").style.display = "block";
    document.getElementById("myNav").style.height = "100%";
}

/* Open when someone clicks on the span element */
function openNavReview() {
    document.getElementById("review-rating").style.display = "block";
    document.getElementById("myNav").style.height = "100%";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.height = "0%";
    document.getElementById("feedback-rating").style.display = "none";
    document.getElementById("review-rating").style.display = "none";
}

function overlaySetup() {
    document.getElementById("overlay-close-btn").addEventListener("click", closeNav);
    document.getElementById("star1").addEventListener("click", openNavFeedback);
    document.getElementById("star2").addEventListener("click", openNavFeedback);
    document.getElementById("star3").addEventListener("click", openNavFeedback);
    document.getElementById("star4").addEventListener("click", openNavReview);
    document.getElementById("star5").addEventListener("click", openNavReview);
}