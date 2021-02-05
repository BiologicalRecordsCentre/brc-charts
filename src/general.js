 
export function safeId(text) {
  return text ? text.replace(/\W/g,'_') : null
}

export function cloneData(data) {
  return data.map(d => { return {...d}})
}