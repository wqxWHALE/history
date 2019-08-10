/* =Main INIT Function
-------------------------------------------------------------- */
function initializeForm() {

	"use strict";

	//IE9 RECOGNITION
	if (jQuery.browser.msie && jQuery.browser.version == 9) {

		jQuery('html').addClass('ie9');
	}
	
	
	//NAVIGATION DETECT
	(function() {
	    function navDetect(){

			var windowWidth = $(window).width();
				
			if ( windowWidth > 1199 ) {
				$('nav, header').removeClass('mobile');
				$('nav, header').addClass('desktop');
			} else {
				$('nav, header').removeClass('desktop');
				$('nav, header').addClass('mobile');
			}
			
	    }

	    $(window).on("resize", navDetect);
	    $(document).on("ready", navDetect);
	})();

	//NAVIGATION CUSTOM FUNCTION
	(function() {
		function navigationInit(){

			//MOBILE BUTTON
			$('.nav-button').click(function() {
				if($('nav').is(":visible")) {
					$('nav').slideUp();
					$('.nav-button').removeClass('open');
				} 
				else {
					$('nav').slideDown();
					$('.nav-button').addClass('open');
				}
			});


			//MAGIC LINE
			$(function() {

			    var $el, leftPos, newWidth,
			        $mainNav = $(".nav-content");
			   
			    var $magicLine = $("#magic-line");
			    
			    $magicLine
			        .width($("nav.desktop .current-page").width() - 0 + "px")
			        .css("left", $(".current-page").position().left)
			        .data("origLeft", $magicLine.position().left)
			        .data("origWidth", $(".current-page").width());
			        
			    $(".nav-content li.upper").hover(function() {
			        $el = $(this);
			        leftPos = $el.position().left;
			        newWidth = $el.width();
			        $magicLine.stop().animate({
			            left: leftPos,
			            width: newWidth
			        });
			    }, function() {
			        $magicLine.stop().animate({
			            left: $magicLine.data("origLeft"),
			            width: $magicLine.data("origWidth")
			        });    
			    });

			    $(window).scroll(function() {
			       $magicLine.width($("nav.desktop .current-page").width() - 35 + "px").css("left", $(".current-page").position().left); 
			    });

			});
		}

		$(document).on("ready", navigationInit);
	})();

	(function() {
		function navigationSticky(){
			var scrollTop = $(window).scrollTop();

			if (scrollTop > 550 ) {   
				$('nav, header').addClass('sticky');
				$('.sticky-head').slideDown();
				$('header.desktop.sticky, nav.desktop.sticky').stop().animate({
					top: 15
				});
			} else {
				$('header.desktop.sticky, nav.desktop.sticky').stop().animate({
					top: 0,},
					1, function() {
						$('nav, header').removeClass('sticky');
						$('.sticky-head').fadeOut('slow'); 
				}); 
			}
		
		}

		$(window).on("scroll", navigationSticky);
		$(window).on("resize", navigationSticky);
	})();

};
/* END ------------------------------------------------------- */

/* =Document Ready Trigger
-------------------------------------------------------------- */
$(document).ready(function(){

	initializeForm();

});
/* END ------------------------------------------------------- */