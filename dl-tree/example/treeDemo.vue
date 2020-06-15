<template>
  <div class='page_container'>
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>
    <div class="btn_box">
      <el-button size='small' type='primary' @click='getCheckedKeys'>getCheckedKeys</el-button>
      <el-button size='small' type='primary' @click='getCheckedNodes'>getCheckedNodes</el-button>
      <el-button size='small' type='primary' @click='getHalfCheckedKeys'>getHalfCheckedKeys</el-button>
      <el-button size='small' type='primary' @click='getHalfCheckedNodes'>getHalfCheckedNodes</el-button>
      <el-button size='small' type='primary' @click='getNodeKey'>getNodeBykey</el-button>
      <el-button size='small' type='primary' @click='getNodeData'>getNodeByData</el-button>
      <el-button size='small' type='primary' @click='setCurrentKey'>setCurrentKey</el-button>
      <el-button size='small' type='primary' @click='setCheckedKeys'>setCheckedKeys</el-button>
      <el-button size='small' type='primary' @click='setChecked'>setChecked</el-button>
    </div>
    <div  class="btn_box">
      <el-button size='small' type='warning' @click='remove'>remove</el-button>
      <el-button size='small' type='warning' @click='append'>append</el-button>
      <el-button size='small' type='warning' @click='insertBefore'>insertBefore</el-button>
      <el-button size='small' type='warning' @click='insertAfter'>insertAfter</el-button>
      <el-button size='small' type='warning' @click='updateKeyChildren'>updateKeyChildren</el-button>
    </div>

    <dl-tree 
      :empty-text="'暂无数据~'"
      ref="dlTree"
      :indent="18"
      :data="data"
      node-key="id" 
      :lazy="false"
      :load="loadNode"
      :draggable="true"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :render-after-expand="true"
      :render-every-expand="false"
      :props="defaultProps" 
      :default-expand-all="false"
      :accordion="true"
      :current-node-key="4"
      :default-expanded-keys="[]"
      :expand-on-click-node="true"
      :highlight-current="true"
      :show-checkbox="true"
      :check-on-click-node="false"
      :auto-checked="false"
      :single-checked="true"
      :auto-expand-parent="true"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
      @check-change="checkChange"
      @check="check"
      @node-contextmenu="nodeContextmenu"
      @current-change="currentChange"
      @node-expand="nodeExpand"
      @node-collapse="nodeCollapse"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop">
     
<!-- 
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(data)">
            Delete
          </el-button>
        </span>
      </span> -->
    </dl-tree>
  </div>
</template>

