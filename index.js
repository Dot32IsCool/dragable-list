// import interact from 'https://cdn.interactjs.io/v1.10.17/interactjs/index.js'

interact('li > span').draggable({
	lockAxis: 'y',
	listeners: {
	// call this function on every dragmove event
	move: dragMoveListener,

	// call this function on every dragend event
	end (event) {
		if (event.target.parentNode.classList.contains("selected")) {
			var selected_elements = document.querySelectorAll('li.selected')
			for (var i = 0; i < selected_elements.length; i++) {
				selected_elements[i].style.transform = 'translate(0px, 0px)'
				// update the posiion attributes
				selected_elements[i].setAttribute('data-y', 0)
				selected_elements[i].style.zIndex = 0
			}
		}

		// reset translation
		event.target.parentNode.style.transform = 'translate(0px, 0px)'
		// update the posiion attributes
		event.target.parentNode.setAttribute('data-y', 0)

		event.target.parentNode.style.zIndex = 0
	}
	}
  }).styleCursor(false)

function dragMoveListener (event) {
	var target = event.target.parentNode
	// if this element is selected, move all selected elements
	if (target.classList.contains("selected")) {
		var selected_elements = document.querySelectorAll('li.selected')
		for (var i = 0; i < selected_elements.length; i++) {
			moveElement(selected_elements[i], event)
		}
	} else {
		moveElement(target, event)
	}
}

function moveElement (target, event) {
	// keep the dragged position in the data-x/data-y attributes
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
	target.style.zIndex = 100

	// translate the element
	target.style.transform = 'translate(0px, ' + y + 'px)'
  
	// update the posiion attributes
	target.setAttribute('data-y', y)

	// document.startViewTransition(() => {
		reorder(target)
	// });
}

  function reorder (target) {
	// var target = event.target.parentNode
	// get the parent element
	var parent = target.parentNode

	// Loop over all elements in the list
	for (var i = 0; i < parent.children.length; i++) {
		// Remove the class that animates the element
		parent.children[i].classList.remove("boom-down")
		parent.children[i].classList.remove("boom-up")
	}
		
	// get the index of the element
	var index = Array.prototype.indexOf.call(parent.children, target)
	// get the height of the element
	var computedHeight = target.getBoundingClientRect().height
	// get how many elements it is down in the list
	let dataY = target.getAttribute('data-y')
	var newIndex = Math.max(index + Math.ceil(dataY / computedHeight), 0)
	// set index of the element
	if (newIndex < parent.children.length) {
		parent.insertBefore(target, parent.children[newIndex]);
		// console.log("boom")
		if (newIndex-1 != index && newIndex != index) {
			// console.log("boom")
			if (dataY > 0) {
				console.log("boom-down")
				// Find element that is above the target
				var aboveElement = parent.children[newIndex-2]
				// Set its position to the bottom of the target
				// aboveElement.style.transform = 'translate(0px, ' + computedHeight + 'px)'
				// Give the element a class to animate it
				aboveElement.classList.add("boom-down")
			} else {
				console.log("boom-up")
				// Find element that is below the target
				var belowElement = parent.children[newIndex+1]
				// Set its position to the top of the target
				// belowElement.style.transform = 'translate(0px, ' + -computedHeight + 'px)'
				// Give the element a class to animate it
				belowElement.classList.add("boom-up")
			}
		}
	} else {
		parent.appendChild(target)
		target.setAttribute('data-y', Math.min(target.getAttribute('data-y'), 0))
	}
	// make the translation relative to the new position, if it is not the first element
	if (newIndex > 0) {
		// console.log(newIndex)
		target.style.transform = 'translate(0px, ' + (target.getAttribute('data-y') % computedHeight) + 'px)'
		// update the posiion attributes
		target.setAttribute('data-y', target.getAttribute('data-y') % computedHeight)
	} else {
		target.style.transform = 'translate(0px, 0px)'
		// update the posiion attributes
		target.setAttribute('data-y', 0)
	}
  }

var pressedKeys = {};
window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }

var list_elements = document.querySelectorAll('li')

var myFunction = function() {
	var index = Array.prototype.indexOf.call(this.parentNode.children, this)

	// if shift is not pressed, remove selected class from all elements
	if (!pressedKeys["16"]) {
		removeSelected(index)
	}
	this.classList.toggle("selected")
}

for (var i = 0; i < list_elements.length; i++) {
	list_elements[i].addEventListener('click', myFunction, false)
	// list_elements[i].style.viewTransitionName = "list" + i
}

// remove selected class from all elements
function removeSelected (index) {
	for (var i = 0; i < list_elements.length; i++) {
		if (i != index) {
			list_elements[i].classList.remove("selected")
		}
	}
}