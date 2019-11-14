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
      commit('changeSpusDataMut', {})
      getFetch('/shop/' + shopId,  data, true).then(response => {
        var shopInfo = response.result || {}
        if (shopInfo.shopId != null) {
          shopInfo.prompt_text = "满35减23;满50减33;满70减43"
          if (shopInfo.categoryModelList.length > 0 && shopInfo.categoryModelList[0].categoryId) {
            if (shopInfo.categoryModelList.length <= index) {
              index = 0
            }
            getFetch('/category/category/' + shopInfo.categoryModelList[index].categoryId, data, true).then(response => {
              var go = response.result || {}
              var spus = { title: shopInfo.categoryModelList[index].name, index: 0, datas: go, categoryId: shopInfo.categoryModelList[index].categoryId }
              var selectedArr = []
              for (var i in spus.datas) {
                if ((spus.datas[i].goodsList && spus.datas[i].goodsList[0].goodsId) || spus.datas[i].parentId) {
                  selectedArr.push(spus.datas[i]);
              }
            }
            spus.datas = selectedArr 
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
                    } else if (itemList[i].parentCategoryId === category.categoryId) {
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
              for (const index1 in spus.datas) {
                if (itemList && itemList.length) {
                  for (var i in itemList) {
                    if (itemList[i].categoryId==spus.datas[index1].categoryId) {
                      for (var in1 in spus.datas[index1].goodsList) {
                        var goods = spus.datas[index1].goodsList[in1];
                        if (itemList[i].goodsId === goods.goodsId && !goods.sequence) {
                          goods.sequence = itemList[i].sequence
                          goods.categoryIndex = index
                          goods.parentCategoryId = itemList[i].parentCategoryId
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
      })
    } else {
      var shopInfo = state.shopInfo
      wx.setNavigationBarTitle({
        title: shopInfo.shopName
      })
    }
  },
  getCategoryMenuDataAction({ state, commit }, { index, categoryId,data }) {
    var category = state.shopInfo.categoryModelList[index];
    if (!category.spus || category.spus.datas.length < 1) {
      getFetch('/category/category/' + categoryId, data, true).then(response => {
        var spus = {}
        var categoryList = response.result || {}
        spus.title = category.name
        spus.page = response.result.nextPage
        spus.categoryId = categoryId
        spus.index = index       
        var selectedArr = []
        for (var i in categoryList) {
          if (categoryList[i].goodsList && categoryList[i].goodsList[0].goodsId) {
            selectedArr.push(categoryList[i]);
            for (var index1 in categoryList[i].goodsList) {
              var goods = categoryList[i].goodsList[index1];
              var data = state.cartMap[goods.goodsId]
              if (data) {
                goods.sequence = data.sequence
              }
              state.cartMap[goods.goodsId] = goods
            }
          } 
        }
        spus.datas = selectedArr 
        category.spus = spus
        commit('changeSpusDataMut', spus)
      })
    } else {
      commit('changeSpusDataMut', category.spus)
    }
  },
  addItemAction({ state, commit }, {parentCategoryId, item, index, categoryIndex }) {
    parentCategoryId = item.parentCategoryId? item.parentCategoryId : parentCategoryId
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
    var selectGoods = null;
    if (spus) {
      for (var index1 in spus.datas) {
        var category = spus.datas[index1];
        if (item.categoryId == category.categoryId) {
          for (var index2 in category.goodsList) {
            var selectGoods2 = category.goodsList[index2]
            if (item.goodsId == selectGoods2.goodsId) {
              selectGoods = selectGoods2 
              selectGoods.sequence += 1
              break;
            }
          }
        }
      }
    }
    if (!item.oldData) {
      selectGoods.parentCategoryId = parentCategoryId
      state.cartMap[selectGoods.goodsId] =  selectGoods
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
        item.parentCategoryId = parentCategoryId
        state.cartMap[item.goodsId] = item
      }
    }
  },
  reduceItemAction({ state, commit }, {parentCategoryId,  item, index, categoryIndex }) {
    parentCategoryId = item.parentCategoryId? item.parentCategoryId : parentCategoryId
    var selectedFood = state.categoryMap[parentCategoryId]
    selectedFood.count = selectedFood.count - 1
    selectedFood.totalPrice = selectedFood.totalPrice - item.min_price
    var spus = selectedFood.spus

    var selectGoods = null;
    if (spus) {
      for (var index1 in spus.datas) {
        var category = spus.datas[index1];
        if (item.categoryId == category.categoryId) {
          for (var index2 in category.goodsList) {
            var selectGoods2 = category.goodsList[index2]
            if (item.goodsId == selectGoods2.goodsId) {
              selectGoods = selectGoods2 
              selectGoods.sequence -= 1
              if (selectGoods.sequence <= 0) spus.datas[index].sequence = 0
              break;
            }
          }
        }
      }
    }
    if (!item.oldData) {
      selectGoods.parentCategoryId = parentCategoryId
      state.cartMap[selectGoods.goodsId] =  selectGoods
    }
    else {
      if (spus) {
      for (var index1 in spus.datas) {
        var category = spus.datas[index1];
        if (item.categoryId == category.categoryId) {
          for (var index2 in category.goodsList) {
            if (item.goodsId == category.goodsList[index2].goodsId) {
              category.goodsList[index2].sequence -= 1
            }
          }
        }
      }
    }
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