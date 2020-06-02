<template>
  <div :key="dnode.key" :class="nodeClass" :style="{'padding-left': nodePaddingLeft}" @click="treeNodeClick">
    <span 
      v-if="!dnode.isleaf && dnode.children.length || $parent.lazy && dnode.lazyload" 
      class="dl-tree-item__expand-icon" 
      :style="{'transform': value ? 'rotate(90deg)' : 'rotate(0)'}"
      @click.stop="expandNode">
    </span>
    <div class="dl-tree-item__label" :style="{'margin-left': !dnode.isleaf && dnode.children.length || $parent.lazy && dnode.lazyload ? '0' : '26px'}">
      <dl-checkbox 
        v-if="$parent.showCheckbox" 
        v-model="dnode.checked" 
        :params-data="dnode"
        :disabled="dnode.disabled">
      </dl-checkbox>
      <dl-loading v-model="dnode.loading" :load-key="dnode.key"></dl-loading>
      <slot :node="dnode" :data="dnode.data">
      </slot>
    </div>
  </div>
</template>

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

        if (!this.$parent.autoChecked) return
        
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
  },
  methods: {
    treeNodeClick() {
      this.$parent.nodeClick(this.dnode)
      if (this.$parent.expandOnClickNode) this.expandNode()
    },
    expandNode() {
      if (this.dnode.loading) return
      this.$emit('input', !this.value, this.dnode)
    },
    autoExpandParent(node) {
      if (!node.parent) return
      if (!node.parent.expanded) node.parent.expanded = true
      this.autoExpandParent(node.parent)
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
  font-size: 14px;
  color: #606266;
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
}
</style>