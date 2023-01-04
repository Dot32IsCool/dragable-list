// import interact from 'https://cdn.interactjs.io/v1.10.17/interactjs/index.js'

interact('li').draggable({
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
			// get the parent element
			var parent = event.target.parentNode
			console.log(parent)
			// get the index of the element
			var index = Array.prototype.indexOf.call(parent.children, event.target)
			// get how many elements it is down in the list
			var newIndex = index + Math.ceil(event.target.getAttribute('data-y') / 18.5)
			console.log(newIndex)
			// set index of the element
			if (newIndex < parent.children.length -1) {
				parent.insertBefore(event.target, parent.children[newIndex]);
			} else {
				parent.appendChild(event.target)
			}

			// reset translation
			event.target.style.transform = 'translate(0px, 0px)'
			// update the posiion attributes
			event.target.setAttribute('data-y', 0)
		}
	  }
  })

  function dragMoveListener (event) {
	var target = event.target
	// keep the dragged position in the data-x/data-y attributes
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
  
	// translate the element
	target.style.transform = 'translate(0px, ' + y + 'px)'
  
	// update the posiion attributes
	target.setAttribute('data-y', y)
  }