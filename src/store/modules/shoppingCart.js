/** Created by guangqiang on 2018-09-27 17:32:35 */
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
  categoryMap: {},
  selectGoods: {}
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
            getFetch('/category/category/' + shopInfo.categoryModelList[index].categoryId, {}, false).then(response => {
              var go = response.result || {}
              var spus = { title: shopInfo.categoryModelList[index].name, index: 0, datas: go, categoryId: shopInfo.categoryModelList[index].categoryId }
              shopInfo.categoryModelList[index].spus = spus
              commit('changeShopInfoDataMut', shopInfo)
              var itemList = this.state.submitOrder.orderDetail.itemList
              for (var index2 in shopInfo.categoryModelList) {
                state.categoryMap[shopInfo.categoryModelList[index2].categoryId] = shopInfo.categoryModelList[index2]
                if (itemList && itemList.length) {
                  for (var i in itemList) {
                    var category = shopInfo.categoryModelList[index2];
                    if (itemList[i].categoryId === category.categoryId) {
                      if (!shopInfo.categoryModelList[index2].count) {
                        shopInfo.categoryModelList[index2].count = 0
                      }
                      shopInfo.categoryModelList[index2].count += itemList[i].sequence
                      itemList[i].categoryIndex = index2
                      if (!shopInfo.categoryModelList[index2].totalPrice) {
                        shopInfo.categoryModelList[index2].totalPrice = 0
                      }
                      shopInfo.categoryModelList[index2].totalPrice += itemList[i].currentPrice * itemList[i].sequence
                    } else if (category.childrenCategory.length>0) {
                      var categoryId = category.categoryId;
                      var categoryList = category.childrenCategory;
                      for (var index3 in categoryList) {
                        category = categoryList[index3];
                        if (itemList[i].categoryId === category.categoryId) {
                          if (!shopInfo.categoryModelList[index2].count) {
                            shopInfo.categoryModelList[index2].count = 0
                          }
                          shopInfo.categoryModelList[index2].count += itemList[i].sequence
                          itemList[i].categoryIndex = index2
                          itemList[i].parentCategoryId = categoryId
                          if (!shopInfo.categoryModelList[index2].totalPrice) {
                            shopInfo.categoryModelList[index2].totalPrice = 0
                          }
                          shopInfo.categoryModelList[index2].totalPrice += itemList[i].currentPrice * itemList[i].sequence
                        } 
                      }
                    }
                  }
                }
              }
              
              for (const i in itemList) {
                itemList[i].oldData = true
                itemList[i].index = itemList[i].goodsId
                state.cartMap[itemList[i].goodsId] = itemList[i]
              }
              for (const index1 in spus.datas) {
                if (itemList && itemList.length) {
                  for (var i in itemList) {
                    if (itemList[i].categoryId==spus.datas[index1].categoryId) {
                      for (var in1 in spus.datas[index1].goodsList) {
                        var goods = spus.datas[index1].goodsList[in1];
                        if (itemList[i].goodsId === goods.goodsId && !goods.sequence) {
                          goods.sequence = itemList[i].sequence
                          goods.categoryIndex = index
                          goods.index = parseInt(in1)
                          state.cartMap[goods.goodsId] = goods
                        }
                      }
                    }
               
                  }
                }
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
  },
  getCategoryMenuDataAction({ state, commit }, { index, categoryId }) {
    wx.showLoading({ title: '加载中...', mask: true })
    var category = state.shopInfo.categoryModelList[index];
    if (!category.spus || category.spus.datas.length < 1) {
      getFetch('/category/category/' + categoryId, {}, false).then(response => {
        var spus = {}
        var categoryList = response.result || {}
        spus.title = category.name
        spus.page = response.result.nextPage
        spus.categoryId = categoryId
        spus.index = index
        spus.datas = categoryList
        for (var i in categoryList) {
          for (var index1 in categoryList[i].goodsList) {
            var goods = categoryList[i].goodsList[index1];
            var data = state.cartMap[goods.goodsId]
            if (data) {
              goods.sequence = data.sequence
            }
            goods.status = true
            state.cartMap[goods.goodsId] = goods
          } 
        }
        category.spus = spus
        commit('changeSpusDataMut', spus)
        wx.hideLoading()
      })
    } else {
      commit('changeSpusDataMut', category.spus)
      wx.hideLoading()
    }
  },
  addItemAction({ state, commit }, {parentCategoryId, item, index, categoryIndex }) {
    var selectedFood = state.categoryMap[parentCategoryId]
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
      spus.datas[categoryIndex].goodsList[index].sequence += 1
      spus.datas[categoryIndex].goodsList[index].index = index
      spus.datas[categoryIndex].goodsList[index].parentCategoryId = parentCategoryId
      spus.datas[categoryIndex].goodsList[index].categoryIndex = categoryIndex
      state.cartMap[spus.datas[categoryIndex].goodsList[index].goodsId] =  spus.datas[categoryIndex].goodsList[index]
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
  reduceItemAction({ state, commit }, {parentCategoryId,  item, index, categoryIndex }) {
    var selectedFood = state.categoryMap[parentCategoryId]
    selectedFood.count = selectedFood.count - 1
    selectedFood.totalPrice = selectedFood.totalPrice - item.min_price
    var spus = selectedFood.spus
    if (!item.oldData) {
      spus.datas[categoryIndex].goodsList[index].sequence -= 1
      spus.datas[categoryIndex].goodsList[index].index = index
      spus.datas[categoryIndex].goodsList[index].categoryIndex = categoryIndex
      spus.datas[categoryIndex].goodsList[index].parentCategoryId = parentCategoryId
      if (spus.datas[index].sequence <= 0) spus.datas[index].sequence = 0
      state.cartMap[spus.datas[categoryIndex].goodsList[index].goodsId] = spus.datas[categoryIndex].goodsList[index]
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
            itm.totalPrice = parseFloat(price).toFixed(2)
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
    sku.price = parseFloat(item.min_price).toFixed(2)
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