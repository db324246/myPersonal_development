<template>
  <div class="box">
    <!-- 此demo是用tree组件，在懒加载的设定下进行 新增、删除、编辑、移位、拖拽。demo每一层的数据为我写死的假数据。在实际开发中，应在各个功能操作的节点处发送请求后，再更新组件 -->

    <!-- 按钮组 -->
    <div class="btn_group">
      <el-button @click="actionTree('addchildren')" type="primary">添加子节点</el-button>
      <el-button @click="actionTree('add')" type="primary">添加同级节点</el-button>
      <el-button @click="actionTree('delete')" type="danger">删除</el-button>
      <el-button @click="actionTree('resetName')" type="primary">重命名</el-button>
      <el-button @click="actionTree('moveUp')" type="primary">上移</el-button>
      <el-button @click="actionTree('moveDown')" type="primary">下移</el-button>
    </div>

    <!-- tree组件 -->
    <!-- 注意：no-key绑定的id 是节点node.data的id，不是node的id ！！！！  -->
    <el-tree
      v-if="tongJiXinZeng"
      style="width: 200px"
      ref='tree'
      :props="props"
      :load="loadNode"
      lazy
      highlight-current
      @node-expand="expandNode"
      @node-collapse="collapseNode"
      @node-click="getChildren"
      :default-expanded-keys="defaultExpanded"	
      :expand-on-click-node="false"
      node-key="id"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
      draggable
      :allow-drop="allowDrop"
      :allow-drag="allowDrag">
    </el-tree>
    
    <!-- 操作对话框 -->
    <el-dialog
      :title="keyWord"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-input type="text" v-model="value"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveValue">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 右侧页面 -->
    <!-- <div>用储存的当前点击的node对象的属性字段来发送请求刷新页面</div> -->
  </div>
