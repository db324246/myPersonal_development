<script>
import DlTreeItem from './dl-tree-item'
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
      default: null
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
      default: null
    },
    renderContent: {
      type: Function,
      default: null
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
        level: 0,
        children: [],
        data: null,
        parent: null
      },
      nodeRecordsByKey: new Map(), // key记录所有节点
      nodeRecordsByData: new Map(), // data记录所有节点
      currentNode: {}, // 记录当前节点
      checkedNodes: [], // 记录已勾选的节点
      halfCheckedNodes: []
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
      // this.load && this.load(this.parentNode, this.loadResolve)
    } else if (this.data.length) {
      this.recursionNodeData(this.data, this.nodeData.children, this.nodeData.level, this.nodeData)
    }
  },
  render(h) {
    const childrenNodes = this.recursionNodeRender(h, this.nodeData.children)

    return h(
      'div',
      {
        class: 'dl-tree'
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
          const node = h(
            'div',
            {
              class: 'dl-tree-node'
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
                      else return h('span', props.data.label)
                    }
                  }
                }
              ),
              h(
                'div',
                {
                  class: _this.returnExpandedClass(arr1[i].expanded)
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
    returnExpandedClass(expanded) {
      let className = 'dl-tree-children '
      if (expanded) className += 'dl-tree-children__show'
      else className += 'dl-tree-children__hidden'
      return className
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
    }
  },
}
</script>

<style scoped>
.dl-tree-node {
  position: relative;
  cursor: pointer;
  background: #fff;
  white-space: nowrap;
}
.dl-tree-children {
  /* transition: height .3s ease-in-out */
  z-index: 10;
}
.dl-tree-children__show {
  display: block;
  transition: all .3s ease-in-out;
  animation: slideDown .3s ease-in-out;
}
.dl-tree-children__hidden {
  transition: all .3s ease-in-out;
  animation: slideup .3s ease-in-out;
}
@keyframes slideDown {
  0% {
    height: 0;
  }
  100% {
    height: 26px
  }
}
@keyframes slideup {
  0% {
    height: 26px;
    display: block;
  }
  100% {
    height: 0;
    display: none;
  }
}
</style>