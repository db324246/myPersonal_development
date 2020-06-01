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
    lazy: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: null
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
    highlightCurrent: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
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
      countKey: 0,
      nodeData: {
        id: 'root',
        key: 'root',
        expanded: true,
        disabled: false,
        checked: 'false',
        isleaf: false,
        lazyload: true,
        loading: false,
        level: 0,
        children: [],
        data: null,
        parent: null
      },
      nodeRecords: new Map(), // 记录所有节点
      currentNode: {}, // 记录当前节点
      checkedNodes: [], // 记录已勾选的节点
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
    loadResolve(data, parentNode) {
      const len = data.length
      if (len) {
        const level = parentNode.level + 1
        for (let i = 0; i < len; i++) {
          if (i === 0) {
            if (this.nodeKey && data[i][this.nodeKey]) this.keyFlag = true
            else this.keyFlag = false
          }
          const id = this.keyFlag ? data[i][this.nodeKey] : this.countKey
          const key = this.keyFlag ? data[i][this.nodeKey] : this.countKey
          const expanded = this.defaultExpandedKeys.includes(key)
          this.countKey++
          const node = {
            id,
            key,
            expanded,
            disabled: data[i][this.props.disabled] || false,
            checked: 'false',
            isleaf: data[i][this.props.isleaf] || false,
            lazyload: true,
            loading: false,
            level,
            children: [],
            data: data[i],
            parent: parentNode
          }
          this.nodeRecords.set(key, node)
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
        parentNode.lazyload = false
      }
      parentNode.loading = false
      parentNode.expanded = true
    },
    recursionNodeData(arr1, arr2, level, parent) {
      level++
      const len = arr1.length
      for (let i = 0; i < len; i++) {
        if (i === 0) {
          if (this.nodeKey && arr1[i][this.nodeKey]) this.keyFlag = true
          else this.keyFlag = false
        }
        const id = this.keyFlag ? arr1[i][this.nodeKey] : this.countKey
        const key = this.keyFlag ? arr1[i][this.nodeKey] : this.countKey
        const expanded = this.defaultExpandAll || this.defaultExpandedKeys.includes(key)
        this.countKey++
        const node = {
          id,
          key,
          expanded,
          disabled: arr1[i][this.props.disabled] || false,
          checked: 'false',
          isleaf: arr1[i][this.props.isleaf] || false,
          lazyload: false,
          loading: false,
          level,
          children: [],
          data: arr1[i],
          parent
        }
        arr2.push(node)
        this.nodeRecords.set(key, node)
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
                    input: ({val, node}) => {
                      if (_this.lazy) _this.expandload(node, val)
                      else arr1[i].expanded = val
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
    expandload(node, flag) {
      if (flag && this.accordion) {
        const len = node.parent.children.length
        for (let i = 0; i < len; i++) {
          if (node.parent.children[i].key !== node.key) {
            node.parent.children[i].expanded = false
          }
        }
      }
      if (!node.children.length && !node.isleaf && node.lazyload) {
        new Promise(resolve => {
          node.loading = true
          this.load && this.load(node, resolve)
        }).then(data => {
          this.loadResolve(data, node)
        })
      }
      else node.expanded = flag
    },
    nodeClick(node) {
      this.currentNode = node
      this.$emit('node-click', {node, data: node.data, key: node.key})
    },
    getCheckedKeys() {
      if (this.keyFlag) return this.checkedNodes.map(item => item.key)
      else return this.checkedNodes.map(item => item.data)
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
  transition: height .3s ease-in-out
}
.dl-tree-children {
}
.dl-tree-children__show {
  display: block;
}
.dl-tree-children__hidden {
  display: none;
}
</style>