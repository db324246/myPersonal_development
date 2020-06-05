<script>
import DlTreeItem from './dl-tree-item'
const defaultFunction = function() {}
const findNodeParent = function(node) {
  if (!node.parentNode || node.className === 'dl-tree-node') return node
  if (node.parentNode.className === 'dl-tree-node') {
    return node.parentNode
  }
  else return findNodeParent(node.parentNode)
}
export default {
  name: 'DlTree',  
  componentName: 'DlTree',
  components: {
    DlTreeItem
  },
  props: {
    props: {
      type: Object,
      required: true,
      default() {
        return {
          label: 'label',
          children: 'children',
          isleaf: 'isleaf',
          disabled: 'disabled'
        }
      }
    },
    data: {
      type: Array,
      default: () => []
    },
    indent: {
      type: Number,
      default: 16
    },
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: defaultFunction
    },
    renderAfterExpand: {
      type: Boolean,
      default: false
    },
    nodeKey: {
      type: String,
      default: ''
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    accordion: {
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {
      default: Array,
      default: () => []
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    highlightCurrent: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    autoChecked: {
      type: Boolean,
      default: true
    },
    filterNodeMethod: {
      type: Function,
      default: defaultFunction
    },
    renderContent: {
      type: Function,
      default: null
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrop: {
      type: Function,
      default: defaultFunction
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
      countKey: 0,
      nodeData: {
        id: 'root',
        key: 'root',
        type: 'node',
        expanded: true,
        disabled: false,
        checked: 'false',
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
      nodeRecordsByKey: new Map(), // key记录所有节点
      nodeRecordsByData: new Map(), // data记录所有节点
      currentNode: {}, // 记录当前节点
      checkedNodes: [], // 记录已勾选的节点
      halfCheckedNodes: [],
      draggingNode: {},
      dragIndicatorTop: '-99999999px',
      dropType: '',
    }
  },
  created() {
    if (this.lazy) {
      const parentNode = this.nodeData
      new Promise(resolve => {
        this.load && this.load(parentNode, resolve)
      }).then(data => {
        this.loadResolve(data, parentNode)
      })
    } else if (this.data.length) {
      this.recursionNodeData(this.data, this.nodeData.children, this.nodeData.level, this.nodeData)
    }
  },
  render(h) {
    const childrenNodes = this.recursionNodeRender(h, this.nodeData.children)
    const left = Object.keys(this.draggingNode).length ? this.draggingNode.level * this.indext + 26 + 'px' : '0'
    const top = this.dragIndicatorTop
    const display = Object.keys(this.draggingNode).length ? 'block' : 'none'

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
      return {
        id: key,
        key,
        type: 'node',
        expanded,
        disabled: data[this.props.disabled] || false,
        checked: 'false',
        halfChecked: false,
        isleaf: data[this.props.isleaf] || false,
        lazyload: true,
        loading: false,
        droppedon: false,
        level,
        children: [],
        data,
        parent: parentNode
      }
    },
    loadResolve(data, parentNode, cb) {
      const len = data.length
      if (len) {
        const level = parentNode.level + 1
        if (this.renderAfterExpand) parentNode.children = []
        for (let i = 0; i < len; i++) {
          if (i === 0) {
            if (this.nodeKey && data[i][this.nodeKey]) this.keyFlag = true
            else this.keyFlag = false
          }
          const key = this.keyFlag ? data[i][this.nodeKey] : this.countKey
          const expanded = this.defaultExpandedKeys.includes(key)
          this.countKey++
          const node = this.newNode(data[i], parentNode, level, key, expanded)
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
      if (!this.renderAfterExpand) parentNode.lazyload = false
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
        this.nodeRecordsByKey.set(key, node)
        this.nodeRecordsByData.set(arr1[i], node)
        if (arr1[i][this.props.children] && arr1[i][this.props.children].length) {
          this.recursionNodeData(arr1[i][this.props.children], node.children, level, node)
        }
      }
    },
    recursionNodeRender(h, childrenNodes) {
      const children = []
      const _this = this
      const recursionRender = function(h, arr1, arr2) {
        const len = arr1.length
        for (let i = 0; i < len; i++) {
          if (_this.filterVal && !_this.filterNodeMethod(_this.filterVal, arr1[i].data, arr1[i])) {
            continue
          }
          let childrenNodes = []
          
          if (arr1[i].children.length) {
            childrenNodes = _this.recursionNodeRender(h, arr1[i].children)
          }
          const eventOn = {}
          if (_this.draggable) {
            if (_this.allowDrag(arr1[i])) {
              eventOn.dragstart = (ev) => _this.nodeDragStart(arr1[i], ev)
              eventOn.dragend = (ev) => _this.nodeDragEnd(arr1[i], ev)
            }
            if (_this.allowDrop(_this.draggingNode, arr1[i])) {
              eventOn.dragover = (ev) => _this.nodeDragover(arr1[i], ev)
              eventOn.dragenter = (ev) => _this.nodeDragEnter(arr1[i], ev)
              eventOn.dragleave = (ev) => _this.nodeDragLeave(arr1[i], ev)
              eventOn.drop = (ev) => _this.nodeDroped(arr1[i], ev)
            }
          }
          const node = h(
            'div',
            {
              class: 'dl-tree-node',
              attrs: {
                draggable: _this.draggable && _this.allowDrag(arr1[i])
              },
              on: eventOn
            },
            [
              h(
                'dl-tree-item',
                {
                  props: {
                    value: arr1[i].expanded,
                    level: arr1[i].level,
                    label: arr1[i].data[_this.props.label],
                    dnode: arr1[i]
                  },
                  on: {
                    input: _this.expandedFunc
                  },
                  scopedSlots: {
                    default(props) {
                      if (_this.$scopedSlots.default) return _this.$scopedSlots.default(props)
                      else if (_this.renderContent) return _this.renderContent(h, props)
                      else return h(
                        'span',
                        {
                          class: 'dl-tree-item__label__content',
                          style: {
                            'background-color': arr1[i].droppedon ? '#409eff' : 'transparent',
                            'color': arr1[i].droppedon ? '#fff' : '#606266'
                          }
                        },
                        props.data.label)
                    }
                  }
                }
              ),
              h(
                'div',
                {
                  class: 'dl-tree-children',
                  style: {
                    'height': _this.returnExpandedClass(arr1[i])
                  }
                },
                childrenNodes
              )
            ]
          )
          arr2.push(node)
        }
      }
      recursionRender(h, childrenNodes, children)
      return children
    },
    returnExpandedClass(node) {
      let floorCount = 0
      if (!node.expanded) return floorCount * 26 + 'px'
      const recursionFloors = function(floors, node) {
        if (!node.expanded) return floors
        const len = node.children.length
        if (!len) return floors
        floors++
        for (let i = 0; i < len; i++) {
          floors = recursionFloors(floors, node.children[i])
        }
        return floors
      }
      floorCount = recursionFloors(floorCount, node)
      return floorCount * 26 + 'px'
    },
    expandedFunc(expanded, node) {
      if (this.lazy) {
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
      if (expanded && !this.renderAfterExpand) {
        if (!node.children.length && !node.isleaf && node.lazyload) {
          return new Promise(resolve => {
            node.loading = true
            this.load && this.load(node, resolve)
          }).then(data => {
            this.loadResolve(data, node)
          })
        }
      } else if (expanded && this.renderAfterExpand) {
        return new Promise(resolve => {
          node.loading = true
          this.load && this.load(node, resolve)
        }).then(data => {
          this.loadResolve(data, node)
        })
      }
      node.expanded = expanded
      this.$emit('node-collapse', node.data, node)
    },
    nodeClick(node) {
      this.currentNode = node
      this.$emit('node-click', node, node.data, node.key)
    },
    getCheckedKeys(leafOnly = false) {
      let result = []
      if (this.keyFlag) result = this.checkedNodes.map(item => item.key)
      else result = this.checkedNodes.map(item => item.data)
      if (leafOnly) result = result.filter(item => item.isleaf)
      return result
    },
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
      let result = []
      if (leafOnly) result = this.checkedNodes.filter(item => item.isleaf) 
      else result = this.checkedNodes
      if (includeHalfChecked) result = result.concat(this.halfCheckedNodes)

      return result
    },
    getHalfCheckedKeys() {
      return this.halfCheckedNodes.map(item => item.key)
    },
    getHalfCheckedNodes() {
      return this.halfCheckedNodes
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
    setCheckedKeys(keys) {
      const len = keys.length
      for (let i = 0; i < len; i++) {
        const node = this.nodeRecordsByKey.get(keys[i])
        node.checked = 'true'
      }
    },
    setChecked(data, checked = true) {
      let node = undefined
      if (typeof(data) === 'object') node = this.nodeRecordsByData.get(data)
      else node = this.nodeRecordsByKey.get(data)

      if (checked) node.checked = 'true'
      else node.checked = 'false'
    },
    getNode(data) {
      if (typeof(data) === 'object') return this.nodeRecordsByData.get(data)
      else return this.nodeRecordsByKey.get(data)
    },
    setCurrentKey(key) {
      this.currentNode = this.nodeRecordsByKey.get(key)
    },
    setCurrentNode(node) {
      this.currentNode = node
    },
    remove(data) {
      let key = undefined
      let node = undefined
      if (typeof(data) === 'object') {
        node = this.nodeRecordsByData.get(data)
        key = node.key
      } else {
        key = data
        node = this.nodeRecordsByKey.get(key)
      }
      node.parent.children = node.parent.children.filter(item => item.key !== key)
    },
    append(data, parentNode) {
      let _parent = {}
      if (!parentNode) {
        _parent = this.nodeData
      } else if (typeof(parentNode) === 'object') {
        if (parentNode.type) _parent = parentNode
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
        }).then(data => {
          this.loadResolve(data, _parent, () => {
            this.nodeRecordsByKey.set(key, node)
            this.nodeRecordsByData.set(data, node)
            _parent.children.push(node)
          })
        })
      } else {
        _parent.expanded = true
        this.nodeRecordsByKey.set(key, node)
        this.nodeRecordsByData.set(data, node)
        _parent.children.push(node)
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
      } else if (typeof(refNode) === 'object') {
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
    filter(val) {
      this.filterVal = val
    },
    nodeDragStart(node, event) {
      event.stopPropagation()
      this.draggingNode = node
      this.$emit('node-drag-start', node, event)
    },
    nodeDragEnd(node, event) {
      event.stopPropagation()

    },
    nodeDragEnter(node, event) {
      event.stopPropagation()
      this.$emit('node-drag-enter', this.draggingNode, node, event)
    },
    nodeDragover(node, event) {
      const top = this.$refs.tree.getClientRects()[0].top
      const now = event.y
      const parent = findNodeParent(event.target)

      const offsetTop = parent.offsetTop
      if ((now - top - offsetTop) > 18) {
        this.dragIndicatorTop = offsetTop + 25 + 'px'
        node.droppedon = false
        this.dropType = 'after'
      } else if ((now - top - offsetTop) > 8) {
        this.dragIndicatorTop = '-99999999px'
        node.droppedon = true
        this.dropType = 'inner'
      } else if ((now - top - offsetTop) > 0) {
        node.droppedon = false
        this.dragIndicatorTop = offsetTop + 'px'
        this.dropType = 'before'
      }

      event.stopPropagation()
      event.preventDefault()
      this.$emit('node-drag-over', this.draggingNode, node, event)
    },
    nodeDragLeave(node, event) {
      event.stopPropagation()
      node.droppedon = false
      this.$emit('node-drag-leave', this.draggingNode, node, event)
    },
    nodeDroped(node, event) {
      node.droppedon = false
      this.dragIndicatorTop = '-99999999px'
      event.stopPropagation()

      this.$emit('node-drop', this.draggingNode, node, this.dropType, event)
    }
  }
}
</script>

<style scoped>
.dl-tree {
  position: relative;
}
.dl-tree-node {
  /* position: relative; */
  cursor: pointer;
  background: #fff;
  white-space: nowrap;
  /* height: 26px;
  overflow: hidden;
  transition: all .3s ease-in-out */
}
.dl-tree-children {
  overflow: hidden;
  transition: height .3s ease-in-out
}
.dl-tree-children__show {
  height: 52px;
}
/* .dl-tree-children__hidden {
  display: none;
} */
</style>