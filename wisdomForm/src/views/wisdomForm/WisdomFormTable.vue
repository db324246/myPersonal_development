<template>
  <div class='wisdomform_controller-box'>
    <div class="hidden_box">
      <div class="usualform_quicklySet-list">
        <div class="wisdomform_quicklySet-item">
          <div class="wisdomform_quicklySet-title">
            <span>输入框：</span>
          </div>
          <div class="wisdomform_quicklySet-buttons">
            <el-button @click="quicklySet('userName')" size="mini">用户名</el-button>
            <el-button @click="quicklySet('nickName')" size="mini">昵称</el-button>
            <el-button @click="quicklySet('phoneNumber')" size="mini">手机号</el-button>
            <el-button @click="quicklySet('email')" size="mini">邮箱</el-button>
            <el-button @click="quicklySet('Idcard')" size="mini">身份证</el-button>
            <el-button @click="quicklySet('password')" size="mini">密码</el-button>
            <el-button @click="quicklySet('verification')" size="mini">验证码</el-button>
            <el-button @click="quicklySet('describe')" size="mini">文本域</el-button>
            <el-button @click="quicklySet('textArea')" size="mini">文本域</el-button>
            <el-button @click="quicklySet('personal')" size="mini">自定义</el-button>
          </div>
        </div>
        <div class="wisdomform_quicklySet-item">
          <div class="wisdomform_quicklySet-title">
            <span>选择器：</span>
          </div>
          <div class="wisdomform_quicklySet-buttons">
            <el-button @click="quicklySet('radio')" size="mini">单选按钮</el-button>
            <el-button @click="quicklySet('checkBox')" size="mini">多选按钮</el-button>
            <el-button @click="quicklySet('select')" size="mini">下拉单选</el-button>
            <el-button @click="quicklySet('selectMultiple')" size="mini">下拉多选</el-button>
            <!-- <el-button @click="quicklySet('timePicker')" size="mini">时间</el-button>
            <el-button @click="quicklySet('datePicker')" size="mini">日期</el-button>
            <el-button @click="quicklySet('dateTimePicker')" size="mini">时间日期</el-button> -->
          </div>
        </div>
      </div>
    </div>

    <div class="wisdomform_content-box">
      <div class="wisdomform_content-title">
        <span>wisdomform</span>
        <div>
          <el-button size="mini" type="danger" @click="resetFormList">clearFormList</el-button>
          <el-button size="mini" type="primary" @click="generateFormJson">saveForm</el-button>
        </div>
      </div>
      <div class="wisdomform_content-container" :style="{ 'height': height }">
        <el-scrollbar style="height: 100%;">
          <el-form ref="wisdomform" class="wisdomform_content-container" label-width="120px">
            <template v-for="(wisdomformItem, wisdomformIndex) in wisdomformList">
              <!-- userName -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 0" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}"
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- nickName -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 1" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- phoneNumber -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 2" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- email -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 3" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- Idcard -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 4" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- password -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 5" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- textArea -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 6" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input type="textarea" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- personal -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 7" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :type="wisdomformItem.inputType" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- radio -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 8" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-radio
                  :key="optionIndex"
                  v-for="(optionItem, optionIndex) in wisdomformItem.optionList"
                  v-model="wisdomformItem.value" :label="optionItem.value">{{optionItem.label}}</el-radio>
                </el-form-item>
              </div>

              <!-- checkBox -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 9" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-checkbox-group v-model="wisdomformItem.value">
                    <el-checkbox
                    :key="optionIndex"
                    v-for="(optionItem, optionIndex) in wisdomformItem.optionList"
                    :label="optionItem.value">
                      {{optionItem.label}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>

              <!-- select -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 10" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-select v-model="wisdomformItem.value" placeholder="请选择">
                    <el-option
                      :key="optionIndex"
                      v-for="(optionItem, optionIndex) in wisdomformItem.optionList"
                      :label="optionItem.label"
                      :value="optionItem.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <!-- selectMultiple -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 11" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-select multiple v-model="wisdomformItem.value" placeholder="请选择">
                    <el-option
                      :key="optionIndex"
                      v-for="(optionItem, optionIndex) in wisdomformItem.optionList"
                      :label="optionItem.label"
                      :value="optionItem.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <!-- describe -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 12" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}" 
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input type="textarea" :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

              <!-- verification -->
              <div :key="wisdomformIndex" v-if="wisdomformItem.type === 13" :class="['wisdomform_centent-item', wisdomformIndex + '-' + wisdomformItem.type === highlightIndex ? 'highlightBGC' : '']" @click="selectFormItemToUpdate(wisdomformItem, wisdomformIndex)" >
                <el-form-item 
                :style="{'padding-right': wisdomformItem.paddingRight + 'px'}"
                :label="wisdomformItem.label" 
                :required='wisdomformItem.required' :prop="wisdomformItem.prop">
                  <el-input :maxlength="wisdomformItem.maxlength" :placeholder="wisdomformItem.placeholder" disabled></el-input>
                </el-form-item>
              </div>

            </template>
          </el-form>
        </el-scrollbar>
      </div>
    </div>

    <div class="hidden_box">
      <div class="wisdomform_config-box">
        <div class="wisdomform_config-Setting">
          <div class="wisdomform_config-title">
            Settings
          </div>
          <el-form ref="formItemSetting" :model="formItemSetting" label-width="120px">
            <el-form-item label="label：">
              <el-input v-model="formItemSetting.label"></el-input>
            </el-form-item>
            <el-form-item v-if="formItemSetting.type === 7" label="prop：">
              <el-input v-model="formItemSetting.prop"></el-input>
            </el-form-item>
            <el-form-item v-if="formItemSetting.placeholder !== undefined"  label="placeholder：">
              <el-input v-model="formItemSetting.placeholder"></el-input>
            </el-form-item>
            <el-form-item v-if="formItemSetting.inputType !== undefined" label="inputType：">
              <el-radio v-model="formItemSetting.inputType" label="text">text</el-radio>
              <el-radio v-model="formItemSetting.inputType" label="number">number</el-radio>
              <el-radio v-model="formItemSetting.inputType" label="textarea">textarea</el-radio>
            </el-form-item>
            <el-form-item v-if="formItemSetting.maxlength !== undefined" label="maxlength：">
              <input type="number" class="numberInput" min="2" v-model.number="formItemSetting.maxlength" />
            </el-form-item>
            <el-form-item v-if="formItemSetting.paddingRight !== undefined" label="paddingRight：">
              <input type="number" class="numberInput" min="0" v-model.number="formItemSetting.paddingRight" />
            </el-form-item>
          </el-form>
          <div class="setting_config-optionList"
          :style="{ 'height': formItemSetting.optionList.length <= 3 ? 70 + 100 * formItemSetting.optionList.length + 'px' : '365px'}" v-if="formItemSetting.optionList !== undefined">
            <el-scrollbar style="height: 100%;">
              <div class="optionList-title">
                <span>选项列表</span>
                <el-button type="primary" @click="addOptionItem" size="mini">add</el-button>
              </div>
              <div class="optionList-default_value">
                <span>默认选项：</span>
                <el-select v-model="formItemSetting.value" :multiple="formItemSetting.type === 11 || formItemSetting.type === 9" clearable size="mini" value-key="value" placeholder="可选择默认选项">
                  <el-option
                    v-for="item in formItemSetting.optionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="optionList-item" :key="index" v-for="(item, index) in formItemSetting.optionList">
                <div class="optionList_item-title">
                  <span>{{'选项' + optionNumebr[index] + '：'}}</span>
                  <i @click="deleteOptionItem(index)" class="el-icon-delete"></i>
                </div>
                <div class="optionList_item-item">
                  <span>label：</span>
                  <el-input size="small" v-model="item.label"></el-input>
                </div>
                <div class="optionList_item-item">
                  <span>value：</span>
                  <el-input size="small" v-model="item.value"></el-input>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div v-if="formRulesMatch.valide" class="wisdomform_config-Rules">
          <div class="wisdomform_config-title">
            Rules
          </div>
          <el-form ref="formRulesMatch" :model="formRulesMatch" label-width="120px">
            <el-form-item label="required：">
              <el-switch v-model="formRulesMatch.required"></el-switch>
            </el-form-item>
            <el-form-item label="required-msg：">
              <el-input v-model="formRulesMatch.requiredMsg"></el-input>
            </el-form-item>
            <el-form-item v-if="formRulesMatch.min !== undefined" label="min：">
              <el-input-number size="mini" :min="1" v-model="formRulesMatch.min">
              </el-input-number>
            </el-form-item>
            <el-form-item v-if="formRulesMatch.max !== undefined" label="max：">
              <el-input-number size="mini" :min="2" v-model="formRulesMatch.max">
              </el-input-number>
            </el-form-item>
            <el-form-item v-if="formRulesMatch.valideMsg !== undefined" label="valide-msg：">
              <el-input v-model="formRulesMatch.valideMsg"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="wisdomform_config-Control">
          <div class="wisdomform_config-title">
            Control
          </div>
          <div class="wisdomform_config-buttons">
            <el-button @click="formItemControl('moveUp')" icon="el-icon-top" size="mini">moveUp</el-button>
            <el-button @click="formItemControl('moveDown')" icon="el-icon-bottom" size="mini">moveDown</el-button>
            <el-button @click="formItemControl('deleteItem')" icon="el-icon-delete" size="mini" type="danger">deleteItem</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quicklyFormItem from './quicklyFormItem'
