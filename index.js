// import interact from 'https://cdn.interactjs.io/v1.10.17/interactjs/index.js'

interact('li > span').draggable({
	lockAxis: 'y',
	listeners: {
	// call this function on every dragmove event
	move: dragMoveListener,

	// call this function on every dragend event
	end (event) {
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
	// keep the dragged position in the data-x/data-y attributes
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
	target.style.zIndex = 100

	// translate the element
	target.style.transform = 'translate(0px, ' + y + 'px)'
  
	// update the posiion attributes
	target.setAttribute('data-y', y)

	reorder(event)
  }

  function reorder (event) {
	var target = event.target.parentNode
	// get the parent element
	var parent = target.parentNode
	// get the index of the element
	var index = Array.prototype.indexOf.call(parent.children, target)
	// get the height of the element
	var computedHeight = target.getBoundingClientRect().height
	// get how many elements it is down in the list
	var newIndex = Math.max(index + Math.ceil(target.getAttribute('data-y') / computedHeight), 0)
	// set index of the element
	if (newIndex < parent.children.length) {
		parent.insertBefore(target, parent.children[newIndex]);
	} else {
		parent.appendChild(target)
		target.setAttribute('data-y', Math.min(target.getAttribute('data-y'), 0))
	}
	// make the translation relative to the new position, if it is not the first element
	if (newIndex > 0) {
		console.log(newIndex)
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
}

// remove selected class from all elements
function removeSelected (index) {
	for (var i = 0; i < list_elements.length; i++) {
		if (i != index) {
			list_elements[i].classList.remove("selected")
		}
	}
}