<script>
import DlTree from 'dl-tree'
export default {
  components: {
    DlTree
  },
  data() {
    return {
      flag: true,
      filterText: '',
      data: [
        {
          id: 1,
          label: '',
          children: [
            {
              id: 2,
              label: '二级 1-1',
              children: [
                {
                  id: 3,
                  label: '三级 1-1-1'
                }
              ]
            }, 
            {
              id: 7,
              label: '二级 2-2',
              children: [
                {
                  id: 8,
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        }, 
        {
          id: 4,
          label: '',
          children: [
            {
              id: 5,
              label: '二级 2-1',
              children: [
                {
                  id: 6,
                  label: '三级 2-1-1'
                }
              ]
            }
          ]
        }, 
        {
          id: 9,
          label: '一级 3',
          children: [
            {
              id: 10,
              label: '二级 3-1',
              children: [
                {
                  id: 11,
                  label: '三级 3-1-1'
                }
              ]
            }, 
            {
              id: 12,
              label: '二级 3-2',
              children: [
                {
                  id: 13,
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ],
      data1: [
        {
          id: 1,
          label: '一级 1',
        }, 
        {
          id: 2,
          label: '一级 2'
        }, 
        {
          id: 3,
          label: '一级 3'
        }
      ],
      data2: [
        {
          id: 4,
          label: '二级 1-1'
        },
        {
          id: 5,
          label: '二级 2-1'
        }        
      ],
      data3: [
        {
          id: 6,
          label: '二级 2-2',
          disabled: true
        },    
        {
          id: 7,
          label: '二级 3-1'
        }
      ],
      data4: [
        {
          id: 8,
          label: '二级 3-2'
        }
      ],
      data5: [
        {
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }
      ],
      defaultProps: {
        children: 'children',
        label(data, node) {
          if(!data.label) return '1234897'
          return data.label
        },
        disabled: 'disabled'
      },
      node: undefined,
      resolve: undefined,
      map: new Map(),
      a: {
        a: 1
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.dlTree.filter(val);
    }
  },
  created() {
    this.map.set({a: 1}, 1234)
    this.map.set(this.a, 1234)
    console.log(window.console)
  },
  methods: {
    getCheckedKeys() {
      console.log(this.$refs.dlTree.getCheckedKeys())
      // (leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false
    },
    getCheckedNodes() {
      console.log(this.$refs.dlTree.getCheckedNodes())
      // (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
    },
    getHalfCheckedKeys() {
      console.log(this.$refs.dlTree.getHalfCheckedKeys())
    },
    getHalfCheckedNodes() {
      console.log(this.$refs.dlTree.getHalfCheckedNodes())
    },
    getNodeData() {
      console.log(this.$refs.dlTree.getNode(this.data1[0])
      )
    },
    getNodeKey() {
      console.log(this.$refs.dlTree.getNode(1))
    },
    setCurrentKey() {
      this.$refs.dlTree.setCurrentKey(1)
      // (key) 待被选节点的 key，若为 null 则取消当前高亮的节点
    },
    setCheckedKeys() {
      this.$refs.dlTree.setCheckedKeys([1])
      // leafOnly 接收一个参数, 勾选节点的 key 的数组
    },
    setChecked() {
      this.$refs.dlTree.setChecked(1, false)
      // (key/data, checked) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 
    },
    remove() {
      this.$refs.dlTree.remove(0)
      // (data) 要删除的节点的 data 或者 key
    },
    updateKeyChildren() {
      this.$refs.dlTree.updateKeyChildren(1, [      
        {
          id: 2,
          label: '1263'
        }, 
        {
          id: 7,
          label: '45668'
        }
      ])
    },
    append() {
      this.$refs.dlTree.append({
        id: 0,
        label: '新建文件夹'
      }, 1)
     	// (data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node 默认根节点
    },
    insertBefore() {
      this.$refs.dlTree.insertBefore({
        id: 0,
        label: '新建文件夹'
      }, 2)
      // (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的后一个节点的 data、key 或者 node
    },
    insertAfter() {
      this.$refs.dlTree.insertAfter({
        id: 0,
        label: '新建文件夹'
      }, 1)
      // (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的前一个节点的 data、key 或者 node
    },
    nodeContextmenu(e, data, node) {
      console.log(e, data, node)
    },
    handleNodeClick(node, data, key){
      console.log(node, data, key)
      // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
    },
    currentChange(data, node) {
      console.log(data, node)
    },
    checkChange(data, checked, childChecked) {
      console.log(data, checked, childChecked)
      // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    },
    check(data, checkedObj) {
      console.log(data, checkedObj)
      // 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
    },
    nodeExpand(data, node) {
      console.log('Expand', data, node)
      // 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node
    },
    nodeCollapse(data, node) {
      console.log('Collapse', data, node)
      // 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        this.node = node
        this.resolve = resolve
        return resolve(this.data1);
      }
      
      if (node.id === 1) {
        return setTimeout(() => {
          resolve(this.data2)
        }, 3000)
      }
      else if (node.id === 2) {
        return setTimeout(() => {
         resolve(this.data3)
        }, 4000)
      }
      setTimeout(() => {
        if (node.id === 3) resolve(this.data4)
        else if (node.id === 5) resolve(this.data5)
        else resolve([])
      }, 2000);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node">
          <span>{data.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(data, node) }>Delete</el-button>
          </span>
        </span>);
    },
    handleDragStart(node, ev) {
      console.log('drag start', node, ev);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.data.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.data.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // if (this.flag) {
      //   console.log('tree drag over: ', dropNode.data.label);
      //   this.flag = false
      //   setTimeout(() => {
      //     this.flag = true
      //   }, 1000)
      // }
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.data.label, dropType);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', dropNode.data.label, dropType);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 2-1') {
  
        return type !== 'inner';
        // return false;
      }
      return true
    },
    allowDrag(draggingNode) { // 三级 2-1-1  二级 2-1
      return draggingNode.data.label.indexOf('三级 2-1-1') === -1;
    }
  }
}
</script>

<style scoped>
.page_container {
  position: relative;
  padding-left: 200px;
}
.btn_box {
  line-height: 40px;
  margin-bottom: 10px;
}
>>>.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>