var ValidScrabbles = new Set();
var WRDL5 = new Array();
var WRDL6 = new Array();
var WRDL7 = new Array();
var isWinner = false;

const ResultsURL = "https://script.google.com/macros/s/AKfycbwIJvu_hqfQ2HKfOpM4ifIhqhI8ZojaSapDB_R3b0sIcic2nKazJB0Bd9i2UDWQIj4z/exec";


    //load valid scrabble words
    $.getJSON("validScrabbles.json", function(data){
        for (var key in data){
            ValidScrabbles.add(data[key]);
        }
    });

    //load 5 letter words to pick from
    $.getJSON("wrdl5.json", function(data){
        for (var key in data){
            WRDL5.push(data[key]);
        }
        
    }).done(function( data ) {
        setInitCookies();
        let wordLen= getCookie("wordLen");
        if(wordLen == 5)
        {
            setCurrentWord(5);
            finishLoad();
        }
    });

    //load 6 letter words to pick from
    $.getJSON("wrdl6.json", function(data){
        for (var key in data){
            WRDL6.push(data[key]);
        }
    }).done(function( data ) {
        setInitCookies();
        let wordLen= getCookie("wordLen");
        if(wordLen == 6)
        {
            setCurrentWord(6);
            finishLoad();
        }
    });

    //load 7 letter words to pick from
    $.getJSON("wrdl7.json", function(data){
        for (var key in data){
            WRDL7.push(data[key]);
        }
    }).done(function( data ) {
        setInitCookies();
        let wordLen= getCookie("wordLen");
        if(wordLen == 7){
            setCurrentWord(7);
            finishLoad();
        }
    });


function finishLoad()
{
    let guessNum = getCookie("guessNum");
    let wordLen = getCookie("wordLen");
    let currentWord = getCookie("currentWord");
    let word;
    for(let i = 0; i <guessNum; i++)
    {
        word = getCookie("word"+ i);
        if(word == currentWord && wordLen < 7)
            showContinue();
        
        for(let j = 0; j < wordLen; j++)
        {
            var letterDiv = "#g" + i + "l" + j;
            $(letterDiv).text(word.substring(j,j+1));
            processLetter(currentWord,word,letterDiv,j,j+1);
        }
        
    }
    //if final word is not current, focus on next line
    if(word != currentWord)
    {
        //focus on next line, first letter
        $("#line" + guessNum + " > div").css("pointer-events", "auto");
        $("#g"+guessNum+"l0").focus();
        $("#g"+guessNum+"l0").addClass('focus');
    }
}


