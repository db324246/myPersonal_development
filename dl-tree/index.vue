<script>
import DlTreeItem from './dl-tree-item'
export default {
  name: 'DlTree',  
  componentName: 'DlTree',
  components: {
    DlTreeItem
  },
  props: {
    lazy: {
      type: Boolean,
      default: false
    },
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
      nodeData: {
        id: 'root',
        key: 'root',
        expanded: true,
        disabled: false,
        checked: 'false',
        isleaf: false,
        level: 0,
        children: [],
        data: null,
        parent: null
      },
      currentNode: {},
      checkedNodes: []
    }
  },
  created() {
    if (this.data.length) {
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
    recursionNodeData(arr1, arr2, level, parent) {
      level++
      const len = arr1.length
      for (let i = 0; i < len; i++) {
        const node = {
          id: arr1[i].label,
          key: arr1[i].label,
          expanded: false,
          disabled: arr1[this.props.disabled] || false,
          checked: 'false',
          isleaf: arr1[this.props.isleaf] || false,
          level,
          children: [],
          data: arr1[i],
          parent
        }
        arr2.push(node)
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
                    input: (val) => {
                      arr1[i].expanded = val
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
    nodeClick(node) {
      this.currentNode = node
      this.$emit('nodeClick', node, node.data, node.key)
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