</template>
<script>
  export default {
    data() {
      return {
        props: {
          label: 'label', // 判断父节点
          children: 'children', // 判断子节点
          isLeaf: 'leaf' // 判断是否为叶子节点
        },
        dialogVisible: false, // 对话框显示布尔值
        keyWord: '', // 储存keyWord, 判断对话框操作类型
        value: '', // 对话框input绑定值
        node: undefined, // 储存当前节点的node对象
        tongJiXinZeng: true,
        defaultExpanded: [], // 默认展开的节点
        firstData: [{ label: 'aaa', parent: 0, id: 1 }], // 第一层假数据
        secondData: [
          { // 第二层假数据
            label: 'leaf',
            id: 2,
            parent: 1,
            leaf: true
          }, {
            id: 3,
            parent: 1,
            label: 'zone'
          }
        ],
        thirdData: []
      }
    },
    created() {
    },
    methods: {
      // tree懒加载
      loadNode(node, resolve) {
        // tree第一层
        if (node.level === 0) {
          return resolve(this.firstData);
        }

        // // 大于第二层 返回空
        if (node.level > 1) return resolve([])

        // 动态获取node中 data 的id 发送请求 获取下一层数据
        if (node.level === 1) {
          // const id = node.data.id
          // getData(id).then(res => {
          //   if (res.success) {
          //     resolve(res.data)
          //   }
          // }).catch(err => console.log(err))
          resolve(this.secondData)
        }
      },
      // 点击节点的回调
      getChildren(data) {
        // 因为要新增同级节点，储存node方便获取父级的id
        this.node = this.$refs.tree.getNode(data.id)
        // 储存data对zi象， 右侧页面刷新数据的接口在此处调用
        console.log(data)
        console.log(this.node)
      },
      // 节点展开的回调
      expandNode(data, node) {
        if (node.childNodes.length !== 0) {
          this.defaultExpanded.push(data.id)
        }
        console.log(data.id)
        console.log(node)
        console.log(this.defaultExpanded)
      },
      // 节点关闭时的回调
      collapseNode(data, node, key) {
        const index = this.defaultExpanded.findIndex(item => item === data.id)
        this.defaultExpanded.splice(index, 1)
        console.log(index)
        console.log(data.id)
        console.log(this.defaultExpanded)
      },
      // tree节点操作
      actionTree(keyWord) {
        // 储存keyWord 方便对话框判断操作类型

        this.keyWord = keyWord
        // 调用getCurrentKey() 获取当前点击的节点 若没有返回null
        const node = this.$refs.tree.getCurrentKey()
        if (!node) {
          return this.$message.error('请选择节点！！')
        }
        
        const flag = this.firstData.some(item => item.id === this.node.data.id)

        switch (this.keyWord) {
          // 删除
          case 'delete':
            this.$confirm('确认删除此节点?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$refs.tree.remove(this.node)
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });          
            });
            break
          // 上移
          case 'moveUp':
            this.nodeMove(flag, 'up')
            break
          // 下移
          case 'moveDown':
            this.nodeMove(flag, 'down')
            break
          default:
            this.dialogVisible = true
            break;
        }
      },
      // 对话框确定保存操作
      saveValue() {
        if (this.value === '') return this.$message.error('请输入')
        console.log(this.keyWord)
        const flag = this.firstData.some(item => item.id === this.node.data.id)
        switch (this.keyWord) {
          // 新增子节点
          case 'addchildren':
            this.secondData.push({
              id: 4,
              parent: this.node.data.id,
              label: this.value
            })
            // 赋值当前节点node的id
            const key = this.node.data.id
            console.log(key, this.secondData)
            this.$refs.tree.updateKeyChildren(key, this.secondData)
            break;
          // 新增同级节点
          case 'add':
            const data = {
              id: 9,
              label: this.value
            }

            if (flag) {
              console.log('此节点为根节点')
              // 通过刷新tree组件实现根节点新增同级节点，缺点已经展开的节点全都消失了 
              // 解决：通过记录节点展开的key值，再刷新tree组件设置默认展开
              this.tongJiXinZeng = false
              this.firstData.push(data)
              setTimeout(() => {
                this.tongJiXinZeng = true
              })
            } else {
              let dataArr = []
              this.node.parent.childNodes.forEach(item => {
                dataArr.push(item.data)
              })
              dataArr.push(data)
              const key = this.node.parent.data.id
              this.$refs.tree.updateKeyChildren(key, dataArr)
            }
            break
          // 重命名
          case 'resetName':
            // 思路，通过保存这一层的数据，更新当前节点的名字，调用组件方法刷新节点。 同时要注意根节点的bug，使用和新增同级节点一样的方法刷新tree组件

            if (flag) {
              this.tongJiXinZeng = false
              this.firstData.forEach(item => {
                if (item.id === this.node.data.id) {
                  item.label = this.value
                }
              })
              setTimeout(() => {
                this.tongJiXinZeng = true
              })
            } else {
              let dataArr = []
              this.node.parent.childNodes.forEach(item => {
                if (item.data.id === this.node.data.id) {
                  item.data.label = this.value
                }
                dataArr.push(item.data)
              })
              const key = this.node.parent.data.id
              this.$refs.tree.updateKeyChildren(key, dataArr)
            }
            break
        }
        this.dialogVisible = false
        
        // 保留组件选中的节点
        this.$refs.tree.setCurrentKey(this.node.data.id)
      },
      // 节点移动
      nodeMove(flag, style) {
        const id = this.node.data.id
        let index 
        if (style === 'up') index = -1
        else index = 1

        // 判断是否为根节点
        if (flag) {
          this.tongJiXinZeng = false
          this.firstData.forEach((dataItem, dataIndex) => {
            if (dataItem.id === id) {
              const data = this.firstData[dataIndex + index]
              this.firstData[dataIndex + index] = dataItem
              this.firstData[dataIndex] = data
            }
          })
          setTimeout(() => {
            this.tongJiXinZeng = true
          })
        } else {
          let dataArr = []
          this.node.parent.childNodes.forEach(item => {
            dataArr.push(item.data)
          })
          let infiniteFlag = true
          dataArr.forEach((dataItem, dataIndex) => {
            if (dataItem.id === id && infiniteFlag) {
              const data = dataArr[dataIndex + index]
              dataArr[dataIndex + index] = dataItem
              dataArr[dataIndex] = data
              infiniteFlag = false
            }
          })
          const key = this.node.parent.data.id
          console.log(key)
          console.log(dataArr)
          this.$refs.tree.updateKeyChildren(key, dataArr)
        }
        
        // 保留组件选中的节点
        this.$refs.tree.setCurrentKey(id)
      },
      // 关闭对话框
      handleClose() {
        this.value = ''
        this.dialogVisible = false
      },
      // 拖拽功能看似使用及其简单
      // 节点开始拖拽时触发的事件
      handleDragStart(node, ev) {
        // this.node = node
        // 储存拖拽的节点，以便发送请求
        console.log('drag start', node);
      },
      // 拖拽进入其他节点时触发的事件
      handleDragEnter(draggingNode, dropNode, ev) {
        // draggingNode拖拽的节点 dropNode 被拖进的节点
        // 在此发请求相当于 同层数据删除拖拽的节点 被拖进的节点的子节点新增拖拽的那个节点
        console.log('tree drag enter: ', dropNode.label);
      },
      // 拖拽离开某个节点时触发的事件
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label);
      },
      // 在拖拽节点时触发的事件（类似浏览器的 mouseover 事件）
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label);
      },
      // 拖拽结束时（可能未成功）触发的事件
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      // 拖拽成功完成时触发的事件
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType);
      },
      // 拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner';
        } else {
          return true;
        }
      },
      // 判断节点能否被拖拽
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
      }
    }
  }
</script>
<style scoped>
.box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn_group {
  margin: 50px 0;
}
</style>