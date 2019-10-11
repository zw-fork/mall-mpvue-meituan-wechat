
<template>
  <div class="address-list">
    <div class="mpvue-picer">
      <button @click="showPicker">test for mpvuePicker</button>
      <mpvue-picker
        :mode="mode3"
        :deepLength="deepLength3"
        ref="mpvuePicker3"
        :pickerValueArray="mulLinkageTwoPicker3"
        :pickerValueDefault="pickerValueDefault3"
        @onConfirm="onConfirm">
      </mpvue-picker>
    </div>
  </div>
</template>
 
<script>
// import { formatTime } from '@/utils/index'
import mpvuePicker from 'mpvue-picker'
 
export default {
  components: {
    mpvuePicker
  },
 
  data () {
    return {
      mode3: 'multiLinkageSelector',
      deepLength3: 2,
      mulLinkageTwoPicker3: [
        {
          label: '火车',
          value: 10,
          children: [
            {
              label: '火车1',
              value: 11,
              children: [
                {
                  label: '火车2',
                  value: 12,
                  children: []
                },
                {
                  label: '火车3',
                  value: 13,
                  children: []
                }
              ]
            }
          ]
        },
        {
          label: '火车20',
          value: 210,
          children: [
            {
              label: '火车21',
              value: 211,
              children: [
                {
                  label: '火车22',
                  value: 212,
                  children: []
                },
                {
                  label: '火车23',
                  value: 213,
                  children: []
                }
              ]
            }
          ]
        }
      ],
      pickerValueDefault3: [1, 0, 1]
    }
  },
  computed: {
    categoryId () {
      return this.$mp.query.id
    }
  },
  methods: {
    showPicker () {
       this.$refs.mpvuePicker3.show()
    },
  },
 
  created () {
  },
  mounted () {
    this.init()
    this.showPicker()
  }
 
}
</script>