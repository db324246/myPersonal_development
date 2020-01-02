<template>
  <div class='page_container'>
    <div class="header">
      <router-link to="/preview">预览</router-link> &gt;&gt;
    </div>
    <wisdom-form-table
      height="740px"
      @getFormJson="getFormJson">
    </wisdom-form-table>
  </div>
</template>

<script>
import WisdomFormTable from '@/views/wisdomForm/WisdomFormTable.vue'
export default {
  components: {
    WisdomFormTable
  },
  data() {
    return{

    }
  },
  created() {

  },
  methods: {
    getFormJson(val) {
      localStorage.setItem('formData', JSON.stringify(wisdomform))
      this.$message.success('保存成功')
      this.$router.push('/preview')
    }
  }
}
</script>

<style lang='scss' scoped>
.header {
  padding-left: 40px;
  margin-bottom: 20px;
}
</style>