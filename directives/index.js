// import Vue from 'Vue'
import dlDrag from '@/directives/dlDrag.js'
import dlCopy from '@/directives/dlCopy.js'

export default {
  install: (Vue, Options) => {
    Vue.directive('dlDrag', dlDrag)
    Vue.directive('dlCopy', dlCopy)
  }
}