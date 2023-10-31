import { isMp } from './env'

type CanvasContext = UniApp.CanvasContext

function compareVersion(v1Old: string, v2Old: string) {
  const v1 = v1Old.split('.')
  const v2 = v2Old.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len)
    v1.push('0')

  while (v2.length < len)
    v2.push('0')

  for (let i = 0; i < len; i++) {
    const num1 = Number.parseInt(v1[i])
    const num2 = Number.parseInt(v2[i])

    if (num1 > num2)
      return 1

    else if (num1 < num2)
      return -1
  }

  return 0
}

//////////////////////////////////////////////////////////////////////////////////
/// ///// 微信小程序自1.9.90起废除若干个CanvasContext的函数，改为属性，以下为兼容代码
//////////////////////////////////////////////////////////////////////////////////

function _easyCanvasContextBase(
  systemInfo: any,
  lowCallback: () => void,
  highCallback: () => void,
  targetVersion: string = '1.9.90',
) {
  if (isMp && compareVersion(systemInfo.SDKVersion, targetVersion) >= 0)
    highCallback()

  else
    lowCallback()
}
/**
 *
 * 基础库 1.9.90 开始支持，低版本需做兼容处理。填充颜色。用法同 CanvasContext.setFillStyle()。
 * @param systemInfo
 * @param canvasContext
 * @param color
 */
function easySetStrokeStyle(
  systemInfo: UniApp.GetSystemInfoResult,
  canvasContext: CanvasContext,
  color: string | CanvasGradient,
) {
  _easyCanvasContextBase(
    systemInfo,
    () => {
      canvasContext.setStrokeStyle(color as any)
      // eslint-disable-next-line no-console
      console.log('???')
    },
    () => {
      if (typeof color === 'string')
        canvasContext.strokeStyle = color
    },
  )
}

function easySetLineWidth(systemInfo: UniApp.GetSystemInfoResult, canvasContext: CanvasContext, lineWidth: number) {
  _easyCanvasContextBase(
    systemInfo,
    () => {
      canvasContext.setLineWidth(lineWidth)
    },
    () => {
      canvasContext.lineWidth = lineWidth
    },
  )
}

function easySetFillStyle(
  systemInfo: UniApp.GetSystemInfoResult,
  canvasContext: CanvasContext,
  color: string | CanvasGradient,
) {
  _easyCanvasContextBase(
    systemInfo,
    () => {
      canvasContext.setFillStyle(color)
    },
    () => {
      if (typeof color === 'string')
        canvasContext.fillStyle = color
    },
  )
}

export { compareVersion, easySetStrokeStyle, easySetLineWidth, easySetFillStyle }
