import * as util from 'util'

export default function inspect(obj: any, color: boolean) {
  return util.inspect(obj, false, 5, color)
}
