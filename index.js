// import interact from 'https://cdn.interactjs.io/v1.10.17/interactjs/index.js'

interact('li').draggable({
	lockAxis: 'y',
	modifiers: [
		interact.modifiers.restrictRect({
		  restriction: 'parent',
		  endOnly: false
		})
	  ],
	  listeners: {
		// call this function on every dragmove event
		move: dragMoveListener,
  
		// call this function on every dragend event
		end (event) {
			// reset translation
			event.target.style.transform = 'translate(0px, 0px)'
			// update the posiion attributes
			event.target.setAttribute('data-y', 0)

			event.target.style.zIndex = 0
		}
	  }
  })

  function dragMoveListener (event) {
	var target = event.target
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
	var target = event.target
	// get the parent element
	var parent = target.parentNode
	// get the index of the element
	var index = Array.prototype.indexOf.call(parent.children, target)
	// get the height of the element
	var computedHeight = target.getBoundingClientRect().height
	// get how many elements it is down in the list
	var newIndex = index + Math.ceil(target.getAttribute('data-y') / computedHeight)
	// set index of the element
	if (newIndex < parent.children.length) {
		parent.insertBefore(target, parent.children[newIndex]);
	} else {
		parent.appendChild(target)
		target.setAttribute('data-y', Math.min(target.getAttribute('data-y'), 0))
	}
	// make the translation relative to the new position
	target.style.transform = 'translate(0px, ' + (target.getAttribute('data-y') % computedHeight) + 'px)'
	// update the posiion attributes
	target.setAttribute('data-y', target.getAttribute('data-y') % computedHeight)
  }