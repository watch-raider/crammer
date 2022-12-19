var idNum = 0;
var lastTag = null;
var overlay, overlayList, headerTag, phrasesLen, wholeHtml, maxElement, originalHtmlNode, textHtml;
var elements = document.getElementsByTagName("p");
var elementsLen = elements.length;
var bodyElement = document.getElementsByTagName("BODY")[0];
var bodyElements = document.getElementsByTagName("BODY");
var articleElements = bodyElement.getElementsByTagName("article");
var mainElements = bodyElement.getElementsByTagName("main");
let keyPhrases = [];
var articleArray = [];
var replacedElements = [];
var phraseNum = 0;

function ShowElement(element) {
  element.style.display = "block";
}
  
function HideElement(element) {
  element.style.display = "none";
}

function myScript(e) {
  var id = e.target.attributes.id.value;
  if (id.search("item") != -1) {
    id = e.target.attributes.id.value.slice(0, -4);
  }
  else if (id.search("badge") !== -1) {
    return;
  }
  var badgeNum = parseInt(document.getElementById(id + "badge").innerText);
  var eTag = document.getElementById(id);
  if (lastTag == eTag && badgeNum <= 1) {
    return;
  }
  if (lastTag != null) {
    RemoveLastHighlight();
    RemoveClass(lastTag.id);
  }
  if (lastTag == eTag) {
    phraseNum++;
    if ((phraseNum + 1) > badgeNum) phraseNum = 0;
  }
  else {
    phraseNum = 0;
  }
  var regex = new RegExp(eTag.innerHTML, "g");
  var phraseCount = 0;
  var replacement = '<span class="selected-phrase-maw" style="background-color:#99ccff;">' + eTag.innerText + "</span>";
  for (let j = 0; j < articleArray.length; j++) {

    for (let i = 0; i < articleArray[j].length; i++) {
      if (articleArray[j][i].innerHTML.search(eTag.innerHTML) != -1) {
        replacedElements.push(articleArray[j][i]);
        originalHtmlNode = wholeHtml;
        var htmlNode = articleArray[j][i];
        htmlNode.innerHTML = htmlNode.innerHTML.replace(regex, replacement);
        articleArray[j][i].parentNode.replaceChild(htmlNode, articleArray[j][i]); 
        if (phraseCount == phraseNum) {
          articleArray[j][i].scrollIntoView({ block: 'end',  behavior: 'smooth' });
        }
        phraseCount++;
      }
      if (phraseCount >= badgeNum) {
        break;
      }
    }
    if (phraseCount >= badgeNum) {
      break;
    }
  }
  
  AddClass(id);

  lastTag = eTag;
}



function RemoveLastHighlight() {
  for (let i = 0; i < replacedElements.length; i++) {
    var undoReplace = '<span class="selected-phrase-maw" style="background-color:#99ccff;">' + lastTag.innerText + "</span>";
    var undoRegex = new RegExp(undoReplace, "g");
    var htmlNode = replacedElements[i];
    htmlNode.innerHTML = htmlNode.innerHTML.replace(undoRegex, lastTag.innerHTML);
    replacedElements[i].parentNode.replaceChild(htmlNode, replacedElements[i]);
  }
  RemoveClass(lastTag.id);
}

function AddClass(id) {
    var element = document.getElementById(id + "badge");
    element.classList.add("is-primary-maw");
    element.classList.remove("is-info-maw");
}

function RemoveClass(id) {
    var element = document.getElementById(id + "badge");
    element.classList.add("is-info-maw");
    element.classList.remove("is-primary");
}

function countInstances(string, word) {
    return string.split(word).length - 1;
}

