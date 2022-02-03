var ValidScrabbles = new Set();

function load() 
{

    //load valid scrabble words
    $.getJSON("validScrabbles.json", function(data){
        for (var key in data){
            ValidScrabbles.add(data[key]);
        }
    });
    //let guessNum = getCookie("guessNum");
    //if (guessNum == "") 
        setCookie("guessNum", "0", 1);
    //let wxrd = getCookie("wxrd");
    //if(wxrd == "")
        setCookie("wordLen", "5", 1);
    
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
            var curFocus = $(this);
            var nextFocus = $(this).next('.text');
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
}



  const wxrd4 = ["AREA","UNCLE","AUTO","AWAY"];

  function submitWord()
  {
    var guessNum = getCookie("guessNum");
    var wordLen = getCookie("wordLen");
    var wordPos = 1;//this needs work to pick daily word
    const maxGuess = 5;
    var submittedWord;

    var let0 = "#g" + guessNum + "l0";
    var let1 = "#g" + guessNum + "l1";
    var let2 = "#g" + guessNum + "l2";
    var let3 = "#g" + guessNum + "l3";
    var let4 = "#g" + guessNum + "l4";

    //if anything is blank don't submit
    if($(let0).text() == "" || $(let1).text() == "" || $(let2).text() == "" || $(let3).text() == "" || $(let4).text() == "")
        return false;

    //we're at the last row, unfocus
    if(parseInt(guessNum)+1 > maxGuess)
        $(".focus").blur();

    submittedWord = $(let0).text() + $(let1).text() + $(let2).text() + $(let3).text() + $(let4).text();

    
    //validate word so mother doesn't cheat
    if(!ValidScrabbles.has(submittedWord))
    {
        $("#message").show();
        $("#message").removeClass("hidden");
        $("#message").text("Invalid Word!");
        setTimeout(function() {
            $(".message").fadeOut('slow');
        }, 1000);
        return;
    }

    //focus on next row letter 0
    var nextLet = "#g" + (parseInt(guessNum)+1) + "l0";
    $(".text").removeClass("focus");
    $(nextLet).addClass('focus');
    $(nextLet).focus();

    //check exact positions
    var letter = submittedWord.substring(0,1);
    if(letter == wxrd4[wordPos].substring(0,1))
    {
        $(let0).addClass("validPos");
        $("#"+letter).addClass("validPos");
    }
    else if(wxrd4[wordPos].includes(submittedWord.substring(0,1)))
    {
        $(let0).addClass("validLet");
        if(!$("#"+letter).hasClass("validPos"))
            $("#"+letter).addClass("validLet");
    }
    else
    {
        $(let0).addClass("invalid");
        $("#"+letter).addClass("invalid");
    }
    letter = submittedWord.substring(1,2);
    if(letter == wxrd4[wordPos].substring(1,2))
    {
        $(let1).addClass("validPos");
        $("#"+letter).addClass("validPos");
    }
    else if(wxrd4[wordPos].includes(submittedWord.substring(1,2)))
    {
        $(let1).addClass("validLet");
        if(!$("#"+letter).hasClass("validPos"))
            $("#"+letter).addClass("validLet");
    }
    else
    {
        $(let1).addClass("invalid");
        $("#"+letter).addClass("invalid");
    }
    letter = submittedWord.substring(2,3);
    if(letter == wxrd4[wordPos].substring(2,3))
    {
        $(let2).addClass("validPos");
        $("#"+letter).addClass("validPos");
    }
    else if(wxrd4[wordPos].includes(submittedWord.substring(2,3)))
    {
        $(let2).addClass("validLet");
        if(!$("#"+letter).hasClass("validPos"))
            $("#"+letter).addClass("validLet");
    }
    else
    {
        $(let2).addClass("invalid");
        $("#"+letter).addClass("invalid");
    }
    letter = submittedWord.substring(3,4);
    if(submittedWord.substring(3,4) == wxrd4[wordPos].substring(3,4))
    {
        $(let3).addClass("validPos");
        $("#"+letter).addClass("validPos");
    }
    else if(wxrd4[wordPos].includes(submittedWord.substring(3,4)))
    {
        $(let3).addClass("validLet");
        if(!$("#"+letter).hasClass("validPos"))
            $("#"+letter).addClass("validLet");
    }
    else
    {
        $(let3).addClass("invalid");
        $("#"+letter).addClass("invalid");
    }

    letter = submittedWord.substring(4,5);
    if(submittedWord.substring(4,5) == wxrd4[wordPos].substring(4,5))
    {
        $(let4).addClass("validPos");
        $("#"+letter).addClass("validPos");
    }
    else if(wxrd4[wordPos].includes(submittedWord.substring(4,5)))
    {
        $(let4).addClass("validLet");
        if(!$("#"+letter).hasClass("validPos"))
            $("#"+letter).addClass("validLet");
    }
    else
    {
        $(let4).addClass("invalid");
        $("#"+letter).addClass("invalid");
    }

    //winner!!
    if(submittedWord == wxrd4[wordPos]){
        if(guessNum == 0)
            showMessage("Excellent!");
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
        return;
    }
    else if(parseInt(guessNum)+1 > maxGuess)
    {
        showMessage("That was sad...")
    }
    
    //disable focusing on current elements
    $("#line" + parseInt(guessNum) + " > div").css("pointer-events", "none");

    guessNum = parseInt(guessNum) + 1;
    setCookie("guessNum", guessNum, 1);

    //enable focusing on next elements
    $("#line" + parseInt(guessNum) + " > div").css("pointer-events", "auto");

  }


  function showMessage(m)
  {
    $(".text").css("pointer-events", "none");
    $(".text").removeClass("focus");
    $(".focus").blur();
    $("#message").show();
    $("#message").removeClass("hidden");
    $("#message").text(m);
    setTimeout(function() {
        $(".message").fadeOut('slow');
    }, 1500);
  }



  function setCookie(cname,cvalue,exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires=" + d.toUTCString();
    
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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