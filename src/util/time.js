export const wait = (delay: number = 0) =>
  new Promise(resolve => setTimeout(resolve, delay))