function createOverlay(resultArray) {
    overlay = CreateOverlay();
    var header = CreateNav();
    var radioNav = CreateRadioNav();

    var radio1 = CreateRadioBtn("Count");
    radio1.addEventListener("click", SortByCount);
    var radio2 = CreateRadioBtn("A-Z");
    radio2.addEventListener("click", SortByAZ);
    var radio3 = CreateRadioBtn("Z-A");
    radio3.addEventListener("click", SortByZA);
    
    bodyElement.appendChild(overlay);
    overlay.appendChild(header);

    var listContainer = CreateListContainer();
    overlay.appendChild(listContainer);

    header.addEventListener("click", function(){
      ToggleElementHide(listContainer);
    });

    listContainer.appendChild(radioNav);
    radioNav.appendChild(radio1);
    radioNav.appendChild(radio2);
    radioNav.appendChild(radio3);

    phrasesLen = resultArray.length;
    let i;
    for (i = 0; i < phrasesLen; i++) {
      var keyPhrase = resultArray[i].trim();
      var phrase_count = 0;
      phrase_count = countInstances(textHtml, keyPhrase);
      /* For testing purposes */
      //count = 1;
      if (phrase_count) {
        var listItem = CreateListItem(idNum, keyPhrase, phrase_count);
        listItem.addEventListener("click", myScript);
        listContainer.appendChild(listItem);
        
        idNum++;
        keyPhrases.push({ phrase: keyPhrase, count: phrase_count });
      }
    }

    ShowElement(overlay);
    // Make the DIV element draggable:
    dragElement(overlay, header);

    chrome.runtime.sendMessage({ todo: "FinishLoading" });
}

function CreateOverlay() {
    var span = document.createElement("span");
    span.id = "modal1996maw";
    span.classList.add("panel-maw");
    span.classList.add("is-info-maw");
    span.classList.add("fade");
    return span
}

function CreateListContainer() {
  var span = document.createElement("span");
  span.id = "KeyPhrasesMaw"
  span.classList.add("w3-container");
  span.classList.add("w3-hide");
  return span;
}

function CreateNav() {
  headerDiv = document.createElement("p");
  var minimiseBtn = document.createElement("button");
  minimiseBtn.id = "header-btn-maw";
  var btnNode = document.createTextNode("+");
  minimiseBtn.appendChild(btnNode);
  headerDiv.id = "headerDivMaw";
  headerDiv.classList.add("panel-heading-maw");
  var node = document.createTextNode("Key Phrases");
  headerDiv.appendChild(node);
  headerDiv.appendChild(minimiseBtn);
  return headerDiv;
}

function CreateListItem(idNum, result, count) {
  var listItem = document.createElement("a");
  listItem.id = 'maw' + idNum + 'item';
  listItem.classList.add("panel-block-maw");

  var divBadge = document.createElement("span");
  divBadge.classList.add("panel-icon-maw");
  divBadge.classList.add("tag-maw");
  divBadge.classList.add("is-info-maw");
  divBadge.id = 'maw' + idNum + 'badge';
  var node = document.createTextNode(count);
  divBadge.appendChild(node);
  listItem.appendChild(divBadge);

  var textSpan = document.createElement("span");
  textSpan.id = 'maw' + idNum;
  var node = document.createTextNode(result.trim());
  textSpan.appendChild(node);
  listItem.appendChild(textSpan);

  return listItem;
}

function CreateRadioNav() {
  var radioNav = document.createElement("span");
  radioNav.classList.add("panel-tabs-maw");
  return radioNav;
}

function CreateRadioBtn(sortBy) {
    var radioDiv = document.createElement("a");
    radioDiv.id = sortBy;
    var node = document.createTextNode(sortBy);
    radioDiv.appendChild(node);

    return radioDiv;
}

function SortByCount() {
  var AZ = document.getElementById("A-Z");
  AZ.classList.remove("is-active-maw");
  var ZA = document.getElementById("Z-A");
  ZA.classList.remove("is-active-maw");
  var Cnt = document.getElementById("Count");
  Cnt.classList.add("is-active-maw");
  keyPhrases.sort(function (a, b) { return b.count - a.count; });
  ResetList();
}

function SortByAZ() {
  var AZ = document.getElementById("A-Z");
  AZ.classList.add("is-active-maw");
  var ZA = document.getElementById("Z-A");
  ZA.classList.remove("is-active-maw");
  var Cnt = document.getElementById("Count");
  Cnt.classList.remove("is-active-maw");
  keyPhrases.sort(function (a, b) {
      var x = a.phrase.toLowerCase();
      var y = b.phrase.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
  });
  ResetList();
}

