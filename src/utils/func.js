export const getOptionText = (options, id) => {
  const data = options.filter((item) => `${item.id}` === `${id}`)
  return data.length > 0 ? data[0].name : '-'
}

// 获取当前时间
export const getCurrentTime = () => {
  const yy = new Date().getFullYear()
  const mm = new Date().getMonth() + 1 < 10 ? '0' + new Date().getMonth() : new Date().getMonth()
  const dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
  const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
  const mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
  const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
  return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
}
