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
		$("#popup .program-container").slideDown()
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
	if (day === days[0]) {
		var otherDaySelector = $(`.${days[1]}`)
		var daySelector = $(`.${days[0]}`)
	} else if (day === days[1]) {
		var otherDaySelector = $(`.${days[0]}`)
		var daySelector = $(`.${days[1]}`)
	}
	otherDaySelector.before(daySelector)
	daySelector.children().first().next().show()
	otherDaySelector.children().first().next().hide()
	console.log(`focusing day`)
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

	$(".program h1").click( function(e) {
		$(this).next().slideToggle()
		console.log(`toggle ${$(this).html().toLowerCase()} program`)
	})

	$(".speakers .link").click( function(e) {
		var id = $(this).attr("href")
		console.log(id)
		$(".bio").slideUp()
		$(this).parent().siblings(`.bio.${id}`).slideToggle()
	})

    $("a[href^='program']").click( function(e) {
        e.preventDefault()

		var day = $(this).attr("href").split("/")[1]
		if (day) {
			focusDay(day)
		}
		showPopup()
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
