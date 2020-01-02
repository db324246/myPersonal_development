import valide from './formValide'

export default {
  defaultRule: [
    { required: false, message: '请输入内容', trigger: 'blur' }
  ],
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号' },
    { validator: valide.phoneValide, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { validator: valide.emailValide, message: '请输入正确的邮箱', trigger: 'blur' }
  ],
  textArea: [
    { required: false, message: '请输入内容', trigger: 'blur' }
  ],
  describe: [
    { required: false, message: '请输入描述', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { validator: valide.passwordValide, message: '密码格式不正确', trigger: 'blur' }
  ],
  verification: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 1, max: 6, message: '验证码长度在 1 到 6 个字符', trigger: 'blur' }
  ],
  Idcard: [
    { required: true, message: '请输入身份证', trigger: 'blur' },
    { validator: valide.IDcardValide, message: '请输入正确的身份证', trigger: 'blur' }
  ],
  radio: [
    { required: false, message: '请选择', trigger: 'change' }
  ],
  checkBox: [
    { required: false, message: '请选择', trigger: 'change' }
  ],
  select: [
    { required: false, message: '请选择', trigger: 'change' }
  ]
}