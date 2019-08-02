/**
 * Created by guangqiang on 2017/10/3.
 */

const responseCode = {
  RESPONSE_SUCCESS: '200', // 请求成功,返回数据
  TOKEN_INVALID: '430', // token 失效
  USER_LOGOUT: '-110', // 用户未登录
  PARTICIPANT_NOT_GRANT_JOIN: '20220010', // 用户没有权限参与
  ACTIVITY_CREATER_NOT_GRANT: '20210025', // 活动创建者没有权限
  ORDERPAID_ERROR_CODE: '2001'   // 订单已支付
}

export default responseCode