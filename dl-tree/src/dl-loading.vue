<template>
  <div class='dl-loading'>
    <canvas v-if="value" class="canvasLoad" :id="'canvasLoad' + loadKey" width='20' height='20'>
      您的浏览器不支持 canvas
    </canvas>
  </div>
</template>

<script>
export default {
  name: 'dl-loading',
  componentName: 'dl-loading',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    loadKey: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      canvasLoad: undefined,
      ctx: undefined,
      point: {
        x: 10,
        y: 10
      },
      offset: 4,
      length: 4,
      distance: 45,
      time: undefined,
      timer: undefined
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.canvasLoad = document.querySelector(`#canvasLoad${this.loadKey}`)
            this.ctx = this.canvasLoad.getContext('2d')

            this.loading()
          })
        } else clearInterval(this.timer)
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    loading() {
      this.ctx.lineWidth = 2;
      this.ctx.lineCap = 'round'
      // 注意，根据三角函数的算法，第一次绘制在三点钟方向上

      this.time = 360 / this.distance;
      let range = 0;

      this.timer = setInterval(() => {
        this.ctx.clearRect(0, 0, 20, 20)
        this.draw(range)
        range += this.distance;
        if (range > 360) range = this.distance
      }, 50)
    },
    draw(range) {
      let _range = range

      for (let i = 0; i < this.time; i++) {
        // 根据正余弦三角函数，距离圆心的偏移值可作为斜边的边长，这样即可算出x，y 的偏移坐标
        const sin = Math.sin(Math.PI * _range / 180)
        const cos = Math.cos(Math.PI * _range / 180)
        
        this.ctx.beginPath()
        this.ctx.moveTo(this.point.x + this.offset * cos, this.point.y + this.offset * sin)
        this.ctx.lineTo(this.point.x + (this.offset + this.length) * cos, this.point.y + (this.offset + this.length) * sin)
        this.ctx.strokeStyle = 'rgba(220,223,230,'+ (0.25 + 0.75 * (i + 1) / this.time) +')';
        this.ctx.stroke();
        _range += this.distance
        if (_range > 360) _range = this.distance
      }
    }
  }
}
</script>

<style scoped>
.canvasLoad {
  margin-right: 3px;
  vertical-align: middle;
}
</style>