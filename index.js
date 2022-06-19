// ==UserScript==
// @name         小鹅通视频播放控制
// @author       AT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  小鹅通视频播放控制
// @author       You
// @match        https://appuwwsm6cl6690.h5.xiaoeknow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoeknow.com
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://raw.githubusercontent.com/kamranahmedse/jquery-toast-plugin/bd761d335919369ed5a27d1899e306df81de44b8/dist/jquery.toast.min.js
// @grant        none
// ==/UserScript==
function injectStylesheet(url) {
  $('head').append(
    '<link rel="stylesheet" href="' + url + '" type="text/css" />',
  )
}
;(function () {
  'use strict'
  injectStylesheet(
    'https://cdn.rawgit.com/kamranahmedse/jquery-toast-plugin/bd761d335919369ed5a27d1899e306df81de44b8/dist/jquery.toast.min.css',
  )

  const toast = (msg) => {
    $.toast({
      text: msg,
      loaderBg: '#9EC600',
      showHideTransition: 'fade', // fade, slide or plain
      allowToastClose: false, // Boolean value true or false
      hideAfter: 1000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
      stack: 1, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
      position: 'bottom-right',
      loader: false,
      bgColor: '#444444',
      textColor: '#eeeeee',
    })
  }

  document.onkeyup = function (event) {
    const VOL = 0.1 //1代表100%音量，每次增减0.1
    const TIME = 10 //单位秒，每次增减10秒
    const RATE = 0.1 // 速率

    const video = document.getElementsByTagName('video')
    if (!video?.length) return
    const [videoElement] = video
    if (!videoElement) return

    //键盘事件
    const e = event || window.event || arguments.callee.caller.arguments[0]
    console.log(
      '%c AT 🥝 onkeyup 🥝-25',
      'font-size:13px; background:#de4307; color:#f6d04d;',
      e.code,
    )

    if (!e) return

    const { keyCode } = e
    console.log('%c AT 🥝 keyCode 🥝-61', 'font-size:13px; background:#de4307; color:#f6d04d;', keyCode)
    //键盘快捷键
    if (keyCode === 38) {
      // 按向上键 + 音量
      videoElement.volume !== 1 ? (videoElement.volume += VOL) : 1
    } else if (keyCode === 40) {
      // 按向下键 - 音量
      videoElement.volume !== 0 ? (videoElement.volume -= VOL) : 1
    } else if (keyCode === 37) {
      // 按向左键 < 后退 10s
      videoElement.currentTime !== 0 ? (videoElement.currentTime -= TIME) : 1
    } else if (keyCode === 39) {
      // 按向右键 > 前进 10s
      videoElement.volume !== videoElement.duration
        ? (videoElement.currentTime += TIME)
        : 1
    } else if (keyCode === 32) {
      // 按空格键 开始/暂停
      videoElement.paused ? videoElement.play() : videoElement.pause()
    } else if (keyCode === 27 || keyCode === 13) {
      // 按 esc 进入全屏/退出全屏
      const [slider_right] = document.getElementsByClassName('fullBtn')
      // 刚开始还没有 fullBtn 按钮，让视频播放起来才会出现
      if (!slider_right) {
        return firstChangeScreen()
      }
      slider_right?.click()
    } else if (keyCode === 67) {
      // c 提升速度
      videoElement.playbackRate += RATE
	  toast(`播放速度 ${videoElement.playbackRate.toFixed(1)}`)
    } else if (keyCode === 90) {
      // z 还原速度
      videoElement.playbackRate = 1
	  toast(`播放速度 1.0`)
    } else if (keyCode === 88) {
      // x 降低速度
      videoElement.playbackRate -= RATE
	  toast(`播放速度 ${videoElement.playbackRate.toFixed(1)}`)
    }

    // 首次全屏
    function firstChangeScreen() {
      if (videoElement.paused) {
        const [playerImg] = document.getElementsByClassName('playerImg')

        playerImg.click() // 播放
        //   videoElement.pause() // 暂停

        setTimeout(() => {
          const [slider_right] = document.getElementsByClassName('fullBtn')
          // 进入全屏
          slider_right?.click()
        }, 200)
        return
      }
    }
  }
})()
