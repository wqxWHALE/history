function main(){

    (function(){
      function imgSize(){
        $('.all').css({
          height:$(window).height()+"px"
        });
        $('#slideBox .li-bg').css({
          width:'100%',
          height:$(window).height()+"px"
        });
        $('.li-img-box').css({
          width:$(window).width()+"px"
        });
        $('#slideBox img').css({
          height:$(window).height()+"px",
          width:$('.li-img-box').width()+"px",
          maxWidth:"640px"
        });
        $('#slideBox .li-02 span img').css({
          height:30+"px",
          width:30+"px"
        });
        $('#slideBox .fullWin').css({
          width:'100%',
          maxWidth:'100%'
        });
      }
      $(window).on("resize",imgSize);
    $(document).on("ready",imgSize);
    })();

    (function(){
      function showLiText(){
          var w=$('.container').width();
          var t=$('#slideBox ul').css('-webkit-transform');
          var results=t.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);
          if(results!=null){
            if($('#wait').css('display')=='none'){
              if(results.slice(5, 8)=="0,0"){
                  setTimeout(function(){
                    $('.li-01 .img-box').fadeIn(3000);
                  }, 500);
                  $('.img01-text02').addClass('move-right-show02');
                  $('.img01-text01').addClass('move-right-show01');
              }
              if(results.slice(5, 8)=="-"+w+",0"){
                setTimeout(function(){
                  $('.li-02 .img-box').fadeIn(3000);
                }, 500);
                  $('.img02-text01').addClass('hide-show02');
                  $('.img02-text02').addClass('hide-show01');
                  $('.img02-tx').addClass('hide-show01');
              }
              if(results.slice(5, 8)=="-"+2*w+",0"){
                //setTimeout(function(){
                  //$('.li-03 .img-box-li-03 img').fadeIn(3000);
                //  }, 500);
                  $('.li-03 .img-box-li-03 img').addClass('move-bottom-show');
                  $('.img03-text01').addClass('move-right-show01');
                  $('.img03-text02').addClass('move-right-show02');
              }
              if(results.slice(5, 8)=="-"+3*w+",0"){
                setTimeout(function(){
                  $('.li-04 .img-box').fadeIn(3000);
                }, 500);
                  $('.img04-text01').addClass('move-right-show01');
                  $('.img04-text02').addClass('move-right-show02');
              }
              if(results.slice(5, 8)=="-"+4*w+",0"){
                setTimeout(function(){
                  $('.li-05 .img-box').fadeIn(3000);
                }, 500);
                  $('.img05-text01').addClass('move-right-show01');
                  $('.img05-text02').addClass('move-right-show02');
              }
              if(results.slice(5, 8)=="-"+5*w+",0"){
                setTimeout(function(){
                  $('.li-06 .img-box').fadeIn(3000);
                }, 500);
                  $('.img06-text01').addClass('move-right-show01');
                  $('.img06-text02').addClass('move-right-show02');
              }
              if(results.slice(5, 8)=="-"+6*w+",0"){
                setTimeout(function(){
                  $('.li-07 .img-box').slideToggle(4000 , function(){
                    $('.li-07 .img-box').css({
                      display:'block'
                    });
                  $(this).stop();
                });
              }, 500);
                $('.img07-text01').addClass('img07-text01-show');
                $('.img07-text02').addClass('move-right-show02');
                $('.img07-text0201').addClass('img07-text0201-show');
                $('.img07-text0202').addClass('img07-text0202-show');
                $('.img07-text0203').addClass('img07-text0203-show');
                $('.img07-text0204').addClass('img07-text0204-show');
            }
            if(results.slice(5, 8)=="-"+7*w+",0"){
              setTimeout(function(){
                $('.li-08 .img-box').fadeIn(3000);
              }, 500);
                $('.li-08 .img08-text01').addClass('move-right-show01');
                $('.li-0801 .img08-text01').addClass('move-right-show01');
                $('.li-0802 .img08-text01').addClass('hide-show01');
            }
            if(results.slice(5, 8)=="-"+8*w+",0"){
              setTimeout(function(){
                $('.li-09 .img-box').fadeIn(2000);
              }, 500);
            }
          }
          }
          
      }
      var aniSence=setInterval(function(){
          showLiText();
        },1);
      // $(document).on("ready",showLiText);
    })();
}

$(document).ready(function(){
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('iPod') != -1 || navigator.userAgent.indexOf('iPad') != -1) {
      main();
  }
  else {
      main();
      alert("请使用移动设备观看哦亲~");
  }
});
