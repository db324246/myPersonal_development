<script>
import DlTreeItem from './dl-tree-item'
const defaultFunction = function() {}
const findNodeParent = function(node) {
  if (!node.parentNode || node.className === 'dl-tree-node') return node
  if (node.parentNode.className === 'dl-tree-node') {
    return node.parentNode
  } else return findNodeParent(node.parentNode)
}
export default {
  name: 'dl-tree',
  componentName: 'dl-tree',
  components: {
    DlTreeItem
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    nodeKey: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      required: true,
      default() {
        return {
          label: 'label',
          children: 'children',
          isleaf: 'isleaf',
          disabled: 'disabled',
          hasChecked: 'hasChecked'
        }
      }
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    renderEveryExpand: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: defaultFunction
    },
    renderContent: {
      type: Function,
      default: null
    },
    highlightCurrent: {
      type: Boolean,
      default: false
    },
    currentNodeKey: {
      type: [Number, String],
      default: ''
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkOnClickNode: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    singleChecked: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    defaultDisabledKeys: {
      type: Array,
      default() {
        return []
      }
    },
    filterNodeMethod: {
      type: Function,
      default: defaultFunction
    },
    accordion: {
      type: Boolean,
      default: false
    },
    indent: {
      type: Number,
      default: 16
    },
    height: {
      type: Number,
      default: 26
    },
    lazy: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrop: {
      type: Function,
      default: defaultFunction
    },
    allowDrag: {
      type: Function,
      default: defaultFunction
    }
  },
  provide() {
    return {
      dlTree: this
    };
  },
  data() {
    return {
      keyFlag: false,
      filterVal: '',
      countKey: 100,
      nodeData: {
        id: 'root',
        key: 'root',
        type: 'node',
        expanded: true,
        disabled: false,
        checked: 'false',
        hasChecked: 'true',
        halfChecked: false,
        isleaf: false,
        lazyload: true,
        loading: false,
        droppedon: false,
        level: 0,
        children: [],
        data: null,
        parent: null
      },
      dataRecordsByKey: new Map(), // key记录所有的data数据
      nodeRecordsByKey: new Map(), // key记录所有节点
      nodeRecordsByData: new Map(), // data记录所有节点
      currentKey: '',
      currentNode: {}, // 记录当前节点
      checkedNodes: [], // 记录已勾选的节点
      halfCheckedNodes: [],
      draggingNode: {},
      dragIndicatorTop: '-99999999px',
      dragIndicatorLeft: '0',
      dropType: ''
    }
  },
  watch: {
    'currentNode.key'(val) {
      if(val) this.$emit('current-change', this.currentNode.data, this.currentNode)
    }
  },
  created() {
    if (this.currentNodeKey) this.currentKey = this.currentNodeKey
    if (this.lazy) {
      const parentNode = this.nodeData
      new Promise(resolve => {
        this.load && this.load(parentNode, resolve)
      }).then(data => {
        this.loadResolve(data, parentNode)
      })
    } else if (this.data.length) {
      if (this.renderAfterExpand) {
        const parentNode = this.nodeData
        this.loadResolve(this.data, parentNode)
      } else {
        this.recursionNodeData(this.data, this.nodeData.children, this.nodeData.level, this.nodeData)
      }
    }
  },
  render(h) {
    const childrenNodes = this.recursionNodeRender(h, this.nodeData.children)
    const left = this.dragIndicatorLeft
    const top = this.dragIndicatorTop
    const display = Object.keys(this.draggingNode).length ? 'block' : 'none'
    if (!childrenNodes.length) {
      childrenNodes.push(h(
        'div',
        {
          class: 'empty-tree__text'
        },
        this.emptyText
      ))
    }
    childrenNodes.push(h(
      'div',
      {
        class: 'dl-tree__drop-indicator',
        style: {
          display,
          'position': 'absolute',
          left,
          top,
          'right': '0',
          'height': '1px',
          'background-color': '#409eff',
          'z-index': '200'
        }
      }
    ))
    return h(
      'div',
      {
        class: 'dl-tree',
        ref: 'tree'
      },
      childrenNodes
    )
  },
  methods: {
    newNode(data, parentNode, level, key, expanded) {
      const checked = this.showCheckbox && this.defaultCheckedKeys.length && this.defaultCheckedKeys.includes(key) ? 'true' : 'false'

      const disabled = this.showCheckbox && this.defaultDisabledKeys.length && this.defaultDisabledKeys.includes(key) || false

      const node = {
        id: key,
        key,
        type: 'node',
        expanded,
        checked: checked,
        hasChecked: data[this.props.hasChecked] || 'true',
        halfChecked: false,
        lazyload: true,
        loading: false,
        droppedon: false,
        level,
        children: [],
        data,
        parent: parentNode
      }
      
      node.disabled = disabled || (typeof this.props.disabled === 'function' ? this.props.disabled(data, node) : data[this.props.disabled]) || false
      node.isleaf = typeof this.props.isleaf === 'function' ? this.props.isleaf(data, node) : data[this.props.isleaf] || false

      if (this.currentKey && this.currentKey === key) {
        this.currentKey = ''
        this.currentNode = node
      }
      return node
    },
    loadResolve(data, parentNode, cb) {
      if (!data) return
      const len = data.length
      if (len) {
        const level = parentNode.level + 1
        if (this.renderEveryExpand) parentNode.children = []
        for (let i = 0; i < len; i++) {
          if (i === 0) {
            if (this.nodeKey && data[i][this.nodeKey]) this.keyFlag = true
            else this.keyFlag = false
          }
          const key = this.keyFlag ? data[i][this.nodeKey] : this.countKey
          const expanded = this.defaultExpandedKeys.includes(key)
          this.countKey++
          const node = this.newNode(data[i], parentNode, level, key, expanded)
          this.dataRecordsByKey.set(key, data[i])
          this.nodeRecordsByKey.set(key, node)
          this.nodeRecordsByData.set(data[i], node)
          parentNode.children.push(node)

          if (expanded) {
            new Promise(resolve => {
              node.loading = true
              this.load && this.load(node, resolve)
            }).then(data => {
              this.loadResolve(data, node)
            })
          }
        }
      } else {
        parentNode.children = []
      }
      if (!this.renderEveryExpand) parentNode.lazyload = false
      cb && cb()
      parentNode.loading = false
      parentNode.expanded = true
      this.$emit('node-expand', parentNode.data, parentNode)
    },
    recursionNodeData(arr1, arr2, level, parent) {
      level++
      const len = arr1.length
      for (let i = 0; i < len; i++) {
        if (i === 0) {
          if (this.nodeKey && arr1[i][this.nodeKey]) this.keyFlag = true
          else this.keyFlag = false
        }
        const key = this.keyFlag ? arr1[i][this.nodeKey] : this.countKey
        const expanded = this.defaultExpandAll || this.defaultExpandedKeys.includes(key)
        this.countKey++

        const node = this.newNode(arr1[i], parent, level, key, expanded)
        arr2.push(node)
        this.dataRecordsByKey.set(key, arr1[i])
        this.nodeRecordsByKey.set(key, node)
        this.nodeRecordsByData.set(arr1[i], node)
        if (arr1[i][this.props.children] && arr1[i][this.props.children].length) {
          this.recursionNodeData(arr1[i][this.props.children], node.children, level, node)
        }
      }
    },
    recursionNodeRender(h, arr1) {
      const children = []
      const _this = this
      const recursionRender = function(h, arr1) {
        const len = arr1.length
        for (let i = 0; i < len; i++) {
          if (_this.filterVal && !_this.filterNodeMethod(_this.filterVal, arr1[i].data, arr1[i])) {
            continue
          }
          let childrenNodes = []

          if (arr1[i].children.length) {
            childrenNodes = _this.recursionNodeRender(h, arr1[i].children)
          }
          const eventOndrag = {}
          const eventOndrop = {}
          if (_this.draggable) {
            if (_this.allowDrag(arr1[i])) {
              eventOndrag.dragstart = (ev) => {
                _this.nodeDragStart(arr1[i], ev)
                ev.stopPropagation()
              }
              eventOndrag.dragend = (ev) => {
                _this.nodeDragEnd(arr1[i], ev)
                ev.stopPropagation()
              }
            } else {
              eventOndrag.mousedown = (ev) => {
                ev.stopPropagation()
                ev.preventDefault()
              }
            }
            if (_this.allowDrop(_this.draggingNode, arr1[i], _this.dropType)) {
              eventOndrop.dragover = (ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                _this.nodeDragover(arr1[i], ev)
              }
              eventOndrop.dragenter = (ev) => {
                _this.nodeDragEnter(arr1[i], ev)
                ev.stopPropagation()
              }
              eventOndrop.dragleave = (ev) => {
                _this.nodeDragLeave(arr1[i], ev)
                ev.stopPropagation()
              }
              eventOndrop.drop = (ev) => {
                _this.nodeDroped(arr1[i], ev)
                ev.stopPropagation()
              } 
            } else {
              arr1[i].droppedon = false
              _this.dragIndicatorTop = '-99999999px'
              _this.dragIndicatorLeft = '0'
            }
          }
          const label = typeof _this.props.label === 'function' ? _this.props.label(arr1[i].data, arr1[i]) : arr1[i].data[_this.props.label]
          const node = h(
            'div',
            {
              class: 'dl-tree-node',
              attrs: {
                draggable: _this.draggable
              },
              on: eventOndrag
            },
            [
              h(
                'dl-tree-item',
                {
                  props: {
                    value: arr1[i].expanded,
                    level: arr1[i].level,
                    label: label,
                    dnode: arr1[i]
                  },
                  on: {
                    input: _this.expandedFunc
                  },
                  nativeOn: eventOndrop,
                  scopedSlots: {
                    default(props) {
                      if (_this.$scopedSlots.default) {
                        return _this.$scopedSlots.default(props)
                      }
                      else if (_this.renderContent) {
                        return _this.renderContent(h, props)
                      }
                      else {
                        const droppedon = arr1[i].droppedon
                        return h(
                          'div',
                          {
                            class: 'dl-tree-item__label__content',
                            style: {
                              'text-overflow': 'ellipsis',
                              'overflow': 'hidden',
                              'white-space': 'nowrap',
                              'box-sizing': 'border-box',
                              'background-color': droppedon ? '#409eff' : 'transparent',
                              'color': droppedon ? '#fff' : '#606266'
                            }
                          },
                          label
                        )
                      }
                    }
                  }
                }
              ),
              h(
                'div',
                {
                  class: 'dl-tree-children',
                  style: {
                    'height': _this.returnExpandedHeight(arr1[i])
                  }
                },
                childrenNodes
              )
            ]
          )
          children.push(node)
        }
      }
      recursionRender(h, arr1)
      return children
    },
    returnExpandedHeight(node) {
      let floorCount = 0
      const recursionFloors = function(floors, node) {
        if (!node.expanded) return floors
        const len = node.children.length
        if (!len) return floors
        floors += len
        for (let i = 0; i < len; i++) {
          floors = recursionFloors(floors, node.children[i])
        }
        return floors
      }
      floorCount = recursionFloors(floorCount, node)
      return floorCount * this.height + 'px'
    },
    expandedFunc(expanded, node) {
      if (this.lazy || this.renderAfterExpand) {
        this.expandload(node, expanded)
        return
      }
      node.expanded = expanded
      
      if (expanded) this.$emit('node-expand', node.data, node)
      else this.$emit('node-collapse', node.data, node)
    },
    expandload(node, expanded) {
      if (expanded && this.accordion) {
        const len = node.parent.children.length
        for (let i = 0; i < len; i++) {
          if (node.parent.children[i].key !== node.key) {
            node.parent.children[i].expanded = false
          }
        }
      }
      if (expanded && !this.renderEveryExpand) {
        if (!node.children.length && !node.isleaf && node.lazyload) {
          if (!this.lazy && this.renderAfterExpand) {
            const datas = this.dataRecordsByKey.get(node.key)
            return this.loadResolve(datas[this.props.children], node)
          }
          else return new Promise(resolve => {
            node.loading = true
            this.load && this.load(node, resolve)
          }).then(data => {
            this.loadResolve(data, node)
          })
        }
      } else if (expanded && this.renderEveryExpand) {
        if (!this.lazy && this.renderAfterExpand) {
          const datas = this.dataRecordsByKey.get(node.key)
          return this.loadResolve(datas[this.props.children], node)
        } else {
          return new Promise(resolve => {
            node.loading = true
            this.load && this.load(node, resolve)
          }).then(data => {
            this.loadResolve(data, node)
          })
        }
      }
      node.expanded = expanded
      this.$emit('node-collapse', node.data, node)
    },
    nodeClick(node) {
      this.currentNode = node
      this.$emit('node-click', node, node.data, node.key)
    },
    checkChange(node) {
      const checked = node.checked === 'true'
      const childChecked = node.children.some(item => item.checked === 'true')
      this.$emit('check-change', node.data, checked, childChecked)
    },
    check(data) {
      const checkedObj = {
        checkedNodes: this.checkedNodes,
        checkedKeys: this.checkedNodes.map(item => item.key),
        halfCheckedNodes: this.halfCheckedNodes,
        halfCheckedKeys: this.halfCheckedNodes.map(item => item.key)
      }
      this.$emit('check', data, checkedObj)
    },
    setChecked(data, checked = true) {
      let node = undefined
      if (typeof data === 'object') node = this.nodeRecordsByData.get(data)
      else node = this.nodeRecordsByKey.get(data)

      if (checked) node.checked = 'true'
      else node.checked = 'false'
    },
    filter(val) {
      this.filterVal = val
    },
    updateNode(data, key) {
      if (!key) return new Error('key is a required parameter ')
      const node = this.nodeRecordsByKey.get(key)
      const _key = this.keyFlag ? data[this.nodeKey] : this.countKey
      const disabled = this.showCheckbox && this.defaultDisabledKeys.length && this.defaultDisabledKeys.includes(key) || false
      this.countKey++
      const expanded = this.defaultExpandedKeys.includes(key)
      this.dataRecordsByKey.delete(key)
      this.nodeRecordsByKey.delete(key)
      this.nodeRecordsByData.delete(node.data)

      node.data = data
      node.key = _key
      node.id = _key
      node.expanded = expanded
      node.isleaf = typeof this.props.isleaf === 'function' ? this.props.isleaf(data, node) : data[this.props.isleaf] || false
      node.disabled = disabled || typeof this.props.disabled === 'function' ? this.props.disabled(data, node) : data[this.props.disabled] || false

      if (this.draggingNode.key) {
        this.draggingNode = {}
      }
      if (this.currentNode.key === key) {
        this.currentNode = node
      }
      if (this.checkedNodes.filter(_item => _item.key === key).length) {
        this.checkedNodes = this.checkedNodes.filter(_item => _item.key !== key)
        this.checkedNodes.push(node)
      }
      if (this.halfCheckedNodes.filter(_item => _item.key === key).length) {
        this.halfCheckedNodes = this.halfCheckedNodes.filter(_item => _item.key !== key)
        this.halfCheckedNodes.push(node)
      }
      this.dataRecordsByKey.set(_key, data)
      this.nodeRecordsByKey.set(_key, node)
      this.nodeRecordsByData.set(data, node)
    },
    updateKeyChildren(key, data) {
      if (!key) return new Error('key is a required parameter ')
      const node = this.nodeRecordsByKey.get(key)

      this.removeChildren(node)
      if (!data.length) return
      const len = data.length
      const level = node.level + 1
      for (let i = 0; i < len; i++) {
        const key = this.keyFlag ? data[i][this.nodeKey] : this.countKey
        const expanded = this.defaultExpandedKeys.includes(key)
        this.countKey++
        const _node = this.newNode(data[i], node, level, key, expanded)
        
        this.dataRecordsByKey.set(key, data[i])
        this.nodeRecordsByKey.set(key, _node)
        this.nodeRecordsByData.set(data[i], _node)
        node.children.push(_node)
      }
      node.lazyload = false
    },
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
      let result = []
      if (leafOnly) result = this.checkedNodes.filter(item => item.isleaf)
      else result = this.checkedNodes

      if (includeHalfChecked) result = result.concat(this.halfCheckedNodes)
      return result.map(item => item.data)
    },
    setCheckedNodes(datas) {
      const len = datas.length
      for (let i = 0; i < len; i++) {
        const node = this.nodeRecordsByData.get(datas[i])
        node.checked = 'true'
      }
    },
    getCheckedKeys(leafOnly = false) {
      let result = []
      if (this.keyFlag) result = this.checkedNodes.map(item => item.key)
      else result = this.checkedNodes.map(item => item.data)
      if (leafOnly) result = result.filter(item => item.isleaf)
      return result
    },
    setCheckedKeys(keys) {
      const len = keys.length
      for (let i = 0; i < len; i++) {
        const node = this.nodeRecordsByKey.get(keys[i])
        node.checked = 'true'
      }
    },
    getHalfCheckedNodes() {
      return this.halfCheckedNodes.map(item => item.data)
    },
    getHalfCheckedKeys() {
      return this.halfCheckedNodes.map(item => item.key)
    },
    getCurrentKey() {
      return this.currentNode.key || null
    },
    getCurrentNode() {
      return this.currentNode.data || null
    },
    setCurrentKey(key) {
      this.currentNode = this.nodeRecordsByKey.get(key)
    },
    setCurrentNode(node) {
      this.currentNode = node
    },
    getNode(data) {
      if (typeof data === 'object') return this.nodeRecordsByData.get(data)
      else return this.nodeRecordsByKey.get(data)
    },
    remove(data) {
      let key = undefined
      let node = undefined
      if (typeof data === 'object') {
        node = this.nodeRecordsByData.get(data)
        key = node.key
      } else {
        key = data
        node = this.nodeRecordsByKey.get(key)
      }
      node.parent.children = node.parent.children.filter(item => item.key !== key)
      if (this.nodeRecordsByKey.has(key)) {
        this.nodeRecordsByKey.delete(key)
      }
      if (this.dataRecordsByKey.has(key)) {
        this.dataRecordsByKey.delete(key)
      }
      if (this.nodeRecordsByData.has(node.data)) {
        this.nodeRecordsByData.delete(node.data)
      }
      if (this.draggingNode.key === key) {
        this.draggingNode = {}
      }
      if (this.currentNode.key === key) {
        this.currentNode = {}
      }
      if (this.checkedNodes.filter(_item => _item.key === key).length) {
        this.checkedNodes = this.checkedNodes.filter(_item => _item.key !== key)
      }
      if (this.halfCheckedNodes.filter(_item => _item.key === key).length) {
        this.halfCheckedNodes = this.halfCheckedNodes.filter(_item => _item.key !== key)
      }
      this.removeChildren(node)
    },
    append(data, parentNode) {
      let _parent = {}
      if (!parentNode) {
        _parent = this.nodeData
      } else if (typeof parentNode === 'object') {
        if (parentNode.type && parentNode.type === 'node') _parent = parentNode
        else _parent = this.nodeRecordsByData.get(parentNode)
      } else {
        _parent = this.nodeRecordsByKey.get(parentNode)
      }
      const level = _parent.level + 1
      const key = this.keyFlag ? data[this.nodeKey] : this.countKey
      const expanded = this.defaultExpandedKeys.includes(key)
      this.countKey++
      const node = this.newNode(data, _parent, level, key, expanded)

      if (!_parent.expanded && this.lazy && _parent.lazyload) {
        new Promise(resolve => {
          _parent.loading = true
          this.load && this.load(_parent, resolve)
        }).then(_data => {
          this.loadResolve(_data, _parent, () => {
            this.dataRecordsByKey.set(key, data)
            this.nodeRecordsByKey.set(key, node)
            this.nodeRecordsByData.set(data, node)
            _parent.children.push(node)
          })
        })
      } else if (!_parent.expanded && this.renderAfterExpand && _parent.lazyload) {
        const datas = this.dataRecordsByKey.get(_parent.key)
        this.loadResolve(datas[this.props.children], _parent, () => {
          this.dataRecordsByKey.set(key, data)
          this.nodeRecordsByKey.set(key, node)
          this.nodeRecordsByData.set(data, node)
          _parent.children.push(node)
        })
      } else {
        _parent.expanded = true
        this.dataRecordsByKey.set(key, data)
        this.nodeRecordsByKey.set(key, node)
        this.nodeRecordsByData.set(data, node)
        _parent.children.push(node)
      }
    },
    unshiftChild(data, parentNode) {
      let _parent = {}
      if (!parentNode) {
        _parent = this.nodeData
      } else if (typeof parentNode === 'object') {
        if (parentNode.type && parentNode.type === 'node') _parent = parentNode
        else _parent = this.nodeRecordsByData.get(parentNode)
      } else {
        _parent = this.nodeRecordsByKey.get(parentNode)
      }

      const level = _parent.level + 1
      const key = this.keyFlag ? data[this.nodeKey] : this.countKey
      const expanded = this.defaultExpandedKeys.includes(key)
      const node = this.newNode(data, _parent, level, key, expanded)

      if (!_parent.expanded && this.lazy && _parent.lazyload) {
        new Promise(resolve => {
          _parent.loading = true
          this.load && this.load(_parent, resolve)
        }).then(_data => {
          _data.unshift(data)
          this.dataRecordsByKey.set(key, data)
          this.nodeRecordsByKey.set(key, node)
          this.nodeRecordsByData.set(data, node)
          this.loadResolve(_data, _parent)
        })
      } else if (!_parent.expanded && this.renderAfterExpand && _parent.lazyload) {
        const datas = this.dataRecordsByKey.get(_parent.key)[this.props.children]
        datas.unshift(data)
        this.dataRecordsByKey.set(key, data)
        this.nodeRecordsByKey.set(key, node)
        this.nodeRecordsByData.set(data, node)
        this.loadResolve(datas, _parent)
      } else {

        _parent.expanded = true
        this.dataRecordsByKey.set(key, data)
        this.nodeRecordsByKey.set(key, node)
        this.nodeRecordsByData.set(data, node)
        _parent.children.unshift(node)
      }
    },
    insertBefore(data, refNode) {
      this.insert(data, refNode, 'before')
    },
    insertAfter(data, refNode) {
      this.insert(data, refNode, 'after')
    },
    insert(data, refNode, type) {
      let _sibling = {}
      if (!refNode) {
        return new Error('refNode is a required parameter')
      } else if (typeof refNode === 'object') {
        if (refNode.type) _sibling = refNode
        else _sibling = this.nodeRecordsByData.get(refNode)
      } else {
        _sibling = this.nodeRecordsByKey.get(refNode)
      }
      const parent = _sibling.parent
      parent.expanded = true
      const level = _sibling.level
      const key = this.keyFlag ? data[this.nodeKey] : this.countKey
      const expanded = this.defaultExpandedKeys.includes(key)
      this.countKey++
      const node = this.newNode(data, parent, level, key, expanded)
      let index = parent.children.indexOf(_sibling)

      if (type === 'before') {
        parent.children.splice(index, 0, node)
      } else if (type === 'after') {
        parent.children.splice(++index, 0, node)
      }
    },
    nodeDragStart(node, event) {
      this.draggingNode = node
      this.$emit('node-drag-start', node, event)
    },
    nodeDragEnd(node, event) {
      node.droppedon = false
      this.dragIndicatorTop = '-99999999px'
      this.dragIndicatorLeft = '0'
    },
    nodeDragEnter(node, event) {
      this.$emit('node-drag-enter', this.draggingNode, node, event)
    },
    nodeDragover(node, event) {
      if (this.draggingNode.key === node.key) return
      const top = this.$refs.tree.getClientRects()[0].top
      const now = event.y
      const parent = findNodeParent(event.target)

      const offsetTop = parent.offsetTop
      if ((now - top - offsetTop) > 18) {
        this.dragIndicatorTop = offsetTop + 25 + 'px'
        this.dragIndicatorLeft = node.level * this.indent + 26 + 'px'
        node.droppedon = false
        this.dropType = 'after'
      } else if ((now - top - offsetTop) > 8) {
        this.dragIndicatorTop = '-99999999px'
        this.dragIndicatorLeft = '0'
        node.droppedon = true
        this.dropType = 'inner'
      } else if ((now - top - offsetTop) > 0) {
        node.droppedon = false
        this.dragIndicatorTop = offsetTop + 'px'
        this.dropType = 'before'
        this.dragIndicatorLeft = node.level * this.indent + 26 + 'px'
      }
      this.$emit('node-drag-over', this.draggingNode, node, event)
    },
    nodeDragLeave(node, event) {
      node.droppedon = false
      this.$emit('node-drag-leave', this.draggingNode, node, event)
    },
    nodeDroped(node, event) {
      node.droppedon = false
      this.dragIndicatorTop = '-99999999px'
      this.dragIndicatorLeft = '0'

      this.dropNodeData(node)
      this.$emit('node-drop', this.draggingNode, node, this.dropType, event)
    },
    dropNodeData(node) {
      let index
      switch (this.dropType) {
        case 'before':
          index = node.parent.children.findIndex(item => item.key === node.key)
          this.draggingNode.parent.children = this.draggingNode.parent.children.filter(item => item.key !== this.draggingNode.key)
          this.draggingNode.parent = node.parent
          this.draggingNode.level = node.level
          node.parent.children.splice(index, 0, this.draggingNode)
          break;
        case 'inner':
          this.draggingNode.parent.children = this.draggingNode.parent.children.filter(item => item.key !== this.draggingNode.key)
          if (this.draggingNode.parent.key !== node.key) {
            this.draggingNode.parent = node
            this.draggingNode.level = node.level + 1
            node.children.push(this.draggingNode)
          }
          break;
        case 'after':
          index = node.parent.children.findIndex(item => item.key === node.key) + 1
          this.draggingNode.parent.children = this.draggingNode.parent.children.filter(item => item.key !== this.draggingNode.key)
          this.draggingNode.parent = node.parent
          this.draggingNode.level = node.level
          node.parent.children.splice(index, 0, this.draggingNode)
          break;
      }
    },
    removeChildren(node) {
      if (node.children.length) {
        const len = node.children.length
        for (let i = 0; i < len; i++) {
          const item = node.children[i]
          if (this.nodeRecordsByKey.has(item.key)) {
            this.nodeRecordsByKey.delete(item.key)
          }
          if (this.dataRecordsByKey.has(item.key)) {
            this.dataRecordsByKey.delete(item.key)
          }
          if (this.nodeRecordsByData.has(item.data)) {
            this.nodeRecordsByData.delete(item.data)
          }
          if (this.draggingNode.key === item.key) {
            this.draggingNode = {}
          }
          if (this.currentNode.key === item.key) {
            this.currentNode = {}
          }
          if (this.checkedNodes.filter(_item => _item.key === item.key).length) {
            this.checkedNodes = this.checkedNodes.filter(_item => _item.key !== item.key)
          }
          if (this.halfCheckedNodes.filter(_item => _item.key === item.key).length) {
            this.halfCheckedNodes = this.halfCheckedNodes.filter(_item => _item.key !== item.key)
          }
          this.removeChildren(item)
        }
      }
      node.children = []
    }
  }
}
</script>

<style scoped>
.dl-tree {
  position: relative;
}
.empty-tree__text {
  text-align: center;
}
.dl-tree-node {
  cursor: pointer;
  background: #fff;
  white-space: nowrap;
}
.dl-tree-children {
  overflow: hidden;
  transition: height .3s ease-in-out
}
.dl-tree-children__show {
  height: 52px;
}
</style>