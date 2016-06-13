const ESC = 27

function hideNav() {
	if ($("nav").css("top") == "0px") {
	   $("nav").css("top", "-80px")
	   console.log("hide nav")
    }
}

function showNav() {
	if ($("nav").css("top") == "-80px") {
		$("nav").css("top", 0)
		console.log("show nav")
	}
}

function showPopup() {
	hideNav()
	$("body").css("overflow-y", "hidden")
	$("#popup").fadeIn("fast", e => {
		$("#popup .program-container").slideDown( e => {
			balanceProgram()
		})
	})
	console.log("show popup")
}

function hidePopup() {
	$("body").css("overflow-y", "auto")
	$("#popup .program-container").slideUp( e => {
		$("#popup").fadeOut("fast")
	})
	console.log("hide popup")
}

const days = ["industry_day", "science_day"]

function loadProgram() {
	for (var day of days) {
		var link = `program/${day}.html`
		$.ajax(link, {async: false}).done( html => {
			$("#popup .program-container").append(html)
		})
		console.log(`loading ${link} via ajax`)
	}
}

function focusDay(day) {
	if (!day) {
		for (var day of days) {
			$(`.${day}`).children().first().next().hide()
			$(`.${day}`).children().first().removeClass("open")
		}
	} else {
		if (day === days[0]) {
			var otherDaySelector = $(`.${days[1]}`)
			var daySelector = $(`.${days[0]}`)
		} else if (day === days[1]) {
			var otherDaySelector = $(`.${days[0]}`)
			var daySelector = $(`.${days[1]}`)
		}
		otherDaySelector.before(daySelector)
		daySelector.children().first().next().show()
		daySelector.children().first().addClass("open")
		otherDaySelector.children().first().next().hide()
		otherDaySelector.children().first().removeClass("open")
		console.log(`focusing day`)
	}
}

function linkSpeakers() {
	$(".speakers .link").off("click").click( function(e) {
		var id = $(this).attr("href")
		$(".speakers .link").not($(this)).removeClass("bold")
		$(".bio").not($(this).parent().siblings(`.bio.${id}`)).slideUp()
		$(this).toggleClass("bold")
		$(this).parent().siblings(`.bio.${id}`).slideToggle()
		console.log(`show bio for ${id}`)
	})
}

function balanceProgram() {
	$(".program h3, .program h4, .program p").balanceText()
	setTimeout( e => {
		linkSpeakers()
	}, 1000)
}

$( () => {
    // slide in navigation
	hideNav()
	$(window).scroll( () => {
		if ($(window).scrollTop() > 150) {
            showNav()
	    } else {
			hideNav()
		}
	})

    // load program
	hidePopup()
	loadProgram()

	var loc = window.location.search.split("?")[1]
	if (loc && $.inArray(loc, days)) {
		focusDay(loc)
		setTimeout(showPopup, 500)
	}

	$(".program h1").click( function(e) {
		$(this).next().slideToggle( e => {
			balanceProgram()
		})
		$(this).toggleClass("open")
		console.log(`toggle ${$(this).html().toLowerCase()} program`)
	})

	linkSpeakers()

    $("a[href^='program']").click( function(e) {
        e.preventDefault()

		var day = $(this).attr("href").split("/")[1]
		focusDay(day)
		showPopup()
    })

	$(document).keyup( function(e) {
		if (e.keyCode === ESC ) {
			hidePopup()
		}
	})

	// hide on click x
	$("#popup .close").click( e => {
		hidePopup()
	})

	// hide on click outside
	$("#popup").click( e => {
		var c = $("#popup .program-container")
		var leftBorder = c.offset().left
		var rightBorder = c.offset().left + c.outerWidth()
		var bottomBorder = c.offset().top + c.outerHeight()
		if (e.pageX < leftBorder || rightBorder < e.pageX || e.pageY > bottomBorder) {
			hidePopup()
		}
	})
})
