// cloudfunctions/seedFoods/index.js
// 用途：一次性把 60 条食物写进 foods 集合。
// 触发方式：云开发控制台 → 云函数 → seedFoods → 测试 → 直接运行（参数留空）。
// 重复运行会产生重复数据，跑一次就够。

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const foods = require('./foods.json')

exports.main = async () => {
  const col = db.collection('foods')

  const tasks = foods.map(item => col.add({ data: item }))
  const results = await Promise.all(tasks)

  return {
    total: foods.length,
    inserted: results.length,
    firstId: results[0] && results[0]._id
  }
}
