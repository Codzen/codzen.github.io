(function() {
	"use strict";
	var Project = new Codzen(),
		Utils = Project.Utils,
		Settings = Project.Settings,
		experience = new Experience(),
		Tween = new Utils.Tween(),
		LANG = new Lang();

	//EXAMPLE
	function Experience() {
		//VARS
		var _scope = this,
			canvas = $("canvas").get(0),
			ctx = canvas.getContext("2d");

		//METHODS
		function init() {
			ctx.fillStyle = Settings.background;

			/*config();
			loaderOut();*/

			entrada();
		}
		function entrada() {
			Tween.get({
				start: 0,
				end: 100,
				timing: 1,
				easeF: "Quint.easeInOut",
				update: function(number, interpolation) {
					ctx.clearRect( 0, 0, Settings.size.width, Settings.size.height );
					drawLine( interpolation );
				},
				complete: function() {
					Tween.get({
						start: 0,
						end: 100,
						timing: 1.5,
						easeF: "Quint.easeInOut",
						update: function(number, interpolation) {
							if (number>5) ctx.clearRect( 0, 0, Settings.size.width, Settings.size.height );
							drawBackground( interpolation );
						},
						complete: loaderIn
					});
				}
			});
		}

		function config() {
			$(document.body).css("background-color", Settings.background);
			$(canvas).remove();
			setVideo();
		}

		function setVideo() {
			if ( Settings.size.width < 960 ) {
				$(".iframe-background").attr("src", "");
			} else {
				if ( $(".iframe-background").attr("src") === "" )
					$(".iframe-background").attr("src", "https://player.vimeo.com/video/134987859?api=1&player_id=player-home-bg&autoplay=1&loop=1&badge=0&byline=0&portrait=0&title=0&playbar=0&fullscreen=0");
			}
		}
		function loaderIn() {
			config();
			$(".loader .background").animate({ height: '100%', top: 0 }, 1000);
			setTimeout(function() {
				$(".loading").fadeIn(500);
			}, 300);
			setTimeout(loaderOut, 3000);
		}
		function loaderOut() {
			$(".loading").fadeOut(500);
			setTimeout(function() {
				$(".loader .background").animate({ height: '0', top: "50%" }, 500, function() {
					$(".loader").remove();
				});
			}, 300);

			setTimeout(function() {
				$(".iframe-wrapper").fadeIn(1000);
				$(".animate-in").each(function(index) {
					removeClass($(this), index, "animate-in");
				});
				setTimeout(function() {
					$(".menu-topo .out").each(function(index) {
						removeClass($(this), index, "out");
					});
				}, 1100);
			},1000);
		}
		function removeClass(elem, index, _class) {
			var delay = index*120;
			setTimeout(function() {
				elem.removeClass(_class);
			}, delay);
		}

		function drawLine( percent ) {
			var newWidth, newHeight,
				posX = Settings.size.width/2,
				posY = Settings.size.height/2,
				gap = 2;
			
			ctx.strokeStyle = Settings.background;

			newWidth = (posX) * percent;
			newHeight = posY * percent;
			ctx.beginPath();
			ctx.moveTo(posX-newWidth, posY-newHeight);
			ctx.lineTo(posX+newWidth, posY+newHeight);
			ctx.stroke();
			ctx.closePath();
		}
		function drawBackground( percent ) {
			var newWidth, newHeight, newWidthInv, newHeightInv;

			ctx.fillStyle = Settings.background;
			
			newWidth = Settings.size.width * percent;
			newHeight = Settings.size.height * percent;
			newWidthInv = Settings.size.width - newWidth;
			newHeightInv = Settings.size.height - newHeight;
			
			ctx.beginPath();
			ctx.lineTo(0, 0); //TOP LEFT
			ctx.lineTo(0, newHeight); //TOP - BOTTOM LEFT
			ctx.lineTo(newWidthInv, Settings.size.height); //BOTTOM LEFT - RIGHT
			ctx.lineTo(Settings.size.width, Settings.size.height); //BOTTOM RIGHT
			ctx.lineTo(Settings.size.width, newHeightInv); //BOTTOM - TOP RIGHT
			ctx.lineTo(newWidth, 0); // TOP RIGHT - LEFT
			ctx.closePath();

			ctx.fill();
		}

		function onResize() {
			var newHeight = "";
			
			if ( Settings.size.height > $(".page-container").outerHeight() ) {
				newHeight = Settings.size.height;
				$(document.body).addClass("floating");
			} else {
				$(document.body).removeClass("floating");
			}

			setVideo();

			$(".loader").css({
				"margin-top": -Settings.size.height/4,
				"margin-left": -Settings.size.width/4
			});
			$(".loader .background").css("background-size", (Settings.size.width/2)+"px "+(Settings.size.height/2)+"px");
			$(".canvas-mask").attr("width", Settings.size.width).attr("height", Settings.size.height);
			ctx.rect( 0, 0, Settings.size.width, Settings.size.height );
			$(".main-container").css( "height", newHeight );
		}

		//ADD EVENTS
		$( document ).bind( "PROJECT_INIT", init );
		$( document ).bind( "PROJECT_RESIZE", onResize );
	}

	function Lang() {
		var _scope = this;

		this.init = function() {
			$(".lang-button").on("click", handlerButtons);

			_scope.set( $(".menu-topo .menu-item").eq(0).find(".lang-button").attr("data-lang") );
		};
		this.set = function(lang) {
			$(document.body).removeClass("pt en").addClass(lang);
			$(".main-title").html( Settings.lang[lang].title );
			for (var a = 0, length = Settings.lang[lang].subtitle.length; a < length; a++) {
				$(".subtitle .sub"+a).html( Settings.lang[lang].subtitle[a] );
			}
			$(".contact .title").html( Settings.lang[lang].contact );

			$(".menu-topo").find(".active").removeClass("active");
			$(".menu-topo").find(".lang-"+lang).addClass("active");
		};
		this.change = function( lang ) {
			$(document.body).removeClass("pt en").addClass(lang);
			$(".menu-topo").find(".active").removeClass("active");
			$(".menu-topo").find(".lang-"+lang).addClass("active");

			_scope.shuffle( $(".main-title"), Settings.lang[lang].title );
			for (var a = 0, length = Settings.lang[lang].subtitle.length; a < length; a++) {
				_scope.shuffle( $(".subtitle .sub"+a), Settings.lang[lang].subtitle[a] );
			}
			_scope.shuffle( $(".contact .title"), Settings.lang[lang].contact );
		};
		this.shuffle = function( container, text ) {
			var interval, newText, shuffleText, html, actualText,
				length = text.length,
				textArray = text.split(""),
				index = 0;

			html = Utils.shuffle(text);
			Utils.eraseText(container, function() {
				Utils.write( container, html );
				setTimeout(function() {
					Utils.write( container, text );
				}, 200);
			});
		};

		function handlerButtons(event) {
			event.preventDefault();

			_scope.change( $(event.currentTarget).attr("data-lang") );
		}

		this.init();
	}
})();