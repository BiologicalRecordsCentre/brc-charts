 
export function safeId(text) {
  return text ? text.replace(/\W/g,'_') : null
}