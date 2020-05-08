
export const get = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key))
      if (value === null) return undefined
      return value
    } catch(e) {
      console.log(e)
      return undefined
    }
  }
  
  export const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.log(e)
    }
  }