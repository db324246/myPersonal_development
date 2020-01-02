export default {
  userName: {
    type: 0,
    label: '用户名',
    prop: 'userName',
    inputType: undefined,
    // required: true,
    placeholder: '请输入用户名',
    maxlength: 30,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  nickName: {
    type: 1,
    label: '昵称',
    prop: 'nickName',
    inputType: undefined,
    // required: true,
    placeholder: '请输入昵称',
    maxlength: 30,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  phoneNumber: {
    type: 2,
    label: '手机号',
    prop: 'phoneNumber',
    inputType: undefined,
    // required: true,
    placeholder: '请输入手机号',
    maxlength: undefined,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  email: {
    type: 3,
    label: '邮箱',
    prop: 'email',
    inputType: undefined,
    // required: false,
    placeholder: '请输入邮箱',
    maxlength: undefined,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  Idcard: {
    type: 4,
    label: '身份证',
    prop: 'Idcard',
    inputType: undefined,
    // required: false,
    placeholder: '请输入身份证',
    maxlength: undefined,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  password: {
    type: 5,
    label: '密码',
    prop: 'password',
    inputType: undefined,
    // required: true,
    placeholder: '请输入密码',
    maxlength: undefined,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  textArea: {
    type: 6,
    label: '文本域',
    prop: 'textArea',
    inputType: undefined,
    // required: false,
    placeholder: '请输入',
    maxlength: 50,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  personal: {
    type: 7,
    label: '自定义',
    prop: 'personal',
    inputType: 'text',
    // required: false,
    placeholder: '请输入自定义内容',
    maxlength: 30,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  radio: {
    type: 8,
    label: '单选按钮',
    prop: 'radio',
    value: undefined,
    paddingRight: undefined,
    optionList: [
      { label: "选项一", value: 0 },
      { label: "选项二", value: 1 }
    ]
  },
  checkBox: {
    type: 9,
    label: '多选按钮',
    prop: 'checkBox',
    paddingRight: undefined,
    value: [],
    optionList: [
      { label: "选项一", value: 0 },
      { label: "选项二", value: 1 },
      { label: "选项三", value: 2 }
    ]
  },
  select: {
    type: 10,
    label: '下拉单选',
    prop: 'select',
    value: undefined,
    paddingRight: undefined,
    optionList: [
      { label: "选项一", value: 0 },
      { label: "选项二", value: 1 }
    ]
  },
  selectMultiple: {
    type: 11,
    label: '下拉多选',
    prop: 'selectMultiple',
    value: [],
    paddingRight: undefined,
    optionList: [
      { label: "选项一", value: 0 },
      { label: "选项二", value: 1 }
    ]
  },
  describe: {
    type: 12,
    label: '描述',
    prop: 'describe',
    inputType: undefined,
    // required: false,
    placeholder: '请输入',
    maxlength: 200,
    paddingRight: 0,
    value: undefined,
    optionList: undefined
  },
  verification: {
    type: 13,
    label: '验证码',
    prop: 'verification',
    inputType: undefined,
    // required: true,
    placeholder: '请输入验证码',
    maxlength: 6,
    paddingRight: 120,
    value: undefined,
    optionList: undefined
  },
  timePicker: {
    type: 14,
    label: '时间',
    prop: 'timePicker',
    value: undefined,
    pickerOptions: {
      start: '',
      end: '',
      step: ''
    }
  },
  datePicker: {
    type: 15,
    label: '单选按钮',
    prop: 'radio',
    inputType: undefined,
    // required: false,
    placeholder: undefined,
    maxlength: undefined,
    paddingRight: undefined,
    value: undefined,
    optionList: undefined
  },
  dateTimePicker: {
    type: 16,
    label: '单选按钮',
    prop: 'radio',
    inputType: undefined,
    // required: false,
    placeholder: undefined,
    maxlength: undefined,
    paddingRight: undefined,
    value: undefined,
    optionList: undefined
  }
}