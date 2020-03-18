(function () {
  function DaiEditor(daiEditor) {
    this.author = 'daixiaobin',
    this.createDate = '2019.12.23',
    this.updateDate = '2019.1.7',
    this.tableEditor = document.querySelector(daiEditor),
    // 创建全局变量
    this.creatVariable = function(option) {
      // 动态创建静态编辑器
      if (this.tableEditor) {
        this.tableEditor.style.width = option.width;
        this.tableEditor.style.height = option.height;
        this.tableEditor.innerHTML = this.tableHtml;
      } else {
        return this.alertMessage('请传入创建编辑器的节点')
      }
      
      // 文本编辑框 与 markdown 内容框
      this.textEditer = this.tableEditor.querySelector('.textEditer_content');
      this.markDown = this.tableEditor.querySelector('.markDown_content');
      this.mdWindowEyes = this.tableEditor.querySelector('#mdWindowEyes')

      const _this = this

      // 编辑器获取焦点 显示跳动的光标
      this.textEditer.addEventListener('focus', function() {
        if (this.innerHTML === '') {
          this.className = 'textEditer_content textEditer_emptyContent';
        }

        // 监听键盘事件
        window.addEventListener('keydown', _this.keyDownEvent);
      })

      // 编辑器失去焦点 移除键盘事件
      this.textEditer.addEventListener('blur', function() {
        window.removeEventListener('keydown', _this.keyDownEvent);
      })
      
      // 编辑器过滤粘贴样式
      this.textEditer.addEventListener('paste', function(e) {
        let content = e.clipboardData.getData('text/html');

        e.preventDefault();

        const html = _this.beforePaste(content);
        document.execCommand('insertHTMl', false, html);
      })

      // 转化 MarkDown 语法时，储存当前列表类型
      this.listStyle = 'ul';
      this.olLiNum = 1;
  
      // 储存的光标位置数组 与 鼠标选区类型
      this.mousesPosition = []
      this.selectionType = ''
    },
    // 创建插入信息对话框
    this.creatDialog = function() {
      const diaLogBox = document.createElement('div');
      diaLogBox.className = 'dialogBox_hidden';
      diaLogBox.id = 'dialog_mask';
      this.tableEditor.appendChild(diaLogBox);
  
      this.diaLogMask = this.tableEditor.querySelector('#dialog_mask');
      if (this.diaLogMask) {
        this.diaLogMask.innerHTML = this.dialogHtml
      }
  
      this.diaLog = this.tableEditor.querySelector('#dialog_box');
      this.diaLogTitle = this.tableEditor.querySelector('#diaLogTitle');
      this.input_fileName = this.tableEditor.querySelector('#input_fileName');
      this.input_codeStyle = this.tableEditor.querySelector('#input_codeStyle');
      this.input_tags = this.tableEditor.querySelector('#input_tags');
      this.input_url = this.tableEditor.querySelector('#input_url');
      this.input_title = this.tableEditor.querySelector('#input_title');
      this.input_alt = this.tableEditor.querySelector('#input_alt');
      this.item_fileInput = this.tableEditor.querySelector('#item_fileInput');
      this.item_codeInput = this.tableEditor.querySelector('#item_codeInput');
      this.item_tagsInput = this.tableEditor.querySelector('#item_tagsInput');
      this.item_urlInput = this.tableEditor.querySelector('#item_urlInput');
      this.item_altInput = this.tableEditor.querySelector('#item_altInput');
      this.item_titleInput = this.tableEditor.querySelector('#item_titleInput');
      this.diaLogBtn = this.tableEditor.querySelector('.dialogBtn');
      this.diaLogCloseBtn = this.tableEditor.querySelector('#diaLogCloseBtn');
      this.diaLogType = '';
  
      const _this = this

      // 储存插入超链、图片的数据对象
      this.insertObject = {
        url: undefined,
        title: undefined,
        alt: undefined
      }
  
      // 对话框点击事件 取消点击冒泡效果
      this.diaLog.addEventListener('click', function(e) {
        e.stopPropagation()
      })
      // 对话框 确认按钮 插入图片、超链、代码块、markdown文件名
      this.diaLogBtn.addEventListener('click', function() {
        if (_this.diaLogType === 'file') {
          const fileName = _this.input_fileName.value;
          if (fileName === '') return _this.alertMessage('文件名不能为空')

          const tags = _this.input_tags.value.split(',');

          const header = _this.articleHeader(fileName, tags)
          const value = header + _this.markDown.innerText;

          _this.download(fileName + '.md', value);
          _this.alertMessage('文件创建成功', 'success');
        } else if (_this.diaLogType === 'code') {
          if (_this.mousesPosition.length === 0) return _this.alertMessage('光标位置存储失败')
          
          const codeStyle = _this.input_codeStyle.value;
          if (codeStyle === '') return _this.alertMessage('语言不能为空')

          _this.setMousePosition()
          const selectObj = _this.getSelectionString();
          const selecter = selectObj.selecter;
          
          if (!selecter) {        
            _this.closeDialog((_this))
            return _this.alertMessage('请选取内容进行此操作')
          }
          
          const string = `<multiplecode type=${codeStyle}>` + selecter + '</multiplecode><br>';
        
          const content = _this.textEditer.innerHTML;
          if (content.indexOf(string) !== -1) {
            _this.textEditer.innerHTML = content.replace(string, selecter);
          } else {
            document.execCommand('insertHtml', false, string)
          }
        } else {
          if (_this.mousesPosition.length === 0) return _this.alertMessage('光标位置存储失败')
  
          const url = _this.input_url.value;
          if (url === '') return _this.alertMessage('链接不能为空')
  
          if (_this.diaLogType === 'img') {
            const alt = _this.input_url.value;
            if (alt === '') return _this.alertMessage('alt不能为空')
          }  
  
          _this.setMousePosition()
          _this.setInsertObject('assignment')
  
          if (_this.diaLogType === 'img') {
            document.execCommand('insertImage', false, url)
            _this.completeInsertMsg('img')
          } else if (_this.diaLogType === 'link') {
            document.execCommand('createLink', false, url)
            _this.completeInsertMsg('link')
          }  
        }
        
        _this.setMousePosition()
        _this.mousesPosition = [];
        _this.closeDialog((_this))
      })
      // 点击关闭按钮 关闭对话框
      this.diaLogCloseBtn.onclick = function() {
        _this.closeDialog(_this)
      }
      // 点击遮罩层 关闭对话框
      this.diaLogMask.onclick = function() {
        // _this.closeDialog(_this)
      }
    },
    // 文本编辑
    this.editorControl = function() {
      this.editControl = this.tableEditor.querySelector('.control_nav')
  
      const _this = this
      this.editControl.addEventListener('click', function(e) {
        
        if (e.target.className.indexOf('icon-H1') !== -1) return false
  
        const localName = e.path[0].localName;
        let className = ''
        let title = ''
  
        if (localName === 'i') {
          className = e.path[2].className.split(' ')[1]
        } else if (localName === 'button') {
          className = e.path[3].className.split(' ')[1]
          title = e.target.innerHTML.split('h')[1]
        }
  
        const keyWord = className.split('_')[1]
        
        _this.execCommand(keyWord, title)
      })
    },
    // 监听编辑器
    this.watchEditer = function() {
      const _this = this
      this.textEditer.addEventListener('DOMSubtreeModified', function() {
        const value = _this.textEditer.innerHTML;
        if (value !== '') {
          this.className = 'textEditer_content';
        }
        const string = _this.pasteMarkDowm(value);
        _this.markDown.innerHTML = string
      })
    }
  }

  // 过滤编辑器粘贴事件
  DaiEditor.prototype.beforePaste = function(content) {
    let html = content.replace(/<html>|<\/html>/ig, '');
    html = html.replace(/<body>|<\/body>/ig, '');
    html = html.replace(/<span.*?>|<\/span>/ig, '');
    html = html.replace(/<!--[\w\W\r\n]*?-->/gmi, '');

    html = html.replace(/<ul.*?>|<\/ul>/ig, '');
    html = html.replace(/<ol.*?>|<\/ol>/ig, '');

    html = html.replace(/<h1.*?>/ig, '<h1>');
    html = html.replace(/<h2.*?>/ig, '<h2>');
    html = html.replace(/<h3.*?>/ig, '<h3>');
    html = html.replace(/<h4.*?>/ig, '<h4>');
    html = html.replace(/<h5.*?>/ig, '<h5>');
    html = html.replace(/<h6.*?>/ig, '<h6>');

    html = html.replace(/<li>|<li.*?>/ig, '<div>');
    html = html.replace(/<p>|<p.*?>/ig, '<div>');

    html = html.replace(/<\/li>/ig, '</div>');
    html = html.replace(/<\/p>/ig, '</div>');

    const aArr = html.match(/<a.*?<\/a>/ig);
    if (aArr) {
      aArr.forEach(item => {
        let href = '';
        let title = '';
  
        const stringArr = item.split('>');
        const alt = stringArr[1].split('<')[0];
  
  
        const aMsgArr = stringArr[0].replace(/"/ig, '').split(' ');
        aMsgArr.forEach(msgItem => {
          const itemArr = msgItem.split('=');
          if (itemArr[0] === 'href') href = itemArr[1];
          else if (itemArr[0] === 'title') title = itemArr[1];
        })
  
        let a = `<a`;
  
        if (title) a += ` title=${title}`;
  
        a += ` href=${href}>${alt}</a>`;
  
        html = html.replace(item, a);
      })
    }
    return html
  }
  
  // 编辑器内添加的键盘
  DaiEditor.prototype.keyDownEvent = function(e) {
    // tab键 ---- 缩进四个空格
    if (event.keyCode == 9) { 
      event.preventDefault();
      document.execCommand('insertHTMl', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  }

  // 编辑指令函数
  DaiEditor.prototype.execCommand = function(type, title) {
    switch (type) {
      case 'chooseAll':
        this.chooseAllZText()
        break
      case 'copy':
        document.execCommand('copy', false, null);
        this.alertMessage('复制成功', 'success');
        break
      case 'delete':
        document.execCommand('delete', false, null)
        break
      case 'bold':
        document.execCommand('bold', false, null)
        break
      case 'incline':
        document.execCommand('italic', false, null)
        break
      case 'deleteLine':
        document.execCommand('strikeThrough', false, null)
        break
      case 'ul':
        document.execCommand('indent', false, null)
        document.execCommand('insertUnorderedList', false, null)
        break
      case 'ol':
        document.execCommand('indent', false, null)
        document.execCommand('insertOrderedList', false, null)
        break
      case 'outdent':
        document.execCommand('outdent', false, null)
        break
      case 'indent':
        document.execCommand('indent', false, null)
        break
      case 'superLink':
        this.saveMousePosition('link')
        break
      case 'cutLine':
        document.execCommand('insertHorizontalRule', false, null)
        break
      case 'multiplecode':
        this.saveMousePosition('code')
        break
      case 'singlecode':
        this.insertCodeBlock()
        break
      case 'putImg':
        this.saveMousePosition('img')
        break
      case 'title':
        const _title = 'H' + title;
        document.execCommand('formatBlock', false, _title)
        break
      case 'turnLine':
        this.turnLine()
        break
      case 'more':
        this.truncationShowMore()
        break
      case 'clearStyle':
        document.execCommand('removeFormat', false, null)
        break
      case 'mdWindow':
        this.showMarkdownWindow()
        break
      case 'prev':
        document.execCommand('undo', false, null)
        break
      case 'next':
        document.execCommand('redo', false, null)
        break
      case 'saveDraft':
        this.saveDraft()
        break
      case 'markDown':
        this.watchDialog('file')
        break
    }
  }

  // 编辑内容全选
  DaiEditor.prototype.chooseAllZText = function() {
    const selection = window.getSelection();
    selection.removeAllRanges();

    selection.selectAllChildren(this.textEditer)
  }

  // 显示/隐藏 markdown内容窗口
  DaiEditor.prototype.showMarkdownWindow = function() {
    if (this.mdWindowEyes.className === 'iconfont icon-yanjing1') {
      this.mdWindowEyes.className = 'iconfont icon-yanjing';

      this.markDown.style.display = 'none';
      this.textEditer.style.width = '100%';
    } else {
      this.mdWindowEyes.className = 'iconfont icon-yanjing1';

      this.markDown.style.display = 'block';
      this.textEditer.style.width = '50%';
    }
  }

  // 获取选区内容，以便创建代码块
  DaiEditor.prototype.getSelectionString = function() {
    const selection = window.getSelection();
    if (selection.type === 'None') return {}
    
    const rangeObj = selection.getRangeAt(0);
    const documentContent = rangeObj.cloneContents();
    const hiddenBox = document.createElement('div');
    document.body.appendChild(hiddenBox);
    hiddenBox.style.className = 'hiddenBox'
    hiddenBox.appendChild(documentContent)
    const selecter = hiddenBox.innerHTML
    
    if (selecter !== null && selecter.trim() !== "") {
      const selectObj = {
        selecter,
        type: 'single'
      }
      if (selecter.indexOf('<div>') !== -1) {
        selectObj.type = 'multiple'
      }

      document.body.removeChild(hiddenBox);
      return selectObj
    }
    else return {}
  }

  // 创建行内代码块
  DaiEditor.prototype.insertCodeBlock = function() {
    const selectObj = this.getSelectionString();
    const selecter = selectObj.selecter;
    
    if (!selecter) return this.alertMessage('请选取内容进行此操作')

    let string = '&nbsp;<singlecode>' + selecter + '</singlecode>&nbsp;';

    const content = this.textEditer.innerHTML;
    // if (content.indexOf(string) !== -1) {
    //   this.textEditer.innerHTML = content.replace(string, selecter);
    // } else {
      document.execCommand('insertHtml', false, string)
    // }
  }

  // 转行跳出代码块
  DaiEditor.prototype.turnLine = function() {
    const selection = window.getSelection();
    const currentNode = selection.focusNode;
    let targetElement;

    findParentNode(currentNode.parentNode)
    if (!targetElement) return this.alertMessage('请在代码块中进行此操作');

    const br = document.createElement('br');
    const parentNode = targetElement.parentNode;
    
    if (parentNode.lastChild === targetElement) {
      parentNode.appendChild(br);
    } else {
      parentNode.insertBefore(br, targetElement.nextSibling)
    }

    const range = document.createRange();
    range.selectNodeContents(this.textEditer);

    range.collapse(true);
    range.setStart(br, 0);
    
    selection.removeAllRanges();
    selection.addRange(range);

    br.scrollIntoView({ block: 'start', behavior: 'smooth' });

    function findParentNode(element) {
      if (element.localName === 'body') {
        targetElement = null
      } else if (element.localName === 'multiplecode') {
        targetElement = element
      } else {
        findParentNode(element.parentNode)
      }
    }
  }

  // 转化 MarkDown 语法
  DaiEditor.prototype.pasteMarkDowm = function(string) {
    let _string = ''
        
    for (const key in this.regList) {
      if (string.indexOf(key) !== -1) {
        if (key === '<ul>') {
          this.listStyle = 'ul';
          const ulList = this.textEditer.innerHTML.match(/(?<=<ul>).*?(?=<\/ul>)/ig);
          ulList.forEach(ulItem => {
            let liString = ulItem.split('<li>').join('<div>+ ');
            liString = liString.split('</li>').join('</div>');
            string = string.replace(ulItem, liString)
          })

          _string = string.replace(this.regList[key].reg, this.regList[key].text)
        }
        else if (key === '<ol>') {
          this.listStyle = 'ol'
          const olList = this.textEditer.innerHTML.match(/(?<=<ol>).*?(?=<\/ol>)/ig);

          olList.forEach(olItem => {
            let liArray = olItem.split('<li>');
            let olLiNum = 1;
            
            liArray.forEach((liItem, liIndex) => {
              if (liItem !== '') {
                liArray[liIndex] = olLiNum + '. ' + liItem;
                olLiNum++
              }
            })
            olLiNum = 1
            let liString = liArray.join('<div>')

            liString = liString.split('</li>').join('</div>');
            string = string.replace(olItem, liString)
          })

          _string = string.replace(this.regList[key].reg, this.regList[key].text)
        }
        else if (key === '<img') {
          const imgArr = string.match(/<img.*?>/ig)
          imgArr.forEach(item => {
            const imgMsgArr = item.split('"')

            let href = imgMsgArr[imgMsgArr.length - 2]
            let alt = imgMsgArr[1]
            let imgString = `<div>![${alt}](${href}`;

            if (item.indexOf('title=') !== -1) {
              let title = imgMsgArr[3];
              imgString += `, ${title}`
            }

            imgString += ')</div>'
            _string = string.replace(item, imgString);
          })
        }
        else if (key === '<a') {
          const aArr = string.match(/<a.*?<\/a>/ig) || []
          aArr.forEach(item => {
            const aMsgArr = item.split('"');

            let href = aMsgArr[aMsgArr.length - 2];
            let alt = aMsgArr[aMsgArr.length - 1].match(/(?<=>).*?(?=<\/a>)/ig)[0];
            let aString = ` [${alt}](${href}`;
            
            if (item.indexOf('title=') !== -1) {
              let title = aMsgArr[1];
              aString += `, ${title}`
            }

            aString += ') '
            _string = string.replace(item, aString);
          })
        }
        else if (key === '<multiplecode') {
          const codeArr = string.match(/<multiplecode.*?>/ig);

          codeArr.forEach(item => {
            const type = item.split('"')[1];
            const text = '<div class="codeBlock"><div>``` ' + type + '</div>';
            _string = string.replace(item, text);
          })
        }
        else _string = string.replace(this.regList[key].reg, this.regList[key].text)
        break
      }
    }

    if (_string === '') _string = string
    else _string = this.pasteMarkDowm(_string)

    
    return _string
  }

  // 储存光标选区位置
  DaiEditor.prototype.saveMousePosition = function(type) {
    const selection = window.getSelection()
    if (selection.type === 'None') return this.alertMessage('请选择位置进行此操作')
    this.selectionType = selection.type

    this.watchDialog(type)
    
    if (selection.rangeCount === 1) {
      const range = selection.getRangeAt(0)
      this.mousesPosition.push(range)
    } else {
      for (let i = 0; i < selection.rangeCount; i++) {
        const range = selection.getRangeAt(i)
        this.mousesPosition.push(range)
      }
    }

  }

  // 设置光标位置
  DaiEditor.prototype.setMousePosition = function() {
    let ranges = [];
    this.mousesPosition.forEach(item => {
      const range = document.createRange();

      range.selectNodeContents(this.textEditer);

      if (this.selectionType === 'Range') {
        range.setEnd(item.endContainer, item.endOffset);
        range.collapse(false);
      } else {
        range.collapse(true);
      }

      range.setStart(item.startContainer, item.startOffset);
      ranges.push(range)
    })
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    ranges.forEach(item => {
      selection.addRange(item);
    })
  }

  // 插入more注释，在博客上截断文章显示更多文本
  DaiEditor.prototype.truncationShowMore = function() {
    const selection = window.getSelection();
    if (selection.type === 'None') return this.alertMessage('请选择位置进行此操作')
    const _string = `<!-- more -->`;
    document.execCommand('insertText', false, _string);
  }

  // 存储 或 清空 插入对象的信息
  DaiEditor.prototype.setInsertObject = function(type) {
    const url = type === 'assignment' ? this.input_url.value : undefined;
    const title = type === 'assignment' ? this.input_title.value : undefined;
    const alt = type === 'assignment' ? this.input_alt.value : undefined;

    this.insertObject.url = url;
    this.insertObject.title = title;
    this.insertObject.alt = alt;
  }

  // 完善编辑框插入的标签信息
  DaiEditor.prototype.completeInsertMsg = function(type) {
    const value = this.textEditer.innerHTML;
    let string = ''
    
    if (type === 'img') {
      let text = '<img ';
      if (this.insertObject.alt) {
        text += `alt=${this.insertObject.alt} `
      }
      if (this.insertObject.title) {
        text += `title=${this.insertObject.title} `
      }
      text += 'src='
      string = value.replace(/<img src=/g, text)
    } else if (type === 'link') {
      let text = '<a ';
      if (this.insertObject.title) {
        text += `title=${this.insertObject.title} `
      }
      text += 'href='
      string = value.replace(/<a href=/g, text)
    }

    this.textEditer.innerHTML = string
  }

  // 监听对话框类型 并弹出对话框
  DaiEditor.prototype.watchDialog = function(type) {
    this.diaLog.style.animation = 'slideDownDialog .2s ease-out';

    if (type === 'link') {
      if (this.selectionType === 'Caret') return this.alertMessage('请选取内容创建超链')
      else {
        this.diaLogTitle.innerHTML = '插入超链';
        this.item_urlInput.className = 'dialogInput_item';
        this.item_titleInput.className = 'dialogInput_item';
      }
    } else if (type === 'img') {
      this.diaLogTitle.innerHTML = '插入图片';
      this.item_urlInput.className = 'dialogInput_item';
      this.item_altInput.className = 'dialogInput_item';
      this.item_titleInput.className = 'dialogInput_item';
    } else if (type === 'file') {
      this.diaLogTitle.innerHTML = 'md文件名';
      this.item_fileInput.className = 'dialogInput_item';
      this.item_tagsInput.className = 'dialogInput_item';
    } else if (type === 'code') {
      this.diaLogTitle.innerHTML = '代码类型';
      this.item_codeInput.className = 'dialogInput_item';
      this.input_codeStyle.value = 'javascript';
    }
    
    this.diaLogMask.className = '';
    this.diaLogType = type;
  }

  // 关闭对话框
  DaiEditor.prototype.closeDialog = function(_this) {    
    _this.diaLog.style.animation = 'slideUpDialog .2s ease-out';
    
    setTimeout(() => {
      _this.diaLogTitle.innerHTML = '';
      _this.input_url.value = '';
      _this.input_title.value = '';
      _this.input_alt.value = '';
      _this.input_fileName.value = '';
      _this.input_codeStyle.value = '';
      _this.input_tags.value = '';
      _this.setInsertObject('empty')
      _this.mousesPosition = [];
      _this.diaLogMask.className = 'dialogBox_hidden';
      _this.item_fileInput.className = 'dialogInput_item-hidden';
      _this.item_tagsInput.className = 'dialogInput_item-hidden';
      _this.item_codeInput.className = 'dialogInput_item-hidden';
      _this.item_urlInput.className = 'dialogInput_item-hidden';
      _this.item_altInput.className = 'dialogInput_item-hidden';
      _this.item_titleInput.className = 'dialogInput_item-hidden';
    }, 150)
  }

  // 保存草稿
  DaiEditor.prototype.saveDraft = function() {
    const value = this.markDown.innerText;
    const fileName = 'draftFile.md';
    this.download(fileName, value);
    this.alertMessage('保存成功', 'success');
  }

  // 生成下载markdown文件
  DaiEditor.prototype.download = function(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  // 弹出提示信息
  DaiEditor.prototype.alertMessage = function(msg, type) {
    const msgMask = document.createElement('div');
    const msgBox = document.createElement('div');
    const msgLogo = document.createElement('span');
    msgMask.className = 'msgMask';
    msgBox.className = 'msgBox';
    msgMask.appendChild(msgBox);
    msgBox.appendChild(msgLogo);

    const _type = type || 'danger';
    switch (_type) {
      case 'danger':
        msgBox.style.backgroundColor = '#fef0f0';
        msgBox.style.borderColor = '#fde2e2';
        msgBox.style.color = '#F56C6C';
        msgLogo.style.backgroundColor = '#F56C6C';
        msgLogo.style.color = '#fef0f0';
        msgLogo.innerHTML = '!';
        break;
      case 'success':
        msgBox.style.backgroundColor = '#f0f9eb';
        msgBox.style.borderColor = '#e1f3d8';
        msgBox.style.color = '#67c23a';
        msgLogo.style.backgroundColor = '#67c23a';
        msgLogo.style.color = '#f0f9eb';
        msgLogo.innerHTML = '✓';
        break;
      default:
        break;
    }
    msgBox.innerHTML += msg;
    
    this.tableEditor.appendChild(msgMask);

    setTimeout(() => {
      msgBox.style.animation = 'slideUpMsg .2s ease-out';
      setTimeout(() => {
        this.tableEditor.removeChild(msgMask);
      }, 100)
    }, 2000)
  }

  // 编辑器初始化
  DaiEditor.prototype.editorInit = function(option) {
    const _option = {
      width: option ? option.width + 'px' : '100%',
      height: option ? option.height + 'px' : '100%'
    }
    this.creatVariable(_option);
    this.creatDialog();
    this.editorControl();
    this.watchEditer();
  }

  // 正则验证 与 替换文本
  DaiEditor.prototype.regList = {
    '<b>': {
      reg: /<b.*?>|<\/b>/ig,
      text: '**'
    },
    '<strike>': {
      reg: /<strike.*?>|<\/strike>/ig,
      text: '~~'
    },
    '<hr id="null">': {
      reg: /<hr id="null">/ig,
      text: '<br>---<br>'
    },
    '</multiplecode>': {
      reg: /<\/multiplecode>/ig,
      text: '<div>```</div></div>'
    },
    '<singlecode>': {
      reg: /<singlecode>/ig,
      text: '<span class="codeBlock">`'
    },
    '</singlecode>': {
      reg: /<\/singlecode>/ig,
      text: '`</span>'
    },
    '<ul>': {
      reg: /<ul.*?>|<\/ul>/ig,
      text: ''
    },
    '<ol>': {
      reg: /<ol.*?>/ig,
      text: ''
    },
    '</ol>': {
      reg: /<\/ol>/ig,
      text: ''
    },
    '<i>': {
      reg: /<i.*?>|<\/i>/ig,
      text: '*'
    },
    '<h1>': {
      reg: /<h1.*?>/ig,
      text: '<div># '
    },
    '<h2>': {
      reg: /<h2.*?>/ig,
      text: '<div>## '
    },
    '<h3>': {
      reg: /<h3.*?>/ig,
      text: '<div>### '
    },
    '<h4>': {
      reg: /<h4.*?>/ig,
      text: '<div>#### '
    },
    '<h5>': {
      reg: /<h5.*?>/ig,
      text: '<div>##### '
    },
    '<h6>': {
      reg: /<h6.*?>/ig,
      text: '<div>###### '
    },
    '</h1>': {
      reg: /<\/h1>/ig,
      text: '</div>'
    },
    '</h2>': {
      reg: /<\/h2>/ig,
      text: '</div>'
    },
    '</h3>': {
      reg: /<\/h3>/ig,
      text: '</div>'
    },
    '</h4>': {
      reg: /<\/h4>/ig,
      text: '</div>'
    },
    '</h5>': {
      reg: /<\/h5>/ig,
      text: '</div>'
    },
    '</h6>': {
      reg: /<\/h6>/ig,
      text: '</div>'
    },
    '<img': {},
    '<a': {},
    '<multiplecode': {}
  }

  // 生成博客文章标题
  DaiEditor.prototype.articleHeader = function(fileName, tags) {
    let string = `---
title: ${fileName}
tag: `;
    tags.forEach(item => {
      string += `
  - ${item}`
    })

    string += `
---

`

    return string
  } 

  // 对话框 html
  DaiEditor.prototype.dialogHtml = `<div class="dialogBox_show" id="dialog_box">
    <div class="diaLogHeader">
      <span id="diaLogTitle">插入图片</span>
      <button id="diaLogCloseBtn">
        <i class="iconfont icon-guanbi"></i>
      </button>
    </div>
    <div class="dialogInput_item-hidden" id="item_codeInput">
      <span class="dialogInput_title required">codeStyle：</span>
      <input type="text" class="dialogInput" id="input_codeStyle" placeholder="请输入">
    </div>
    <div class="dialogInput_item-hidden" id="item_fileInput">
      <span class="dialogInput_title required">fileName：</span>
      <input type="text" class="dialogInput" id="input_fileName" placeholder="请输入">
    </div>
    <div class="dialogInput_item-hidden" id="item_tagsInput">
      <span class="dialogInput_title">tags：</span>
      <input type="text" class="dialogInput" id="input_tags" placeholder="请输入">
      <p>输入文章的便签分类，并以逗号分隔</p>
    </div>
    <div class="dialogInput_item-hidden" id="item_urlInput">
      <span class="dialogInput_title required">url：</span>
      <input type="text" class="dialogInput" id="input_url" placeholder="请输入">
    </div>
    <div class="dialogInput_item-hidden" id="item_altInput">
      <span class="dialogInput_title required">alt：</span>
      <input type="text" class="dialogInput" id="input_alt" placeholder="请输入">
    </div>
    <div class="dialogInput_item-hidden" id="item_titleInput">
      <span class="dialogInput_title">title：</span>
      <input type="text" class="dialogInput" id="input_title" placeholder="请输入">
    </div>
    <button class="dialogBtn">确认</button>
  </div>`;

  // 编辑器桌面 html
  DaiEditor.prototype.tableHtml = `
    <div class="control_nav">
      <div class="control_nav-item edit_chooseAll">
        <button>
          <i class="iconfont icon-A"></i>
        </button>
        <span class="icon_title">全选</span>
      </div>
      <div class="control_nav-item edit_copy">
        <button>
          <i class="iconfont icon-fuzhi1"></i>
        </button>
        <span class="icon_title">复制</span>
      </div>
      <div class="control_nav-item edit_delete">
        <button>
          <i class="iconfont icon-shanchu"></i>
        </button>
        <span class="icon_title">删除</span>
      </div>
      <div class="control_nav-item edit_prev">
        <button>
          <i class="iconfont icon-shangyibu"></i>
        </button>
        <span class="icon_title">上一步</span>
      </div>
      <div class="control_nav-item edit_next">
        <button>
          <i class="iconfont icon-xiayibu"></i>
        </button>
        <span class="icon_title">下一步</span>
      </div>
      <div class="control_nav-item edit_bold">
        <button>
          <i class="iconfont icon-jiacu1"></i>
        </button>
        <span class="icon_title">加粗</span>
      </div>
      <div class="control_nav-item edit_incline">
        <button>
          <i class="iconfont icon-bianjiICONCopy"></i>
        </button>
        <span class="icon_title">倾斜</span>
      </div>
      <div class="control_nav-item edit_deleteLine">
        <button>
          <i class="iconfont icon-shanchuxian biggerIcon"></i>
        </button>
        <span class="icon_title">删除线</span>
      </div>
      <div class="control_nav-item edit_ul">
        <button>
          <i class="iconfont icon-wuxuliebiao biggerIcon"></i>
        </button>
        <span class="icon_title">无序列表</span>
      </div>
      <div class="control_nav-item edit_ol">
        <button>
          <i class="iconfont icon-youxuliebiao biggerIcon"></i>
        </button>
        <span class="icon_title">有序列表</span>
      </div>
      <div class="control_nav-item edit_outdent">
        <button>
          <i class="iconfont icon-suojin2" style="font-size: 14px;"></i>
        </button>
        <span class="icon_title">缩出</span>
      </div>
      <div class="control_nav-item edit_indent">
        <button>
          <i class="iconfont icon-suojin1" style="font-size: 14px;"></i>
        </button>
        <span class="icon_title">缩进</span>
      </div>
      <div class="control_nav-item edit_superLink">
        <button>
          <i class="iconfont icon-chaolianjie"></i>
        </button>
        <span class="icon_title">超链接</span>
      </div>
      <div class="control_nav-item edit_cutLine">
        <button>
          <i class="iconfont icon-fengexian"></i>
        </button>
        <span class="icon_title">分割线</span>
      </div>
      <div class="control_nav-item edit_putImg">
        <button>
          <i class="iconfont icon-charutupian biggerIcon"></i>
        </button>
        <span class="icon_title">插入图片</span>
      </div>
      <div class="control_nav-item edit_title">
        <button>
          <i class="iconfont icon-H1"></i>
        </button>
        <ul class="title_steps">
          <li><button>h1</button></li>
          <li><button>h2</button></li>
          <li><button>h3</button></li>
          <li><button>h4</button></li>
          <li><button>h5</button></li>
          <li><button>h6</button></li>
        </ul>
      </div>
      <div class="control_nav-item edit_singlecode">
        <button>
          <i class="iconfont icon-daimakuai-dian biggerIcon"></i>
        </button>
        <span class="icon_title">行内代码块</span>
      </div>
      <div class="control_nav-item edit_multiplecode">
        <button>
          <i class="iconfont icon-daimakuai1"></i>
        </button>
        <span class="icon_title">代码块</span>
      </div>
      <div class="control_nav-item edit_turnLine">
        <button>
          <i class="iconfont icon-huiche"></i>
        </button>
        <span class="icon_title">跳出代码块</span>
      </div>
      <div class="control_nav-item edit_more">
        <button>
          <i class="iconfont icon-more"></i>
        </button>
        <span class="icon_title">展开全文</span>
      </div>
      <div class="control_nav-item edit_clearStyle">
        <button>
          <i class="iconfont icon-qingchu"></i>
        </button>
        <span class="icon_title">清除样式</span>
      </div>
      <div class="control_nav-item edit_mdWindow">
        <button>
          <i id="mdWindowEyes" class="iconfont icon-yanjing1"></i>
        </button>
        <span style="width: 45px; writing-mode: horizontal-tb;" class="icon_title">md窗口</span>
      </div>
      <div class="control_nav-item edit_saveDraft">
        <button>
          <i class="iconfont icon-baocuncaogao"></i>
        </button>
        <span class="icon_title">保存草稿</span>
      </div>
      <div class="control_nav-item edit_markDown">
        <button>
          <i class="iconfont icon-markdown"></i>
        </button>
        <span style="width: 70px; writing-mode: horizontal-tb;" class="icon_title">生成.md文件</span>
      </div>
    </div>
    <div class="editor_box">
      <div class="textEditer_content" contenteditable="true"></div>
      <div class="markDown_content"></div>
    </div>`

  window.DaiEditor = DaiEditor
})()