import './scss/style.scss'
import '@babel/polyfill'
import * as jQuery from 'jquery'
import Vue from 'vue'
// @ts-ignore
import App from './components/App.vue'

import SmoothScroll from 'smooth-scroll'

const $ = jQuery

// jqueryで記述可能
$(function() {
  console.log($('#myText').text())
})

// Vue init
Vue.config.productionTip = false
new Vue({
  render: h => h(App)
}).$mount("#app")

const counter: HTMLElement = <HTMLElement>document.getElementById('counter')
const button: HTMLElement = <HTMLElement>document.getElementById('button')

// video
const video: HTMLVideoElement = <HTMLVideoElement>document.getElementById('myvideo')
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('mycanvas')
let tick = false
const context = canvas.getContext('2d')
let canvasAspect = context!.canvas.width / context!.canvas.height
const videoAspect = video.width / video.height
let left = 0
let top = 0
let width = 0
let height = 0

window.addEventListener('DOMContentLoaded', () => {
  canvasResize()
  
  setTimeout(() => {
    // video.play()
    canvasInit()
  }, 100)
})

window.addEventListener('scroll', handleScroll, { passive: true })

function canvasInit() {
  setInterval(() => {
    context!.drawImage(video, 0, 0, video.width, video.height, left, top, width, height)
    console.log(`width: ${width} / height: ${height} / left: ${left} / top: ${top}`)
  }, 1000/60)
}

function canvasResize() {
  let w = window.innerWidth
  let h = window.innerHeight
  canvas.setAttribute('width', String(w))
  canvas.setAttribute('height', String(h))
  canvasAspect = context!.canvas.width / context!.canvas.height
  //  比率に合わせてvideo をfill
  if (canvasAspect >= videoAspect) {
    // canvas のほうが横長
    left = 0
    width = context!.canvas.width
    height = context!.canvas.width / videoAspect
    top = (context!.canvas.height - height) / 2
    console.log('canvas のほうが横長')
  } else {
    // video のほうが横長
    top = 0
    height = context!.canvas.height
    width = context!.canvas.height * videoAspect
    left = (context!.canvas.width - width) / 2
    console.log('video のほうが横長')
  }
}

window.addEventListener('resize', canvasResize)

// scroll
function handleScroll() {
  if (!tick) {
    requestAnimationFrame(() => {
      tick = false
      let y = window.scrollY

      // カウンターに現在のスクロール量を表示
      counter.textContent = String(y)

      let setTime = y / 30

      // Videoの再生位置を設定
      video.currentTime = setTime

    })
    tick = true
  }
}


// button 
button.addEventListener('click', (el) => {
  const scroll = new SmoothScroll()
  scroll.animateScroll(3000);
})