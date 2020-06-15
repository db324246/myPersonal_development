<script>
import dlCheckbox from './dl-checkbox'
import dlLoading from './dl-loading'
export default {
  name: 'dl-tree-item',
  componentName: 'dl-tree-item',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: ''
    },
    dnode: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    dlCheckbox,
    dlLoading
  },
  data() {
    return {
      ddata: {},
      childrenLen: 0
    }
  },
  computed: {
    nodeClass() {
      let className = 'dl-tree-item'
      if (this.$parent.currentNode.key === this.dnode.key) {
        className += ' dl-tree-item__isCurrent'
        if (this.$parent.highlightCurrent) className += ' dl-tree-item__highlight'
      }
      return className
    },
    nodePaddingLeft() {
      return (this.level - 1) * this.$parent.indent + 'px'
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val && this.$parent.autoExpandParent) {
          this.autoExpandParent(this.dnode)
        }
      },
      immediate: true
    },
    'dnode.checked': {
      handler(val) {
        if (val === 'indeterminate') {
          this.dnode.halfChecked = true
          if (!this.$parent.halfCheckedNodes.some(item => item.key === this.dnode.key)) {
            this.$parent.halfCheckedNodes.push(this.dnode)
          }
          return
        }
        else if (val === 'true' && !this.$parent.checkedNodes.some(item => item.key === this.dnode.key)) {
          this.$parent.checkedNodes.push(this.dnode)
        }
        else if (val === 'false' && this.$parent.checkedNodes.some(item => item.key === this.dnode.key)) {
          this.$parent.checkedNodes = this.$parent.checkedNodes.filter(item => item.key !== this.dnode.key)
        }
        
        this.dnode.halfChecked = false
        if (this.$parent.halfCheckedNodes.some(item => item.key === this.dnode.key)) {
          this.$parent.halfCheckedNodes = this.$parent.halfCheckedNodes.filter(item => item.key !== this.dnode.key)
        }

        if (this.$parent.singleChecked && val === 'true') {
          return this.singleCheckedFunc()
        }
        if (!this.$parent.checkStrictly) return
        
        const chilLen = this.dnode.children.length
        const parChilLen = this.dnode.parent.children.length

        // 对子节点全选
        if (chilLen) {
          for (let i = 0; i < chilLen; i++) {
            this.dnode.children[i].checked = val
          }
        }
        // 对父节点半选
        if (parChilLen > 1) {
          if (this.dnode.parent.children.every(item => item.checked === 'true')) this.dnode.parent.checked = 'true'
          else if (this.dnode.parent.children.every(item => item.checked === 'false')) this.dnode.parent.checked = 'false'
          else this.dnode.parent.checked = 'indeterminate'
        } else {
          this.dnode.parent.checked = val
        }
      },
      immediate: true
    }
  },
  created() {
    this.ddata = this.dnode.data
    this.childrenLen = this.ddata[this.$parent.props.children] && this.ddata[this.$parent.props.children].length || 0
  },
  render(h) {
    const childrenNodes = [
      h(
        'div',
        {
          class: 'dl-tree-item__label',
          style: {
            // 'margin-left': !this.dnode.isleaf && this.dnode.children.length || this.$parent.lazy && this.dnode.lazyload ? '0' : '26px'
          }
        },
        this.renderLabelChild(h)
      )
    ]
    const visibile = !this.dnode.isleaf && this.dnode.children.length || !this.dnode.isleaf && this.$parent.lazy && this.dnode.lazyload || !this.dnode.isleaf && this.$parent.renderAfterExpand && this.dnode.lazyload && this.childrenLen ? 'visible' : 'hidden'
    childrenNodes.unshift(h(
      'span',
      {
        class: 'dl-tree-item__expand-icon',
        style: {
          'visibility': visibile,
          'transform': this.value ? 'rotate(90deg)' : 'rotate(0)'
        },
        on: {
          click: this.expandNode,
        }
      }
    ))
    return h(
      'div',
      {
        class: this.nodeClass,
        style: {
          'padding-left': this.nodePaddingLeft
        },
        attrs: {
          key: this.dnode.key
        },
        on: {
          click: this.treeNodeClick,
          contextmenu: this.handlerContextmenu
        }
      },
      childrenNodes
    )
  },
  methods: {
    treeNodeClick(e) {
      this.$parent.nodeClick(this.dnode)
      if (this.$parent.expandOnClickNode) this.expandNode(e)
      if (this.$parent.showCheckbox && this.$parent.checkOnClickNode) this.$refs.checkbox.handlerClick()
    },
    handlerContextmenu(e) {
      this.$parent.$emit('node-contextmenu', e, this.dnode.data, this.dnode)
      e.preventDefault();
    },
    expandNode(e) {
      e.stopPropagation()
      if (this.dnode.loading) return
      this.$emit('input', !this.value, this.dnode)
    },
    autoExpandParent(node) {
      if (!node.parent) return
      if (!node.parent.expanded) node.parent.expanded = true
      this.autoExpandParent(node.parent)
    },
    singleCheckedFunc() {
      const len = this.$parent.checkedNodes.length
      for (let i = 0; i < len; i++) {
        if (this.$parent.checkedNodes[i].key !== this.dnode.key) {
          this.$parent.checkedNodes[i].checked = 'false'
        }
      }
      this.$parent.checkedNodes = this.$parent.checkedNodes.filter(item => item.key === this.dnode.key)
    },
    renderLabelChild(h) {
      const node = this.$scopedSlots.default({
        node: this.dnode,
        data: this.dnode.data
      })
      const children = [
        h(
          'dl-loading',
          {
            props: {
              'value': this.dnode.loading,
              'load-key': this.dnode.key
            }
          }
        ),
        h(
          'div',
          {
            class: 'dl-tree-item__label__container'
          },
          node
        )
      ]
      if (this.$parent.showCheckbox && this.dnode.hasChecked === 'true') {
        children.unshift(h(
          'dl-checkbox',
          {
            ref: 'checkbox',
            props: {
              'value': this.dnode.checked,
              'params-data': this.dnode,
              'disabled': this.dnode.disabled
            },
            on: {
              input: (val) => {
                this.dnode.checked = val
              }
            }
          }
        ))
      }
      return children
    }
  }
}
</script>

<style scoped>
.dl-tree-item {
  display: flex;
  align-items: center;
  height: 26px;
}
.dl-tree-item:hover {
  background-color: #f5f7fa;
}
.dl-tree-item__isCurrent {
  background-color: #f5f7fa;
}
.dl-tree-item__highlight {
  background-color: #ebfafa;
}
.dl-tree-item__label {
  flex: 1;
  display: flex;
  align-items: center;
  height: 26px;
  font-size: 14px;
  color: #606266;
  z-index: 10;
}
.dl-tree-item__expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  width: 26px;
  padding-left: 8px;
  overflow: hidden;
  transition: transform .3s ease-in-out
}
.dl-tree-item__expand-icon::after {
  display: block;
  content: '';
  width: 10px;
  height: 10px;
  border-width: 5px;
  border-style: solid;
  border-top-color: transparent;
  border-left-color: #c0c4cc;
  border-right-color: transparent;
  border-bottom-color: transparent;
  box-sizing: border-box;
}
.dl-tree-item__label__container {
  flex: 1;
  height: 26px;
  line-height: 26px;
}
</style>