<template>
  <div :class="computedCheckboxClass" @click.stop="handlerClick">
  </div>
</template>

<script>
export default {
  name: 'dl-checkbox',
  componentName: 'dl-checkbox',
  props: {
    value: {
      type: String,
      default: 'false'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    computedCheckboxClass() {
      let className = 'dl-checkbox'
      if (this.disabled) className += ' disabled'
      else className += ' normal'
      if (this.value === 'true') className += ' isChecked'
      else if (this.value === 'indeterminate') className += ' isIndeterminate'
      return className
    }
  },
  methods: {
    handlerClick() {
      if (this.disabled) return
      const value = this.value === 'true' ? 'false' : 'true'
      this.$emit('input', value)
    }
  }
}
</script>

<style scoped>
.dl-checkbox {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  box-sizing: border-box;
  width: 14px;
  height: 14px;
  margin-right: 5px;
  background-color: #fff;
  z-index: 1;
  transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46)
}
.normal:hover {
  border-color: #409eff;
}
.isChecked {
  background-color: #409eff;
  border-color: #409eff;
}
.isChecked::after {
  box-sizing: content-box;
  content: "";
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  height: 7px;
  left: 4px;
  position: absolute;
  top: 1px;
  transform: rotate(45deg) scaleY(0);
  width: 3px;
  transition: transform .15s ease-in .05s;
  transform-origin: center;
  transform: rotate(45deg) scaleY(1);
}
.isIndeterminate {
  background-color: #409eff;
  border-color: #409eff;
}
.isIndeterminate::after {
  content: "";
  position: absolute;
  display: block;
  background-color: #fff;
  height: 2px;
  transform: scale(.5);
  left: 0;
  right: 0;
  top: 5px;
}
.disabled {
  background-color: #f2f6fc;
  border-color: #dcdfe6;
  cursor: not-allowed;
}
</style>