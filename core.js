function load() 
{
    let guessNum = getCookie("guessNum");
    if (guessNum == "") 
        setCookie("guessNum", "0", 1);
    let wxrd = getCookie("wxrd");
    if(wxrd == "")
        setCookie("wxrd", "4", 1);

    $(".text").keypress(function(event) {
        if (event.keyCode === 13) {
            $("#submit").click();
        }
        //if (event.keyCode >= 65 && event.keyCode <=90) {
            $(this).text(event.key.toUpperCase());
        //}
        });
    $(".text").keyup(function () { //TODO change to not alpha
        if($(this).text().length === 1 && event.keyCode != 8) {
            $(this).next('.text').focus();
        }
        else if ( event.keyCode === 8) {
            $(this).prev('.text').focus();
            $(this).text("");
        }
    });
}



  const wxrd4 = ["area","army","auto","away"];

  function submitWord()
  {
    var guessNum = getCookie("guessNum");
    var wxrd = getCookie("wxrd");
    var wordPos = 1;//this needs work to pick daily word
    var submittedWord;
 
        var let0 = "#g" + guessNum + "l0";
        var let1 = "#g" + guessNum + "l1";
        var let2 = "#g" + guessNum + "l2";
        var let3 = "#g" + guessNum + "l3";

        if($(let0).val() == "" || $(let1).val() == "" || $(let2).val() == "" || $(let3).val() == "")
            return false;
        submittedWord = $(let0).val() + $(let1).val() + $(let2).val() + $(let3).val();
        //check exact positions
        if(submittedWord.substring(0,1) == wxrd4[wordPos].substring(0,1))
            $(let0).addClass("validPos");
        else if(wxrd4[wordPos].includes(submittedWord.substring(0,1)))
            $(let0).addClass("validLet");
        else
            $(let0).addClass("invalid");
        if(submittedWord.substring(1,2) == wxrd4[wordPos].substring(1,2))
            $(let1).addClass("validPos");
        else if(wxrd4[wordPos].includes(submittedWord.substring(1,2)))
            $(let1).addClass("validLet");
        else
            $(let1).addClass("invalid");
        if(submittedWord.substring(2,3) == wxrd4[wordPos].substring(2,3))
            $(let2).addClass("validPos");
        else if(wxrd4[wordPos].includes(submittedWord.substring(2,3)))
            $(let2).addClass("validLet");
        else
            $(let2).addClass("invalid");
        if(submittedWord.substring(3,4) == wxrd4[wordPos].substring(3,4))
            $(let3).addClass("validPos");
        else if(wxrd4[wordPos].includes(submittedWord.substring(3,4)))
            $(let3).addClass("validLet");
        else
            $(let3).addClass("invalid");
        
        
        $(let0).prop('disabled', true);
        $(let1).prop('disabled', true);
        $(let2).prop('disabled', true);
        $(let3).prop('disabled', true);

        guessNum = parseInt(guessNum) + 1;
        setCookie("guessNum", guessNum, 1);
        let0 = "#g" + guessNum + "l0";
        let1 = "#g" + guessNum + "l1";
        let2 = "#g" + guessNum + "l2";
        let3 = "#g" + guessNum + "l3";

        $(let0).prop('disabled', false);
        $(let1).prop('disabled', false);
        $(let2).prop('disabled', false);
        $(let3).prop('disabled', false);
  }



  function keyup()
  {
      var x;
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