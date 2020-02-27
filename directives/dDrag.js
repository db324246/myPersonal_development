const dDrag = {
  name: 'dDrag',
  target: undefined,
  bind: function(el, binding) {
    if (!binding.value) {
      dDrag.target = el
    } else {
      dDrag.target = document.querySelector(binding.value)
    }

    if (binding.arg === undefined || binding.arg === null) {
      dDrag.inserted = function(el, binding) {
        dDrag.dargFunc(el, binding)
      }
    } else {
      dDrag.componentUpdated = function(el, binding) {
        dDrag.dargFunc(el, binding)
      }
    }
  },
  dargFunc(el, binding) {
    let moveFlag = false, pageX = 0, pageY = 0, left = 0, top = 0
    el.style.transform = 'translate(0, 0)'

    binding.arg && dDrag.bind(el, binding)
    
    const argFlag = binding.arg === undefined || binding.arg === null ? true : binding.arg
    
    if (argFlag && dDrag.target) {
      dDrag.target.style.cursor = 'grab'
      dDrag.target.addEventListener('mousedown', function(e) {
        e.stopPropagation()
        
        pageX = e.pageX
        pageY = e.pageY
        moveFlag = true
        
        dDrag.target.style.cursor = 'grabbing'
        window.addEventListener('mousemove', moveFunc)
      })

      dDrag.target.addEventListener('mouseup', function() {
        dDrag.target.style.cursor = 'grab'
        moveFlag = false
        window.removeEventListener('mousemove', moveFunc)
      })
    } else {
      setTimeout(() => {
        moveFlag = false
        window.removeEventListener('mousemove', moveFunc)
        el.style.transform = 'translate(0, 0)'
      }, 5000)
    }

    function moveFunc(e) {
      if (!moveFlag) return
      e.preventDefault()
      dDrag.target.style.cursor = 'grabbing'
      const x = e.pageX
      const y = e.pageY

      left += (x - pageX)
      top += (y - pageY)
      pageX = x
      pageY = y
      
      el.style.transform = `translate(${left + 'px'}, ${top + 'px'})`
    }
  }
}

export default dDrag