import Platform, { isSSR } from './Platform.js'
import { getBrand } from '../utils/colors.js'

let metaValue

function getProp () {
  if (Platform.is.winphone) {
    return 'msapplication-navbutton-color'
  }
  if (Platform.is.safari) {
    return 'apple-mobile-web-app-status-bar-style'
  }
  // Chrome, Firefox OS, Opera, Vivaldi
  return 'theme-color'
}

function getMetaTag (v) {
  const els = document.getElementsByTagName('META')
  for (let i in els) {
    if (els[i].name === v) {
      return els[i]
    }
  }
}

function setColor (hexColor) {
  if (metaValue === void 0) {
    // cache it
    metaValue = getProp()
  }

  let metaTag = getMetaTag(metaValue)
  const newTag = metaTag === void 0

  if (newTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', metaValue)
  }

  metaTag.setAttribute('content', hexColor)

  if (newTag) {
    document.head.appendChild(metaTag)
  }
}

export default {
  install ({ $q, cfg }) {
    this.set = isSSR === false && Platform.is.mobile === true && (
      Platform.is.cordova === true ||
      Platform.is.winphone === true || Platform.is.safari === true ||
      Platform.is.webkit === true || Platform.is.vivaldi === true
    )
      ? hexColor => {
        const val = hexColor || getBrand('primary')

        if (Platform.is.cordova === true && window.StatusBar) {
          window.StatusBar.backgroundColorByHexString(val)
        }
        else {
          setColor(val)
        }
      }
      : () => {}

    $q.addressbarColor = this

    cfg.addressbarColor && this.set(cfg.addressbarColor)
  }
}
