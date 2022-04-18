import { isString } from '@tarojs/shared'
import { navigator } from './navigator'
import { document } from './document'
import { win } from '../env'
import { raf, caf } from './raf'
import { History } from './history'
import { Location } from './location'
import { getComputedStyle } from './getComputedStyle'
import { DATE } from '../constants'
import { Events } from '../emitter/emitter'

let WindowConstructor
if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
  class Window extends Events {
    location: Location
    history: History

    constructor () {
      super()

      const globalProperties = [
        ...Object.getOwnPropertyNames(global || win),
        ...Object.getOwnPropertySymbols(global || win)
      ]

      globalProperties.forEach(property => {
        if (property === 'atob') return
        if (!Object.prototype.hasOwnProperty.call(this, property)) {
          this[property] = global[property]
        }
      })

      if (!(DATE in this)) {
        (this as any).Date = Date
      }

      this.location = new Location({ win: this })
      this.history = new History(this.location, { win: this })

      this.document.defaultView = this
    }

    get document () {
      return document
    }

    get navigator () {
      return navigator
    }

    get requestAnimationFrame () {
      return raf
    }

    get cancelAnimationFrame () {
      return caf
    }

    get getComputedStyle () {
      return getComputedStyle
    }

    addEventListener (event: string, callback: (arg: any)=>void) {
      if (!event || !isString(event)) return
      this.on(event, callback, null)
    }

    removeEventListener (event: string, callback: (arg: any)=>void) {
      if (!event || !isString(event)) return
      this.off(event, callback, null)
    }

    setTimeout (...args: Parameters<typeof setTimeout>) {
      return setTimeout(...args)
    }

    clearTimeout (...args: Parameters<typeof clearTimeout>) {
      return clearTimeout(...args)
    }
  }

  WindowConstructor = Window
}

export const window: any = process.env.TARO_ENV === 'h5' ? win : new WindowConstructor()

// if (process.env.TARO_ENV && process.env.TARO_ENV !== 'h5') {
//   const globalProperties = [
//     ...Object.getOwnPropertyNames(global || win),
//     ...Object.getOwnPropertySymbols(global || win)
//   ]

//   globalProperties.forEach(property => {
//     if (property === 'atob') return
//     if (!Object.prototype.hasOwnProperty.call(window, property)) {
//       window[property] = global[property]
//     }
//   })

//   window.requestAnimationFrame = raf
//   window.cancelAnimationFrame = caf
//   window.getComputedStyle = getComputedStyle
//   window.addEventListener = noop
//   window.removeEventListener = noop
//   if (!(DATE in window)) {
//     window.Date = Date
//   }
//   window.setTimeout = function (...args: Parameters<typeof setTimeout>) {
//     return setTimeout(...args)
//   }
//   window.clearTimeout = function (...args: Parameters<typeof clearTimeout>) {
//     return clearTimeout(...args)
//   }

//   document.defaultView = window
// }
