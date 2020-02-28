// v-dlDrag:[nodeVisible]="element"
// nodeVisible：在html标签中绑定指令，如果绑定节点含有{display: none}属性，则需要传入nodeVisible参数为布尔值。绑定节点显示时，nodeVisible为true，隐藏时为false
// element：可选参数，可自定义点击的节点。指令默认点击绑定的节点进行拖拽操作。如果只想点击绑定节点的某一子节点触发拖拽功能，只需传入element为子节点的类名或id名。例：'.test'、'#test'。
// 注意：指令绑定的值的双引号类接收的是JavaScript的语法。
//     例如： 传入类名或id名字符串：v-dlDrag:[nodeVisible]="'.test'" || v-dlDrag:[nodeVisible]="'#test'"

const dlDrag = {
  name: 'dlDrag',
  bind: function(element, binding) {
    element.style.transform = 'translate(0, 0)'
    if (binding.arg === undefined || binding.arg === null) {
      dlDrag.inserted = function(element, binding) {
        dlDrag.dargFunc(element, binding)
      }
    } else {
      dlDrag.componentUpdated = function(element, binding) {
        dlDrag.dargFunc(element, binding)
      }
    }
  },
  dargFunc(element, binding) {
    let moveFlag = false, pageX = 0, pageY = 0, left = 0, top = 0, target, cloneNode

    if (!binding.value) {
      target = element
    } else {
      target = document.querySelector(binding.value)
    }

    const argFlag = binding.arg === undefined || binding.arg === null ? true : binding.arg
    
    if (argFlag && target) {
      target.style.cursor = 'grab'
      target.addEventListener('mousedown', function(e) {
        e.stopPropagation()
        pageX = e.pageX
        pageY = e.pageY
        moveFlag = true
        
        cloneNode = element.cloneNode(true)
        cloneNode.style.position = 'absolute'
        cloneNode.style.opacity = 0.3
        cloneNode.style.left = element.offsetLeft + 'px'
        cloneNode.style.top = element.offsetTop + 'px'
        element.parentNode.appendChild(cloneNode)
        
        cloneNode.style.cursor = 'grabbing'
        window.addEventListener('mousemove', moveFunc)

        cloneNode.addEventListener('mouseup', function(e) {
          e.stopPropagation()

          element.style.transform = cloneNode.style.transform
          setTimeout(() => {
            element.parentNode.removeChild(cloneNode)
          }, 500)
          moveFlag = false
          window.removeEventListener('mousemove', moveFunc)
        })
      })
    }
    if (!argFlag) {
      moveFlag = false
      window.removeEventListener('mousemove', moveFunc)
      element.style.transform = 'translate(0, 0)'
    }

    function moveFunc(e) {
      if (!moveFlag) return
      e.preventDefault()
      
      cloneNode.style.cursor = 'grabbing'
      const x = e.pageX
      const y = e.pageY

      left += (x - pageX)
      top += (y - pageY)
      pageX = x
      pageY = y
      
      cloneNode.style.transform = `translate(${left + 'px'}, ${top + 'px'})`
    }
  }
}

export default dlDrag