function SortByZA() {
  var AZ = document.getElementById("A-Z");
  AZ.classList.remove("is-active-maw");
  var ZA = document.getElementById("Z-A");
  ZA.classList.add("is-active-maw");
  var Cnt = document.getElementById("Count");
  Cnt.classList.remove("is-active-maw");
  keyPhrases.sort(function (a, b) {
      var x = b.phrase.toLowerCase();
      var y = a.phrase.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
  });
  ResetList();
}

function ResetList() {
  if (lastTag != null) {
    RemoveClass(lastTag.id);
    RemoveLastHighlight();
  }
  for (let i = 0; i < phrasesLen; i++) {
      document.getElementById('maw' + i).innerText = keyPhrases[i].phrase;
      document.getElementById('maw' + i + "badge").innerText = keyPhrases[i].count;
  }
}

function dragElement(elmnt, header) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    if (header) {
    // if present, the header is where you move the DIV from:
        header.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendresponse){
  if (request.todo == "analyseText" && document.getElementById("modal1996maw") == null) {
    
    articleArray = [];
    let commonParent = Find_txt_element();
    let wholeText = GetTextElements(commonParent);
    wholeHtml = commonParent;

    sendresponse(wholeText);
  }
});

function Find_txt_element() {
  if (mainElements.length >= 1) {
    elements = mainElements[0].getElementsByTagName("p");
  }
  else if (articleElements.length >= 1) {
    var article_elements = articleElements[0].getElementsByTagName("p");
    for (let i = 1; i < articleElements.length; i++) {
      if (articleElements[i].getElementsByTagName("p").length > article_elements.length) {
        article_elements = articleElements[i].getElementsByTagName("p");
      }
    }
    if (article_elements.length >= 3) {
      elements = article_elements;
    }
  }
  elementsLen = elements.length;
  var quarterLen = Math.round(elementsLen / 4);
  var thirdLen = Math.round(elementsLen / 3);
  var halfLen = Math.round(elementsLen / 2);
  var maxElement = elements[0];
  var maxElement2 = elements[halfLen];
  for (i = 0; i < elementsLen; i++) {
    if (i < halfLen) {
      if (elements[i].innerText.length > maxElement.innerText.length) {
        maxElement = elements[i];
      }
    }
    else if (i > halfLen && i <= ((thirdLen * 2) + quarterLen)) {
      if (elements[i].innerText.length > maxElement2.innerText.length) {
        maxElement2 = elements[i];
      }
    }
    else if (i > ((thirdLen * 2) + quarterLen)) {
      break;
    }
  }

  var commonParent = commonAncestor(maxElement, maxElement2);
  return commonParent;
}

function GetTextElements(element) {
  var parentTxt = "";
  textHtml = "";
  var h1Elements = element.getElementsByTagName("h1");
  articleArray.push(h1Elements);
  var h2Elements = element.getElementsByTagName("h2");
  articleArray.push(h2Elements);
  var h3Elements = element.getElementsByTagName("h3");
  articleArray.push(h3Elements);
  var pElements = element.getElementsByTagName("p");
  articleArray.push(pElements);
  var liElements = element.getElementsByTagName("li");
  articleArray.push(liElements);

  for (let j = 0; j < articleArray.length; j++) {
    for (i = 0; i < articleArray[j].length; i++) {
      textHtml += "\n" + articleArray[j][i].innerHTML.trim();
      parentTxt += "\n" + articleArray[j][i].textContent.trim();
    }
  }
  return parentTxt;
}

function parents(node) {
  var nodes = [node]
  for (; node; node = node.parentNode) {
    nodes.unshift(node)
  }
  return nodes
}

function commonAncestor(node1, node2) {
  var parents1 = parents(node1)
  var parents2 = parents(node2)

  if (parents1[0] != parents2[0]) throw "No common ancestor!"

  for (var i = 0; i < parents1.length; i++) {
    if (parents1[i] != parents2[i]) return parents1[i - 1]
  }
}

function ToggleElementHide(element) {
  if (element.style.display == "none")
  {
    ShowElement(element);
  }
  else
  {
    HideElement(element);
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendresponse){
    if (request.todo == "showResult") {
        createOverlay(Array.from(new Set(request.resultArray))); 
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendresponse){
    if (request.todo == "hideResult") {
      ToggleElementHide(overlay);
    }
});