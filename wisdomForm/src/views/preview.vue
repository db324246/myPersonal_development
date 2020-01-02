<template>
  <div class='page_container'>
    <div class="buttons">
      <el-button @click="previewDialog('open')" type="primary">预览</el-button>
      <el-button @click="previewDialog('close')" type="primary">关闭预览</el-button>
      <el-button @click="consoleLog" type="primary">输出</el-button>
      <el-button @click="goback" type="warning">桌面</el-button>
    </div>
    <wisdom-form-report
      ref="wisdomFormPP"
     :visibleFlag="visibleFlag"
     :propsList="propsList"
     v-model="formList"
     @getFormData="getFormData">
      <!-- <template v-slot:image>
        <div class="validateImage">
          <i>123475</i>
        </div>          
      </template> -->
      <template v-slot:button>
        <div>
          <el-button type="primary">发送验证码</el-button>
        </div>
      </template>
    </wisdom-form-report>
  </div>
</template>

<script>
import WisdomFormReport from '@/views/wisdomForm/WisdomFormReport'
export default {
  components: {
    WisdomFormReport
  },
  data() {
    return{
      formList: [],
      // 'userName', 'nickName', 'phoneNumber', 'email', 'Idcard', 'password', 'verification', 'describe'
      propsList: ['userName', 'nickName', 'phoneNumber', 'verification'],
      visibleFlag: false
    }
  },
  created() {
  },
  methods: {
    previewDialog(style) {
      if (style === 'open') {
        this.formList = JSON.parse(localStorage.getItem('formData')) || []
        this.visibleFlag = true
      } else {
        this.visibleFlag = false
      }
    },
    getFormData(val) {
      console.log(val)
    },
    consoleLog() {
      this.$refs.wisdomFormPP.returnFormData()
    },
    goback() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang='scss' scoped>
.buttons {
  text-align: center;
  margin-bottom: 40px;
}
.validateImage {
  width: 100px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  font-size: 16px;
  color: #fff;
  border-radius: 2px;
  background-color: blueviolet;
}
</style>