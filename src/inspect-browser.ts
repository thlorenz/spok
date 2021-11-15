import * as util from 'util'
import spok from './spok'

// terminal colors won't show properly in the browser
if (spok != null && spok.color) {
  spok.color = false
}

export default function inspect(obj: any, color: boolean) {
  return util.inspect(obj, false, 5, color)
}
