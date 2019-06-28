/** Created by guangqiang on 2018-08-30 14:28:14 */

import Vue from 'vue'
import App from './App'
import store from './store'
import * as util from './utils'
import 'mpvue-weui/src/style/weui.css';
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.util = util

const app = new Vue({
  store,
  ...App
})

app.$mount()

Vue.directive('enterNumber', {
  inserted: function (el) {
    el.addEventListener("keypress", function (e) {
      e = e || window.event;
      let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode;
      let re = /\d/;
      if (charcode == 46) {
        if (el.value.includes('.')) {
          e.preventDefault();
        }
        return;
      } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
        }
      }
    });
  }
});