import formRulesList from './formRulesList'
export default {
  name: 'WisdomFormTable',
  props: {
    height: {
      type: String,
      default: '740px'
    }
  },
  data() {
    return{
      wisdomform: {},
      wisdomformList: [],
      wisdomformRulesList: [],
      formItemSetting: {
        index: undefined,
        key: undefined,
        type: undefined,
        label: undefined,
        prop: undefined,
        // required: false,
        placeholder: undefined,
        inputType: undefined,
        maxlength: undefined,
        paddingRight: 0,
        value: undefined,
        optionList: undefined
      },
      formRulesMatch: {
        valide: true,
        key: undefined,
        required: false,
        requiredMsg: undefined,
        valideMsg: undefined,
        min: undefined,
        max: undefined
      },
      chooseItemFlag: false,
      highlightIndex: undefined,
      randomLetter: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
      optionNumebr: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十']
    }
  },
  watch: {
    formItemSetting: {
      handler(newVal, oldVal) {
        this.UpdatedWisdomFormItem()
      },
      deep: true
    },
    formRulesMatch: {
      handler(newVal, oldVal) {
        this.UpdatedFormItemRules()
      },
      deep: true
    }
  },
  created() {

  },
  methods: {
    quicklySet(keyWord) {
      const formItemData = this.deepClone(quicklyFormItem[keyWord])
      const length = this.wisdomformList.length

      const _this = this

      matchformItem()
      matchformItemRule()
    
      function matchformItemRule() {
        const rules = formRulesList[keyWord] || formRulesList.defaultRule
        const itemRuleData = {
          key: length,
          rules: rules
        }
        _this.wisdomformRulesList.push(itemRuleData)
        _this.formRulesMatch.key = itemRuleData.key

        if (rules.length === 0) {
          _this.formRulesMatch = {
            valide: false,
            key: undefined,
            required: false,
            requiredMsg: undefined,
            valideMsg: undefined,
            min: undefined,
            max: undefined
          }
        } else {
          _this.formRulesMatch.valide = true
          _this.formRulesMatch.requiredMsg = rules[0].message
          _this.formRulesMatch.required = rules[0].required

          if (rules.length === 2) {
            if (rules[1].validator === undefined) {
              _this.formRulesMatch.min = rules[1].min
              _this.formRulesMatch.max = rules[1].max
            } else {
              _this.formRulesMatch.min = undefined
              _this.formRulesMatch.max = undefined
            }
            _this.formRulesMatch.valideMsg = rules[1].message
          } else {
            _this.formRulesMatch.min = undefined
            _this.formRulesMatch.max = undefined
            _this.formRulesMatch.valideMsg = undefined
          }
        }
      }

      function matchformItem() {
        formItemData.index = length
        formItemData.key = length

        if (formItemData.type === 7) {
          const length = _this.wisdomformList.filter(item => item.type === 7).length
          formItemData.prop += _this.randomLetter[length]
        }

        if (!_this.chooseItemFlag) {
          _this.highlightIndex = formItemData.index + '-' + formItemData.type
          _this.formItemSetting = _this.deepClone(formItemData)
        }

        _this.wisdomformList.push(formItemData)
      }
    },
    addOptionItem() {
      const length = this.formItemSetting.optionList.length
      const option = {
        label: undefined,
        value: undefined
      }
      if (length !== 0) {
        const value = this.formItemSetting.optionList[length - 1].value
        option.label = '选项' + this.optionNumebr[value]
        option.value = value + 1
      } else {
        option.label = '选项' + this.optionNumebr[length]
        option.value = length
      }

      this.formItemSetting.optionList.push(option)
    },
    deleteOptionItem(index) {
      this.formItemSetting.optionList.splice(index, 1)
    },
    UpdatedWisdomFormItem() {
      this.wisdomformList.forEach((item, index) => {
        if (item.key === this.formItemSetting.key) {
          this.wisdomformList[index] = Object.assign({}, item, this.formItemSetting)
        }
      })
    },
    UpdatedFormItemRules() {
      this.wisdomformRulesList.forEach((item, index) => {
        if (item.key === this.formRulesMatch.key) {
          if (item.rules.length !== 0) {
            this.wisdomformRulesList[index].rules[0].message = this.formRulesMatch.requiredMsg
            if (item.rules.length === 2) {
              this.wisdomformRulesList[index].rules[1].message = this.formRulesMatch.valideMsg
              if (item.rules[1].validator === undefined) {
                this.wisdomformRulesList[index].rules[1].min = this.formRulesMatch.min
                this.wisdomformRulesList[index].rules[1].max = this.formRulesMatch.max
              }
            }
          }
        }
      })
      this.wisdomformList.forEach((item, index) => {
        if (item.key === this.formRulesMatch.key) {
          this.wisdomformList[index].required = this.formRulesMatch.required
        }
      })
    },
    selectFormItemToUpdate(wisdomformItem, wisdomformIndex) {
      this.formItemSetting = this.deepClone(wisdomformItem)

      const rulesData = this.wisdomformRulesList.filter(item =>  item.key === this.formItemSetting.key)[0]
      this.formRulesMatch.key = this.formItemSetting.key

      if (rulesData.rules.length === 0) {
        this.formRulesMatch.valide = false
        this.formRulesMatch.required = false
        this.formRulesMatch.requiredMsg = undefined
        this.formRulesMatch.valideMsg = undefined
        this.formRulesMatch.min = undefined
        this.formRulesMatch.max = undefined
      } else {
        this.formRulesMatch.valide = true
        this.formRulesMatch.requiredMsg = rulesData.rules[0].message
        this.formRulesMatch.required = rulesData.rules[0].required

        if (rulesData.rules.length === 2) {
          if (rulesData.rules[1].validator === undefined) {
            this.formRulesMatch.min = rulesData.rules[1].min
            this.formRulesMatch.max = rulesData.rules[1].max
          } else {
            this.formRulesMatch.min = undefined
            this.formRulesMatch.max = undefined
          }
          
          this.formRulesMatch.valideMsg = rulesData.rules[1].message
        } else {
          this.formRulesMatch.min = undefined
          this.formRulesMatch.max = undefined
          this.formRulesMatch.valideMsg = undefined
        }
      }

      this.highlightIndex = wisdomformIndex + '-' + wisdomformItem.type
      this.chooseItemFlag = true
    },
    formItemControl(type) {
      const index = this.formItemSetting.index
      const key = this.formItemSetting.key
      const length = this.wisdomformList.length
      switch (type) {
        case 'moveUp':
          if (index === 0) break
          this.wisdomformList.splice(index, 1,...this.wisdomformList.splice(index - 1, 1 , this.wisdomformList[index]))
          this.highlightIndex = (index - 1) + '-' + this.highlightIndex.split('-')[1]
          break
        case 'moveDown':
          if (index === length - 1) break
          this.wisdomformList.splice(index + 1,1,...this.wisdomformList.splice(index, 1 , this.wisdomformList[index + 1]))
          this.highlightIndex = (index + 1) + '-' + this.highlightIndex.split('-')[1]
          break
        case 'deleteItem':
          this.wisdomformList.splice(index, 1)
          const ruleIndex = this.wisdomformRulesList.findIndex(item => item.key === key)
          this.wisdomformRulesList.splice(ruleIndex, 1)
          if (index === length - 1) this.highlightIndex = undefined
          else this.highlightIndex = index + '-' + this.wisdomformList[index].type
          this.chooseItemFlag = false
          this.resetFormItemConfig()
          break
      }
      
      this.resetWisdomFormIndex()
    },
    generateFormJson() {
      const wisdomform = this.deepClone(this.wisdomformList)
      wisdomform.forEach((formItem, formIndex) => {
        this.wisdomformRulesList.forEach(ruleItem => {
          if (formItem.key === ruleItem.key) {
            wisdomform[formIndex].rules = ruleItem.rules
            if (ruleItem.rules.length !== 0) {
              wisdomform[formIndex].rules[0].required = formItem.required
            }
          } 
        })
        delete wisdomform[formIndex].required
      })
      this.$emit("getFormJson", wisdomform)
    },
    resetFormItemConfig() {
      if (this.highlightIndex !== undefined) {
        const index = this.highlightIndex.split('-')[0]
        const key = this.wisdomformList[index].key
        this.formItemSetting = this.deepClone(this.wisdomformList[index])
        this.formRulesMatch = this.deepClone(this.wisdomformRulesList.filter(item => item.key === key)[0])
      } else {
        this.formItemSetting = {
          index: undefined,
          key: undefined,
          type: undefined,
          label: undefined,
          prop: undefined,
          placeholder: undefined,
          maxlength: undefined,
          paddingRight: 0,
          value: undefined,
          optionList: undefined
        }
        this.formRulesMatch = {
          valide: true,
          key: undefined,
          required: false,
          requiredMsg: undefined,
          valideMsg: undefined,
          min: undefined,
          max: undefined
        }
      }
    },
    resetFormList() {
      this.$confirm('确认清空表单列表?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.wisdomformList.splice(0)
        this.wisdomformRulesList.splice(0)
        this.highlightIndex = undefined
        this.resetFormItemConfig()
        this.$message.success('已成功清空')
      }).catch(() => {
        this.$message.info('已取消清空')
      })
    },
    resetWisdomFormIndex() {
      this.wisdomformList.forEach((formItem, formIndex) => {
        this.wisdomformList[formIndex].index = formIndex
        if (formItem.key === this.formItemSetting.key) {
          this.formItemSetting.index = formIndex
        }
      })
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

<style lang="scss" scoped>
.wisdomform_controller-box {
  display: flex;
  justify-content: center;
}
.usualform_quicklySet-list {
  width: 310px;
  height: 300px;
  padding: 20px;
  margin-right: 20px;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .wisdomform_quicklySet-item {
    display: flex;
    margin-bottom: 15px;
    .wisdomform_quicklySet-title {
      width: 68px;
      padding-top: 2px;
    }
    .wisdomform_quicklySet-buttons {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .el-button {
        margin: 0;
        margin-right: 10px;
        margin-bottom: 15px;
      }
    }
  }
}
.wisdomform_content-box {
  width: 600px;
  padding: 10px 0;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .wisdomform_content-title {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    padding: 0 10px;
    margin: 0 20px;
    margin-bottom: 20px;
    font-size: 22px;
    border-bottom: 1px solid #eee;
  }
  .wisdomform_centent-item {
    position: relative;
    padding: 10px;
    margin: 0 20px;
    margin-bottom: 10px;
    border: 1px dashed #dad3d3;
    border-radius: 5px;
    &:hover {
      background-color: #f7f7f7;
    }
    .el-form-item {
      margin-bottom: 0;
      .el-select {
        width: 100%;
      }
      &::after {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        cursor: pointer;
        z-index: 3000;
      }
    }
  }
  .highlightBGC {
    background-color: #f7f7f7;
  }
}
.wisdomform_config-box {
  width: 400px;
  margin-left: 20px;
  padding: 10px 20px 40px;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  .wisdomform_config-Control,
  .wisdomform_config-Rules,
  .wisdomform_config-Setting {
    text-align: left;
    margin-bottom: 30px;
    .wisdomform_config-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      margin-bottom: 20px;
      font-size: 22px;
      border-bottom: 1px solid #eee;
    }
    .numberInput {
      width: 100%;
      height: 40px;
      padding: 0 15px;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      -webkit-box-sizing: border-box;
      color: #606266;
      -moz-appearance: textfield;
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
          -webkit-appearance: none;
      }
    }
    .setting_config-optionList {
      font-size: 14px;
      // height: 365px;
      // max-height: 365px;
      .optionList-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px 10px 30px
      }
      .optionList-default_value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
        padding: 0 75px 0 32px;
        span {
          width: 100px;
        }
      }
      .optionList-item {
        padding: 0 45px;
        margin-bottom: 5px;
        .optionList_item-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
          i {
            cursor: pointer;
            &:hover {
              color: #F56C6C;
            }
          }
        }
        .optionList_item-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30px;
          margin-bottom: 5px;
          span {
            width: 75px;
            text-align: right;
          }
          // /deep/.el-input__inner {
          //   height: 30px;
          //   line-height: 30px;
          // }
        }
      }
    }
  }
}
</style>
<style scoped>
.el-scrollbar>>>.el-scrollbar__wrap {
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>