function load() 
{
    refreshLeaderBoard();
    let guessNum = getCookie("guessNum");
    let wordLen = getCookie("wordLen");
 
    if(wordLen >= 6)
    {
        $(".c5").removeClass("hidden");
    }
     if(wordLen >= 7)
    {
        $(".c6").removeClass("hidden");
    }

    $(".text").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#submit").click();
            return;
        }
        //if (event.keyCode >= 65 && event.keyCode <=90) {//todo
            $(this).text(event.key.toUpperCase());
        //}
        });

    //move focus forward and backwards
    $(".text").keyup(function () { //TODO change to not alpha
        if($(this).text().length === 1 && event.keyCode != 8) {
            let curFocus = $(this);
            let nextFocus = $(this).next('.text');
            if(nextFocus.attr('id') != null && !nextFocus.hasClass("hidden"))
            {
                $(this).next('.text').focus();
                $(".text").removeClass("focus");
                $(this).next('.text').addClass('focus');
            }   
        }
        else if ( event.keyCode === 8) {//backspace
            var prev = $(this).prev('.text');
            if(prev.attr('id') == null)
            {
                var guessNum = getCookie("guessNum");
                var let0 = "#g" + guessNum + "l0";
                $(let0).focus();
                $(let0).text("");
                $(".text").removeClass("focus");
                $(let0).addClass('focus');
                return;
            }
            $(this).prev('.text').focus();
            $(".text").removeClass("focus");
            $(this).prev('.text').addClass('focus');
            $(this).text("");

            
        }
    });

    //add focus when clicking a letter in a guess
    $(".text").click(function () {
        $(".text").removeClass("focus");
        $(this).addClass("focus");
    });
    //enter letter on virtual key press
    $(".keyboardLetter").click(function () { 
        var letter = $(this).text();
        if(isWinner == true)
        {

            let c = $("#userEntryText").text();
            
            if(letter == "<X")
            {
                var newText = "";
                if(c.length > 0)
                {
                    newText = c.substring(0, c.length -1);
                    $("#userEntryText").text(newText);
                }
            }
            else if(c.length <=2)
                $("#userEntryText").text(c + letter);
            $("#userEntryText").focus();

            if(letter == "ENTER")
            {
                $( "#userEntry" ).fadeOut( "slow" );
                var score = getCookie("score");
                postScore( $("#userEntryText").text(),score);
            }
            return;
        }
        if(letter == "ENTER")
        {
            $("#submit").click();
            return;
        }
        else if(letter == "<X")
        {
            var focus = $(".focus");
            var focusPrev = focus.prev('.text');
            if(focusPrev.attr('id') != null)
            {
                focusPrev.focus();
                $(".text").removeClass("focus");
                focusPrev.addClass('focus');
                focus.text("");
            }
            else
            {
                var guessNum = getCookie("guessNum");
                var let0 = "#g" + guessNum + "l0";
                $(let0).focus();
                $(let0).text("");
                $(".text").removeClass("focus");
                $(let0).addClass('focus');
            }
            return;
        }
        $(".focus").text(letter);
        var curFocus = $(".focus");
        var nextFocus = curFocus.next('.text');
        if(nextFocus.attr('id') != null && !nextFocus.hasClass("hidden"))
        {
            curFocus.next('.text').focus();
            $(".text").removeClass("focus");
            curFocus.next('.text').addClass('focus');
        }
    });

    //continue button handler
    $("#continue").click(function () {
        $("#continue").hide();
        $(".text").text("");
        $(".text").removeClass("validPos validLet invalid");
        $(".keyboardLetter").removeClass("validPos validLet invalid");
        eraseCookie("word0");
        eraseCookie("word1");
        eraseCookie("word2");
        eraseCookie("word3");
        eraseCookie("word4");
        eraseCookie("word5");
        var wordLen = getCookie("wordLen");
        wordLen = parseInt(wordLen) + 1;
        setCookie("wordLen", wordLen);
        if(wordLen == 6)
        {
            $(".c5").removeClass("hidden");
            //pick 6 letter word
            setCurrentWord(6);
        }
        else if(wordLen == 7)
        {
            $(".c6").removeClass("hidden");
            //pick 7 letter word
            setCurrentWord(7);
        }
        setCookie("guessNum", 0);
        //enable focusing on elements
        $("#line0 > div").css("pointer-events", "auto");
        var firstLetter = "#g0l0";
        $(".text").removeClass("focus");
        $(firstLetter).addClass('focus');
        $(firstLetter).focus();


    });

    $("#leaderboardButton").click(function () {
        toggleLeaderBoard();
    });

}

  function submitWord()
  {
    var guessNum = getCookie("guessNum");
    var wordLen = getCookie("wordLen");
    const maxGuess = 5;
    var submittedWord;

    var let0 = "#g" + guessNum + "l0";
    var let1 = "#g" + guessNum + "l1";
    var let2 = "#g" + guessNum + "l2";
    var let3 = "#g" + guessNum + "l3";
    var let4 = "#g" + guessNum + "l4";
    var let5 = "#g" + guessNum + "l5";
    var let6 = "#g" + guessNum + "l6";

    //if anything is blank don't submit
    if($(let0).text() == "" || $(let1).text() == "" || $(let2).text() == "" || $(let3).text() == "" || $(let4).text() == "")
        return false;
    if(wordLen > 5 && $(let5).text() == "")
        return false;
    if(wordLen > 6 && $(let6).text() == "")
        return false;

    //we're at the last row, unfocus
    if(parseInt(guessNum)+1 > maxGuess)
        $(".focus").blur();

    submittedWord = $(let0).text() + $(let1).text() + $(let2).text() + $(let3).text() + $(let4).text() + $(let5).text() + $(let6).text();

    setCookie("word"+ guessNum, submittedWord);

    
    //validate word so mother doesn't cheat
    if(!ValidScrabbles.has(submittedWord))
    {
        showMessage("Invalid Word!");
        return;
    }

    //focus on next row letter 0
    var nextLet = "#g" + (parseInt(guessNum)+1) + "l0";
    $(".text").removeClass("focus");
    $(nextLet).addClass('focus');
    $(nextLet).focus();

    currentWord = getCookie("currentWord");
    //check letters in submitted word
    processLetter(currentWord,submittedWord,let0,0,1);
    processLetter(currentWord,submittedWord,let1,1,2);
    processLetter(currentWord,submittedWord,let2,2,3);
    processLetter(currentWord,submittedWord,let3,3,4);
    processLetter(currentWord,submittedWord,let4,4,5);
    if(wordLen > 5)
        processLetter(currentWord,submittedWord,let5,5,6);
    if(wordLen > 6)
        processLetter(currentWord,submittedWord,let6,6,7);

    //disable focusing on current elements
    $("#line" + parseInt(guessNum) + " > div").css("pointer-events", "none");

    guessNum = parseInt(guessNum) + 1;
    setCookie("guessNum", guessNum);
    var score = getCookie("score");
    //winner!!
    if(submittedWord == currentWord){
        score = parseInt(score) + parseInt(guessNum);
        setCookie("score",score);
        $(".text").css("pointer-events", "none");
        $(".text").removeClass("focus");
        $(".focus").blur();
        if(guessNum == 0)
            showMessage("What the?");
        if(guessNum == 1)
            showMessage("Excellent!");
        if(guessNum == 2)
            showMessage("Strong Work!");
         if(guessNum == 3)
            showMessage("Good Job!");
        if(guessNum == 4)
            showMessage("Satisfactory you are!");
        if(guessNum == 5)
            showMessage("That was rough!");
        if(wordLen < 7)
        {
            showContinue();
        }
        else//we beat all words, post score
            processWinner();
        return;
    }
    else if(parseInt(guessNum) > maxGuess)
    {
        showMessage("That was sad...")
    }

    //enable focusing on next elements
    $("#line" + parseInt(guessNum) + " > div").css("pointer-events", "auto");

  }

  function showContinue()
  {
    $("#continue").removeClass("hidden");
    $("#continue").show();
  }


  function processLetter(mWord, submittedWord, letterDiv, s, e)
  {
    var subLetter = submittedWord.substring(s,e);
    if(subLetter == mWord.substring(s,e))
    {
        $(letterDiv).addClass("validPos");
        $("#"+subLetter).removeClass("validLet invalid");
        $("#"+subLetter).addClass("validPos");
    }
    else if(mWord.includes(submittedWord.substring(s,e)))
    {
        $(letterDiv).addClass("validLet");
        if(!$("#"+subLetter).hasClass("validPos"))
        {
            $("#"+subLetter).removeClass("invalid");
            $("#"+subLetter).addClass("validLet");
        }
    }
    else
    {
        $(letterDiv).addClass("invalid");
        $("#"+subLetter).addClass("invalid");
    }
  }

  function processWinner()
  {
        isWinner = true;
        $("#userEntry").show();
        $("#userEntry").removeClass("hidden");
        $( "#userEntry" ).click(function() {
            //$( "#leaderboard" ).fadeOut( "slow" );
        });
  }

    function postScore(user, score)
    {   
        $.post( ResultsURL + "?user=" + user +"&score=" + score, function( data ) {
            
          });
    }

  function toggleLeaderBoard()
  {
    if(!$("#leaderboard").is(":visible"))
    {
        refreshLeaderBoard();
        $("#leaderboard").show();
        $("#leaderboard").removeClass("hidden");
        $( "#leaderboard" ).click(function() {
            $( "#leaderboard" ).fadeOut( "slow" );
        });
    }
    else 
        $( "#leaderboard" ).fadeOut( "slow" );
  }

  function refreshLeaderBoard()
  {
    $.getJSON( ResultsURL,  function(data){
        for (var i = 0; i < data.length; ++i ){
            $( "#leaderboard li:nth-child("+ (i+1)+")").text(data[i].user + " - " + data[i].score);
        }
      });
  }


  function showMessage(m)
  {
    $("#message").show();
    $("#message").removeClass("hidden");
    $("#message").text(m);
    setTimeout(function() {
        $(".message").fadeOut('slow');
    }, 1500);
  }


  function getTodaysIndex(length)
  {
    var today = new Date();
    var t = today.getFullYear() * today.getMonth() * today.getDate();
    t = 2022*1*5;
    return (t) % length;
  }

  function setInitCookies()
  {
    var guessNum = getCookie("guessNum");
    if (guessNum == "")//cookies have expired or user is new
    {
        setCookie("guessNum", "0");
        setCookie("wordLen", "5");
        setCookie("score",0);
    }
  }

  function setCurrentWord(length)
  {
  
    if(length == 5)
        setCookie("currentWord",WRDL5[getTodaysIndex(WRDL5.length)].toUpperCase());
    if(length == 6)
        setCookie("currentWord",WRDL6[getTodaysIndex(WRDL6.length)].toUpperCase());
    if(length == 7)
        setCookie("currentWord",WRDL7[getTodaysIndex(WRDL7.length)].toUpperCase());
  }



  function setCookie(cname,cvalue) {
    const d = new Date();
    //d.setTime(d.getTime() + (exdays*24*60*60*1000));
    d.setHours(24,0,0,0);//expire at midnight
    let expires = "expires=" + d.toUTCString();
    
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    return cvalue;
  }

  function eraseCookie(cname) {
    const d = new Date();
    d.setTime(d.getTime() + (-1*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + '' + ";" + expires + ";path=/";
  }
  
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }