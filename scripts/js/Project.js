//GLOBAL VARIABLES
//var personalFest;

//
//------------------------------------------------------------- PROJECT
//
function Codzen() {
	"use strict";
	//-------VARS
	this.Settings = new ProjectSettings();
	this.Utils = new ProjectUtils( this.Settings );
	this.Events = {
		init:"PROJECT_INIT",
		resize:"PROJECT_RESIZE"
	};

	//-------FIX REQUEST ANIMATION FRAME
	this.Utils.setRequestAnimationFrame( this.Settings.vendors );

	//-------METHODS
	this.init = function() {
		//RESIZE
		$( window ).resize( this.resize.bind( this ) );
		this.resize.call( this );

		$( document ).trigger( this.Events.init );
	};

	this.resize = function () {
		var offsHeigth = $(window).height(),
			offsetWidth = $(window).width();
		
		this.Settings.size = { width:offsetWidth, height:offsHeigth };

		$( document ).trigger( this.Events.resize );
	};
	
	//-------SETUP
	//JQUERY INIT
	$( document ).ready( function () {
		setTimeout( this.init.bind( this ), 100 );
	}.bind( this ));
}

//
//------------------------------------------------------------- SETTINGS
//
function ProjectSettings() {
	"use strict";
	this.PATH = "./";
	this.SERVER_PATH = "";
	this.vendors = ['ms', 'moz', 'webkit', 'o'];
	this.has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
	this.background = '#1b2028';
	this.pool = "abcdefghijklmnopqrstuvwxyz0123456789";
	this.lang = {
		pt: {
			title: "Parceiro Digital",
			subtitle: ["Nós fazemos o","mundo digital,","ser mais real"],
			contact: "Contato"
		},
		en: {
			title: "Digital Partner",
			subtitle: ["We make the","digital world,","be more real"],
			contact: "Contact"
		}
	};
}

