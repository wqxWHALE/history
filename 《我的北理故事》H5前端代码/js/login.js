function Login(){

  (function(){
    var originWinHeight=$(window).height();
    function login(){
      var winHeight=$(window).height();
      var inputHeight=$('.input-box input').height();
      var logoHeight=$('.logo').height();
      $('#login-bg').css({
        height:originWinHeight+"px"
      });
      $('.input-box').css({
        height:2*inputHeight+"px"
      });

      $('.logo').css({
        top:$(window).height()/2-$('.logo').height()-2*inputHeight+"px"
      });


      var pad=Math.abs(parseInt($('.input-box').css('padding-top'))-parseInt($('.input-box').css('padding-bottom')));

        if(winHeight<originWinHeight){
          $('.input-box').css({
            bottom:-winHeight+"px"
          });
          $('.logo').css({
            top:$(window).height()/2-$('.logo').height()-pad+"px"
          });
        }else{
          $('.input-box').css({
            bottom:-winHeight/2-inputHeight-pad+"px"
          });
        }

    }
    $(window).on("resize",login);
    $(document).on("ready",login);
  })();
}
$(document).ready(function(){
  Login();
});
