/** Created by guangqiang on 2018-09-27 17:32:35 */
import { formatYMD } from '@/utils/formatTime'
import { shoppingCart } from '@/pages/shoppingCart/data'
import { getFetch } from '@/network/request/HttpExtension'
const state = {
  shopInfo: {},
  spus: {},
  commentInfo: [],
  reduceFee: 0.0,
  visibleSkuModal: false,
  visibleItemModal: false,
  skuInfo: {},
  previewInfo: {},
  cartMap: {},
  categoryMap: {}
}

const mutations = {
  changeShopInfoDataMut(state, info) {
    state.shopInfo = info
  },
  cleanShopping(state) {
    state.shopInfo = {}
  },
  changeSpusDataMut(state, info) {
    state.spus = info;
  },
  changeCommentDataMut(state, info) {
    state.commentInfo = info
  },
  changeReduceFeeDataMut(state, info) {
    state.reduceFee = info
  },
  changeSkuModalMut(state, info) {
    state.visibleSkuModal = info
  },
  changeItemModalMut(state, info) {
    state.visibleItemModal = info
  },
  changeSkuDataMut(state, info) {
    state.skuInfo = info
  },
  changePreviewDataMut(state, info) {
    state.previewInfo = info
  }
}

const actions = {
  getMenuDataAction({ state, commit }, { shopId, data, index, flag }) {
    if ((state.shopInfo && state.shopInfo.shopId != shopId) || flag) {
      state.shopInfo = {}
      state.cartMap = {}
      state.categoryMap = {}
      wx.showLoading({ title: '加载中...', mask: true })
      getFetch('/shop/' + shopId,  data, false).then(response => {
        var shopInfo = response.result || {}
        if (shopInfo.shopId) {
          shopInfo.prompt_text = "满35减23;满50减33;满70减43"
          if (shopInfo.categoryModelList.length > 0 && shopInfo.categoryModelList[0].categoryId) {
            if (shopInfo.categoryModelList.length <= index) {
              index = 0
            }
            getFetch('/goods/' + shopId, { page: 1, 'categoryId': shopInfo.categoryModelList[index].categoryId, 'status' : 1 }, false).then(response => {
              var goods = response.result || {}
              var spus = { title: shopInfo.categoryModelList[index].name, index: 0, datas: goods.list, page: goods.nextPage, categoryId: shopInfo.categoryModelList[index].categoryId }
              shopInfo.categoryModelList[index].spus = spus
              commit('changeShopInfoDataMut', shopInfo)
              var itemList = this.state.submitOrder.orderDetail.itemList
              for (var index2 in shopInfo.categoryModelList) {
                state.categoryMap[shopInfo.categoryModelList[index2].categoryId] = shopInfo.categoryModelList[index2]
                if (itemList && itemList.length) {
                  for (var i in itemList) {
                    if (itemList[i].categoryId === shopInfo.categoryModelList[index2].categoryId) {
                      if (!shopInfo.categoryModelList[index2].count) {
                        shopInfo.categoryModelList[index2].count = 0
                      }
                      shopInfo.categoryModelList[index2].count += itemList[i].sequence
                      itemList[i].categoryIndex = index2
                      if (!shopInfo.categoryModelList[index2].totalPrice) {
                        shopInfo.categoryModelList[index2].totalPrice = 0
                      }
                      shopInfo.categoryModelList[index2].totalPrice += itemList[i].currentPrice * itemList[i].sequence
                    }
                  }
                }
              }
              for (const i in itemList) {
                itemList[i].oldData = true
                itemList[i].index = itemList[i].goodsId
                state.cartMap[itemList[i].goodsId] = itemList[i]
              }
              for (const index1 in goods.list) {
                if (itemList && itemList.length) {
                  for (var i in itemList) {
                    if (itemList[i].goodsId === goods.list[index1].goodsId && !goods.list[index1].sequence) {
                      goods.list[index1].sequence = itemList[i].sequence
                    }
                  }
                }
                goods.list[index1].categoryIndex = index
                goods.list[index1].index = parseInt(index1)
                state.cartMap[goods.list[index1].goodsId] = goods.list[index1]
              }
              commit('changeSpusDataMut', spus)
            })
          } else {
            commit('changeShopInfoDataMut', shopInfo)
            commit('changeSpusDataMut', { title: '', index: 0, datas: {}, page: 1 })
          }
          wx.setNavigationBarTitle({
            title: shopInfo.shopName
          })
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'loading',
            duration: 1500
          })
        }
        wx.hideLoading()
      })
    } else {
      var shopInfo = state.shopInfo
      wx.setNavigationBarTitle({
        title: shopInfo.shopName
      })
    }
  },
  getCommentDataAction({ state, commit }) {
    var res = shoppingCart.commentData.data
    var commentData = res
    var comments = res.comments.map(item => {
      var reply = item.add_comment_list[0] || {}
      item.poi_reply_contents = `${reply.desc}：${reply.content}`
      item.commentTags = item.comment_labels.map(item => item.content).join()
      item.comment_time = formatYMD(item.comment_time * 1000)
      return item;
    })
    commentData.comments = comments

    var commentMolds = res.comment_categories.map(item => {
      var num = item.replace(/[^0-9]/ig, "");
      var characters = item.match(/[\u4e00-\u9fa5]/g);
      var title = characters.join("");
      return `${title}(${num})`
    })
    res.labels.map(item => {
      var tag = `${item.content}(${item.label_count})`
      commentMolds.push(tag)
    })
    commentData.commentMolds = commentMolds

    commit('changeCommentDataMut', commentData)
  },
  getCategoryMenuDataAction({ state, commit }, { index, categoryId }) {
    wx.showLoading({ title: '加载中...', mask: true })
    if (!state.shopInfo.categoryModelList[index].spus || state.shopInfo.categoryModelList[index].spus.datas.length < 1) {
      getFetch('/goods/' + state.shopInfo.shopId, { 'categoryId': categoryId }, false).then(response => {
        var spus = {}
        var goods = response.result.list
        spus.title = state.shopInfo.categoryModelList[index].name
        spus.page = response.result.nextPage
        spus.categoryId = categoryId
        spus.index = index
        spus.datas = goods.map(item => {
          if (!item.sequence) item.sequence = 0
          return item
        })
        for (var index1 in goods) {
          var data = state.cartMap[goods[index1].goodsId]
          if (data) {
            goods[index1].sequence = data.sequence
          }
          goods[index1].status = true
          state.cartMap[goods[index1].goodsId] = goods[index1]
        }
        state.shopInfo.categoryModelList[index].spus = spus
        commit('changeSpusDataMut', spus)
        wx.hideLoading()
      })
    } else {
      commit('changeSpusDataMut', state.shopInfo.categoryModelList[index].spus)
      wx.hideLoading()
    }
  },
  addItemAction({ state, commit }, { item, index, categoryIndex }) {
    var selectedFood = state.categoryMap[item.categoryId]
    if (!selectedFood.count) {
      selectedFood.count = 0
    }
    selectedFood.count += 1
    if (!selectedFood.totalPrice) {
      selectedFood.totalPrice = 0
    }
    selectedFood.totalPrice += item.min_price
    var spus = selectedFood.spus
    if (!item.oldData) {
      spus.datas[index].sequence += 1
      spus.datas[index].index = index
      spus.datas[index].categoryIndex = categoryIndex
      state.cartMap[spus.datas[index].goodsId] = spus.datas[index]
    }
    else {
      var goods = state.cartMap[item.goodsId]
      if (goods) {
        goods.sequence += 1
      } else {
        if (!item.sequence) {
          item.sequence = 0
        }
        item.sequence += 1
        state.cartMap[item.goodsId] = item
      }
    }
  },
  reduceItemAction({ state, commit }, { item, index, categoryIndex }) {
    var selectedFood = state.categoryMap[item.categoryId]
    selectedFood.count = selectedFood.count - 1
    selectedFood.totalPrice = selectedFood.totalPrice - item.min_price
    var spus = selectedFood.spus
    if (!item.oldData) {
      spus.datas[index].sequence -= 1
      spus.datas[index].index = index
      spus.datas[index].categoryIndex = categoryIndex
      if (spus.datas[index].sequence <= 0) spus.datas[index].sequence = 0
      state.cartMap[spus.datas[index].goodsId] = spus.datas[index]
    }
    else {
      var goods = state.cartMap[item.goodsId]
      if (goods) {
        goods.sequence -= 1
        if (goods.sequence < 0) {
          goods.sequence = 0
        }
      }
    }
  },
  closeShoppingCartAction({ state, commit }) {
    var array = state.shopInfo.categoryModelList
    var selectedArr = []
    array.map((item, index) => {
      if (item.spus) {
        item.spus.datas.map((itm, idx) => {
          if (itm.sequence > 0) {
            var price = itm.min_price * itm.sequence
            itm.totalPrice = parseFloat(price).toFixed(1)
            selectedArr.push(itm)
          }
        })
      }
    })
    var shopInfo = state.shopInfo
    shopInfo.selectedArr = selectedArr
    commit('changeShopInfoDataMut', shopInfo)
    wx.navigateTo({ url: '/pages/submitOrder/main' })
  },
  selectSkuAction({ state, commit }, { item, index }) {
    commit('changeSkuModalMut', true)
    var sku = {}
    var array = item.attrs
    var selectedItems = []
    for (let i = 0; i < array.length; i++) {
      var attr = array[i].values
      attr.map((item, idx) => {
        if (idx === 0) {
          item.selected = true;
          selectedItems.push(item.value)
        } else {
          item.selected = false;
        }
        return item
      })
    }

    sku.item = item
    sku.index = index
    sku.attrs = array
    sku.title = item.name
    sku.selectedCount = item.sequence
    sku.price = parseFloat(item.min_price).toFixed(1)
    sku.selectedItems = selectedItems.join(',')
    sku.time = new Date()
    commit('changeSkuDataMut', sku)
  },
  attrSelectAction({ state, commit }, { itm, idx, setIdx }) {
    var sku = state.skuInfo
    var array = sku.attrs
    var selectedItems = sku.selectedItems.split(',')
    var section = array[setIdx]
    for (var i = 0; i < section.values.length; i++) {
      var item = section.values[i]
      if (i === idx) {
        item.selected = true
        selectedItems[setIdx] = item.value
      } else {
        item.selected = false
      }
    }
    sku.selectedItems = selectedItems.join(',')
    sku.time = new Date()
    commit('changeSkuDataMut', sku)
  },
  changeSkuModalDataAction({ state, commit }, { num }) {
    var sku = state.skuInfo
    sku.selectedCount = sku.selectedCount + num
    commit('changeSkuDataMut', sku)
  },
  previewItemAction({ state, commit }, { item, index }) {
    commit('changeItemModalMut', true)
    var preview = item
    preview.preIndex = index
    preview.description = item.skus[0].description
    commit('changePreviewDataMut', preview)
  }
}

const getters = {

}

export default {
  state,
  mutations,
  actions,
  getters
}