//
//------------------------------------------------------------- UTILS
//
function ProjectUtils( settings ) {
	"use strict";
	var thisObj = this,
		Settings = settings;


	/************************************************************************ TRACK **********/
	this.track = function( events ) {
		var newValue = events.items;
			newValue.unshift( '_track' + events.type );

		console.log( newValue );

		//_gaq.push( newValue );
		newValue = null;
	};

	/************************************************************************ GENERAL **********/
	this.preventDefault = function( event ) {
		event.preventDefault();
	};
	this.setData = function( index ) {
		$(this).data( 'index', index );
	};
	this.createUniqueID = function() {
		return String(Math.random() * 99999999);
	};
	this.Interpolation = function( interpolation, min, max ) {
		var range = max - min,
			piece = (Math.max(min, Math.min(max, interpolation)) - min) / range;
		return piece;
	};
	this.shuffle = function(text) {
		var a, html = "", length = text.length,
			letters = Settings.pool.split("");

		for( a = 0; a<length; a++ ) {
			if (text[a] === " ")
				html += " ";
			else if (text[a] === ",")
				html += ",";
			else
				html += letters[ Math.round(Math.random()*(length-1)) ];
		}
		return html;
	};
	this.checkSpaces = function(index, text) {
		var a, length = text.length, check = false;
		for( a = 0; a<length; a++ ) {
			console.log
			if (text[a] === " ") {
				check = true;
				break;
			}
		}
		return check;
	};
	this.eraseText = function( container, callback ) {
		var newText,actualText,index=0,
			interval = setInterval(_do, 33);

		function _do() {
			actualText = container.html();
			newText = actualText.substr(0, actualText.length-1);
			
			$(container).html( newText );

			if ( newText === "" ) {
				clearInterval( interval );
				if ( callback ) callback();
			} else {
				index++;
			}
		}
	};
	this.write = function( container, text, callback ) {
		var interval = setInterval(_do, 33),
			initText = container.html(),
			length = text.length-1,
			newText, index = 0;
		
		_do();
		function _do() {
			newText = container.html();
			newText = thisObj.replaceAt(newText, index, text[index]);
			
			container.html( newText );

			if ( index === length ) {
				clearInterval( interval );
				if ( callback ) callback();
			} else {
				index++;
			}
		}
	};
	this.replaceAt=function(string, index, character) {
		return string.substr(0, index) + character + string.substr(index+character.length);
	};

	/************************************************************************ TWEEN **********/
	this.Tween = function() {
		var thisObjT = this;
		this.getEasing = function( data, language ) {
			var a, values, easing,
				tweenDefault = ( language === "css" ) ? ["cubic", "ease-out"] : ["linear"],
				temp = ( data !== undefined ) ? data.split('.') : tweenDefault,
				ease = temp[1],
				tween = temp[0];

			easing = (tween === "linear") ? thisObj.Easing[ tween ] : thisObj.Easing[ tween ][ ease ];

			return easing;
		};
		this.get = function ( props ) {
			var count = 0, calculation, now, delta, calculation, interpolation,
				durationSecs = props.timing,
				onUpdate = props.update,
				onComplete = props.complete,
				last = new Date().getTime(),
				interpolation = 0,
				easefunction = ( props.easeF !== undefined ) ? thisObjT.getEasing(props.easeF, 'js') : thisObj.Easing.linear;

			function interpolate() {
				now = new Date().getTime();
				delta = Math.min(((now - last) / 1000), durationSecs);
				calculation = easefunction( delta, props.start, props.end - props.start, durationSecs );
				interpolation = thisObj.Interpolation( calculation, props.start, props.end - props.start );

				if ( onUpdate !== undefined )
					onUpdate( calculation, interpolation );

				if ( delta >= durationSecs ) {
					if ( onComplete !== undefined )
						onComplete( props.end );
				} else
					requestAnimationFrame(interpolate);
			}

			interpolate();
		};
	};
	//EASING FUNCTIONS
	this.Easing = {
		//R.Penner easing t=time, b=start, c=delta, d=duration
		linear: function (t, b, c, d) { return c*t/d + b; },
		Quad: {
			easeIn: function(t, b, c, d) { return c*(t/=d)*t*t*t + b; },
			easeOut: function(t, b, c, d) {	return -c * ((t=t/d-1)*t*t*t - 1) + b; },
			easeInOut: function(t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; }
		},
		Quart: {
			easeIn: function (t, b, c, d) { return c*(t/=d)*t*t*t + b; },
			easeOut: function (t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; },
			easeInOut: function (t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t + b; return -c/2 * ((t-=2)*t*t*t - 2) + b; }
		},
		Quint: {
			easeIn: function (t, b, c, d) { return c*(t/=d)*t*t*t*t + b; },
			easeOut: function (t, b, c, d) { return c*((t=t/d-1)*t*t*t*t + 1) + b; },
			easeInOut: function (t, b, c, d) { if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b; return c/2*((t-=2)*t*t*t*t + 2) + b; }
		},
		Cubic: {
			easeIn: function (t, b, c, d) { t /= d; return c*t*t*t + b; },
			easeOut: function (t, b, c, d) { t /= d; t--; return c*(t*t*t + 1) + b; },
			easeInOut: function (t, b, c, d) { t /= d/2; if (t < 1) return c/2*t*t*t + b; t -= 2; return c/2*(t*t*t + 2) + b; }
		},
		Back: {
			easeIn: function (t, b, c, d, s) { if (s === undefined) s = 1.70158; return c*(t/=d)*t*((s+1)*t - s) + b;},
			easeOut: function (t, b, c, d, s) {
				if (s == undefined) s = 1.70158;
				return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			},
			easeInOut: function (t, b, c, d, s) { if (s === undefined) s = 1.70158; if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b; return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b; }
		},
		Elastic: {
			easeIn: function (t, b, c, d) { var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; },
			easeOut: function (t, b, c, d) { var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3; if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b; },
			easeInOut: function (t, b, c, d) { var s=1.70158;var p=0;var a=c; if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5); if (a < Math.abs(c)) { a=c; var s=p/4; } else var s = p/(2*Math.PI) * Math.asin (c/a); if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b; return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b; }
		}
	}


	/************************************************************************ LOADER **********/
	this.Loader = {
		imagesAlreadyLoaded: [],
		checkAlreadyLoaded: function (url) {
			var length = thisObj.Loader.imagesAlreadyLoaded.length,
				checked = false;

			if( length > 0 ) {
				for( var a = 0; a < length; a++ ) {
					if ( url === thisObj.Loader.imagesAlreadyLoaded[a] ) {
						checked = true;
						break;
					}
				}
			}

			return checked;
		},
		preload: function ( obj ) {
			var objResponse, cacheImage, urlImage,
				tempUrls = obj.urlImage,
				callBackEach = obj.each,
				callBackComplete = obj.complete,
				loadedCounter = 0,
				urlImg = ( Object.prototype.toString.call(tempUrls) !== '[object Array]' ) ? [ tempUrls ] : tempUrls,
				imagesLength = urlImg.length;

			function completeLoad( event ) {
				objResponse = { element:this, url:event.data.url };
				loadedCounter ++;
				if ( callBackEach )
					callBackEach.call( this, objResponse );

				if ( ( loadedCounter >= imagesLength ) && ( cacheImage !== null ) ) {
					if ( callBackComplete )
						callBackComplete.call( this, objResponse );
				}
			}

			for ( var i = 0; i < imagesLength; i++ ) {
				cacheImage = document.createElement('img' );
				urlImage = urlImg[ i ];

				$( cacheImage ).on( 'load', {url:urlImage}, completeLoad );
				cacheImage.src = urlImage;

				if (!thisObj.Loader.checkAlreadyLoaded( urlImage ) ) {
					thisObj.Loader.imagesAlreadyLoaded.push( urlImage );
					$( '.cache' ).append( cacheImage );
				}
			}
		}
	};


	/************************************************************************ FIX NATIVE **********/
	this.setRequestAnimationFrame = function(vendors) {
		// requestAnimationFrame polyfill adapted from Erik Möller
		// fixes from Paul Irish and Tino Zijdel
		// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
		var animating,
			lastTime = 0,
			requestAnimationFrame = window.requestAnimationFrame,
			cancelAnimationFrame = window.cancelAnimationFrame;

		for(; lastTime < vendors.length && !requestAnimationFrame; lastTime++) {
			requestAnimationFrame = window[ vendors[lastTime] + "RequestAnimationFrame" ];
			cancelAnimationFrame = cancelAnimationFrame ||
				window[ vendors[lastTime] + "CancelAnimationFrame" ] ||
				window[ vendors[lastTime] + "CancelRequestAnimationFrame" ];
		}
		if ( requestAnimationFrame ) {
			// use rAF
			window.requestAnimationFrame = requestAnimationFrame;
			window.cancelAnimationFrame = cancelAnimationFrame;
		} else {
			// polyfill
			window.requestAnimationFrame = function( callback, element ) {
				var currTime = new Date().getTime(),
					timeToCall = Math.max( 0, 33 - ( currTime - lastTime ) ),
					id = setTimeout( function() {
						callback( currTime + timeToCall );
					}, timeToCall );
				lastTime = currTime + timeToCall;
				return id;
			};
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
		}
	};
}