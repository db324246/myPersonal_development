<template>
  <div v-if="visibleFlag" class='wisdomform_container'>
    <el-form ref="wisdomform" :model="wisdomform" class="wisdomform_content-container" label-width="120px">
      <el-form-item :key="wisdomformItem.key"
        v-for="(wisdomformItem, wisdomformIndex) in wisdomform.itemList"
        :style="{'padding-right': wisdomformItem.paddingRight + 'px'}"
        :label="wisdomformItem.label"
        :rules="wisdomformItem.rules"
        :prop="'itemList.' + wisdomformIndex + '.value'">

          <!-- userName -->
          <el-input v-if="wisdomformItem.type === 0" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
          @keyup.enter="cancelInputDefault"
          v-model="wisdomformItem.value">
          </el-input>

          <!-- nickName -->
          <el-input v-if="wisdomformItem.type === 1" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
          @keyup.enter="cancelInputDefault"
          v-model="wisdomformItem.value">
          </el-input>

          <!-- phoneNumber -->
          <el-input type="tel" v-if="wisdomformItem.type === 2" class="numberInput" :placeholder="wisdomformItem.placeholder"
          @keyup.enter="cancelInputDefault" v-model="wisdomformItem.value">
          </el-input>

          <!-- email -->
          <el-input v-if="wisdomformItem.type === 3" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
          @keyup.enter="cancelInputDefault"
          v-model="wisdomformItem.value">
          </el-input>

          <!-- Idcard -->
          <el-input type="number" v-if="wisdomformItem.type === 4" class="numberInput" :placeholder="wisdomformItem.placeholder" 
          @keyup.enter="cancelInputDefault"
          v-model.number="wisdomformItem.value">
          </el-input>

          <!-- password -->
          <el-input v-if="wisdomformItem.type === 5" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
          @keyup.enter="cancelInputDefault"
          v-model="wisdomformItem.value">
          </el-input>

          <!-- textArea -->
          <el-input v-if="wisdomformItem.type === 6" type="textarea" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
          v-model="wisdomformItem.value">
          </el-input>

          <!-- personal -->
          <el-input v-if="wisdomformItem.type === 7 && wisdomformItem.inputType === 'text'" type="text" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
            v-model="wisdomformItem.value">
          </el-input>
          <el-input v-else-if="wisdomformItem.type === 7 && wisdomformItem.inputType === 'textarea'" type="textarea" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
          v-model="wisdomformItem.value">
          </el-input>
          <el-input v-else-if="wisdomformItem.type === 7 && wisdomformItem.inputType === 'number'" type="number" class="numberInput" :placeholder="wisdomformItem.placeholder" v-model.number="wisdomformItem.value">
          </el-input>

          <!-- radio -->
          <template v-if="wisdomformItem.type === 8">
            <el-radio :key="optionIndex" 
            v-for="(optionItem, optionIndex) in wisdomformItem.optionList" v-model="wisdomformItem.value" :label="optionItem.value">{{optionItem.label}}</el-radio>
          </template>

          <!-- checkBox -->
          <el-checkbox-group v-if="wisdomformItem.type === 9" v-model="wisdomformItem.value">
            <el-checkbox :key="optionIndex" v-for="(optionItem, optionIndex) in wisdomformItem.optionList" :label="optionItem.value">{{optionItem.label}}</el-checkbox>
          </el-checkbox-group>

          <!-- select -->
          <el-select v-if="wisdomformItem.type === 10" v-model="wisdomformItem.value" clearable placeholder="请选择">
            <el-option
              v-for="(optionItem, optionIndex) in wisdomformItem.optionList"
              :key="optionIndex"
              :label="optionItem.label"
              :value="optionItem.value">
            </el-option>
          </el-select>

          <!-- selectMultiple -->
          <el-select v-if="wisdomformItem.type === 11" v-model="wisdomformItem.value" clearable multiple placeholder="请选择">
            <el-option
              v-for="(optionItem, optionIndex) in wisdomformItem.optionList"
              :key="optionIndex"
              :label="optionItem.label"
              :value="optionItem.value">
            </el-option>
          </el-select>

          <!-- describe -->
          <el-input v-if="wisdomformItem.type === 12" type="textarea" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
          v-model="wisdomformItem.value">
          </el-input>

          <!-- verification -->
          <template v-if="wisdomformItem.type === 13">
            <el-input :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder"
            @keyup.enter="cancelInputDefault"
            v-model="wisdomformItem.value">
            </el-input>
            <div class="verification_slot-box" :style="{'width': wisdomformItem.paddingRight + 'px', 'right' : wisdomformItem.paddingRight * (-1) - 10 + 'px'}">
              <slot name="image"></slot>
              <slot name="button"></slot>
              <!-- <slot>
                <div class="defaultImageBox"></div>
              </slot> -->
            </div>
          </template>

      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import quicklyFormItem from './quicklyFormItem'
import formRulesList from './formRulesList'
export default {
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    propsList: {
      type: Array,
      default() {
        return []
      }
    },
    visibleFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return{
      wisdomform: {
        itemList: []
      },
      propFormList: []
    }
  },
  watch: {
    visibleFlag: {
      handler(val) {
        if (val) this.formInit()
        else this.formReset()
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    formInit() {
      if (this.propsList.length !== 0) {
        this.propsList.forEach(item => {
          const formData = this.deepClone(quicklyFormItem[item])
          formData.rules = this.deepClone(formRulesList[item])
          this.propFormList.push(formData)
        })
        const formArr = this.propFormList.concat(this.value)
        this.$set(this.wisdomform, 'itemList', formArr)
      } else {
        this.$set(this.wisdomform, 'itemList', this.value)
      }
    },
    formReset() {
      this.propFormList = []
      this.$set(this.wisdomform, 'itemList', [])
    },
    returnFormData() {
      this.$refs.wisdomform.validate(valide => {
        if (valide) {
          const formData = this.selectFormData()
          this.$emit('getFormData', formData)
        }
      })
    },
    selectFormData() {
      const formData = {}
      this.wisdomform.itemList.forEach(item => {
        formData[item.prop] = item.value
      })
      return formData
    },
    cancelInputDefault() {
      return false
    },
    deepClone(obj) {
      let newObj = Array.isArray(obj) ? [] : {}

      if (obj&&typeof obj ==="object") {
          for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                  newObj[key] = (obj && typeof obj[key] === 'object') ? this.deepClone(obj[key]) : obj[key]
              }
          }
      }
      return newObj
    }
  }
}
</script>

<style lang='scss' scoped>
.numberInput {
  width: 100%;
  height: 40px;
  border-radius: 4px;
  color: #606266;
  /deep/.el-input__inner {
    -webkit-box-sizing: border-box;
    -moz-appearance: textfield;
    &::-webkit-input-placeholder{
        color:#c0c4cc;
    }
    &::-moz-placeholder{   /* Mozilla Firefox 19+ */
        color:#c0c4cc;
    }
    &:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
        color:#c0c4cc;
    }
    &:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
        color:#c0c4cc;
    }
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
  }
}
.wisdomform_content-container {
  max-width: 600px;
  margin: auto;
}
.wisdomform_centent-item {
  position: relative;
  padding: 10px;
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0;
  }
}
.verification_slot-box {
  position: absolute;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
}
.defaultImageBox {
  width: 100px;
  height: 38px;
  border-radius: 2px;
  background-color: #e0e0e0;
}
</style>
<style scoped>
.wisdomform_content-container>>>.el-form-item {
  position: relative;
}
</style>