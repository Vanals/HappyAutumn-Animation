/*  Autumn Greeting Card -- js */

(function($){
	'use strict';

	// declare actors here
	var $backFallingLeaves = $('#brownLeaf, #orangeLeaf, #redLeaf'),
			$textLine1 = ('.text-line-1'),
			$textLine2 = ('.text-line-2'),
			$textGreeting = ('.text-greeting'),
			$treeLeaves = $('[id^=treeleaf]'),
			$floorLeaves = $('[id^=floorleaf]'),
			$bird = $('#Bird'),
			$birdHat = $bird.find('#BirdHat'),
			$birdEyes = $bird.find('#leftEye, #rightEye'),
			$nest = $('#NestAndLeaves'),
			$tree = $('#tree_trunk'),
			$cardContainer = $('.card.container'),
			$body = $('body')

	// clear stage
	function clearStage() {
		// GIVEN we are gonna animate more elements and let them do different things in a timeline we use a TimelineMax
		// instead of a simple TweenMax. Then we can use methods as "set"to change they properties
		var clearTl = new TimelineMax();
		clearTl
				.set($backFallingLeaves, {autoAlpha: 0})
				.set($textLine1, {autoAlpha: 0})
				.set($textLine2, {autoAlpha: 0})
				.set($textGreeting, {autoAlpha: 0})
				.set($treeLeaves, {autoAlpha: 0})
				.set($bird, {y:'+=65', autoAlpha: 0})
				.set($nest, {autoAlpha:0})
				.set($tree, {autoAlpha:0})
				.set($floorLeaves, {y: '+=275', onComplete: showContainer})
		;

		// To a void a flash -  when all the svg were not hidden yet, we directly set in our css
		//  the container as hidden. Now we are creating and call on complete, a function which show again the container, in order
		//  to be able to slowly show again the single svgs.
		function showContainer() {
			$cardContainer.css('display', 'block');
		}

		return clearTl;
	}
	// enter floor vegetation
	function enterFloorVegetation() {
		var fleavesTl = new TimelineMax();

		fleavesTl
						.staggerTo($floorLeaves, 1, {y:0, ease: Back.easeOut}, 0.01)
						// We use staggerTo instead of simply .to, when we want to stagger more svg element. For example: modify, move them with a
						// delay one from the other. When one transition for one SVG is finish the next transition start with a relative delay than the previous transition.
						// In this way we are moving every svg item in the floorLeaves group to y:0, every svg will move after 0.2 the previous edit started.
						.fromTo($tree, 1, {scaleY:0.2, autoAlpha:0, transformOrigin:'center bottom'}, {scaleY:1, autoAlpha:1, transformOrigin:'center bottom', ease: Back.easeOut})
						.fromTo($tree, 1, {scaleX:0.2, autoAlpha:0, transformOrigin:'center bottom'}, {scaleX:1, autoAlpha:1, transformOrigin:'center bottom', ease: Back.easeOut}, "-=0.9")
						// Here we are giving an offset but given that we are delaying only 1 element we dont' use staggerTo, to stagger more elements at the same time.

		return fleavesTl;
	}
	// enter tree ..stuff
	function enterTreeStuff() {
		var treeStuffTl = new TimelineMax();

		treeStuffTl
		// given is an array of SVGs we use a stagger function. And given we want to scale the leaves from a smaller size then the default one, we use fromTo
						.staggerFromTo($treeLeaves, 0.5 ,{scale:0.2, autoAlpha:0, transformOrigin:'center bottom'}, {scale:1, autoAlpha:1, transformOrigin:'center bottom'}, 0.02)
						.fromTo($nest, 1, {y:0, scale:0.2, autoAlpha:0, transformOrigin: 'center center'}, {y:'-=15', scale:1, autoAlpha:1, transformOrigin: 'center center', ease: Elastic.easeOut}, '+=0.1')
						.to($nest, 0.3, {y:'+=15', ease: Bounce.easeOut}, '-=0.2')
						.add('nest-pop-in')
						// use set instead of to, because there is not transition, we don't want any, we want really  to set the hat like that and that is.
						.set($birdHat, {rotation:12, x:'+=6'})
						.to($bird, 1.4, {y:'-=39', autoAlpha:1, ease: Power4.easeInOut})
						.add('bird-blinking')
						.set($birdEyes, {autoAlpha:0})
						.set($birdEyes, {autoAlpha:1},'+=0.2')
						.set($birdEyes, {autoAlpha:0},'+=0.3')
						.set($birdEyes, {autoAlpha:1},'+=0.2')
						.add('bird-blinked')
						.to($bird, 0.8, {y:'-=34', ease: Power4.easeInOut})
						.to($bird, 0.8, {y:'+=8', ease: Back.easeOut})
						.to($birdHat, 0.4, {y:'-=12'}, '-=0.6')
						.to($birdHat, 0.3, {y:0, rotation: 0, x: 0, onComplete: startBlinking}, '-=0.2')
						;
						// HOW TO LOOP WITH TIMELINE MAX ----------
						function startBlinking() {
							var birdBlinksTl = new TimelineMax({repeat: -1, repeatDelay: 5});

							birdBlinksTl
										.set($birdEyes, {autoAlpha:0})
										.set($birdEyes, {autoAlpha:1},'+=0.2')
										.set($birdEyes, {autoAlpha:0},'+=1.3')
										.set($birdEyes, {autoAlpha:1},'+=0.2')
						}
		return treeStuffTl;
	}

	// enter the greeting text
		function enterGreeting() {
			var greetingTl = new TimelineMax();

			greetingTl
				.fromTo($textLine1, 1, {y:'-=50'}, {y:0, autoAlpha:1, onComplete: startLoops})
				.fromTo($textLine2, 1, {y:'-=25'}, {y:0, autoAlpha:1})
				.staggerFromTo($textGreeting, 0.5, {scale:2, autoAlpha:0, transformOrigin:'center center'},
					{scale:1, autoAlpha:1, transformOrigin:'center center'}, 0.1)

				function startLoops() {
					// start background color loop
					var colors = ['#edcc93', '#f7e3ae', '#f3ebcc', '#edcc93'];
					var bgTl = new TimelineMax({repeat:-1, repeatDelay: 2});

							bgTl
								.to($body, 3, {backgroundColor: colors[0]}, '+=2')
								.to($body, 3, {backgroundColor: colors[1]}, '+=2')
								.to($body, 3, {backgroundColor: colors[2]}, '+=2')
								.to($body, 3, {backgroundColor: colors[3]}, '+=2')
							;

					//  start falling leaves loop
					// HOW TO LOOP WITH SIMPLY TWEENMAX -  the diffeence looks like we can't give the property we gave to twiinglineMAX
					TweenMax.set($backFallingLeaves, {y:-100, autoAlpha: 0.2})
					TweenMax.to("#brownLeaf", 10 + Math.random() * 10, {y:'+=1200', autoAlpha:1, ease: Linear.easeNone, onComplete: repeatFall, onCompleteParams:['#brownLeaf']})
					TweenMax.to("#redLeaf", 10 + Math.random() * 10, {y:'+=1200', autoAlpha:1, ease: Linear.easeNone, onComplete: repeatFall, onCompleteParams:['#redLeaf']})
					TweenMax.to("#orangeLeaf", 10 + Math.random() * 10, {y:'+=1200', autoAlpha:1, ease: Linear.easeNone, onComplete: repeatFall, onCompleteParams:['#orangeLeaf']})
				}

				function repeatFall(leafId) {
					var range = Math.random() * 800,
							rotation = Math.random() * 360,
							offset = 400,
							newXPosition = range - offset;

					TweenMax.set(leafId, {x: newXPosition, y:-100, autoAlpha: 0.2, rotation: rotation})
					TweenMax.to(leafId, 10 + Math.random() * 10, {y:'+=1200', autoAlpha:1, ease: Linear.easeNone, onComplete: repeatFall, onCompleteParams: [leafId]})
				}

			return greetingTl;
		}

	// the GO function ...to kick things all off
	function go() {
		console.log("Go!");
		var masterTl = new TimelineMax();

		masterTl
					.add(clearStage(), 'scene-clear')
					.add(enterFloorVegetation(), 'scene-floor-vegetation')
					.add(enterTreeStuff(), 'scene-enter-treeStuff')
					.add(enterGreeting(), 'scene-greeting')
	}

	go();
})(jQuery);
