const dlCopy = {
  name: 'dlCopy',
  inserted(el, binding) {
    let copyBtn
    if (!binding.value) {
      copyBtn = el
    } else {
      copyBtn = document.querySelector(binding.value)
    }

    copyBtn.addEventListener('click', function() {
      el.contentEditable = true
  
      const selection = window.getSelection();
      selection.selectAllChildren(el)
  
      document.execCommand('Copy')
      el.removeAttribute('contentEditable')
      selection.removeAllRanges()
      
      
    })
  }
}

export default dlCopy