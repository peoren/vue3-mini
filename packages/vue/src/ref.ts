import { toReactive } from './reactive'
import { trackRefValue, triggerRefValue } from './effect'

export function ref(value:any) {
  return createRef(value)
}
export function createRef(rawValue:any) {
  return new RefImpl(rawValue)
}
export class RefImpl {
  private _rawValue:any
  private _value:any
  public dep
  constructor(value:any) {
    this._value = toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue: any) {
    if (hasChanged(newValue, this._rawValue)) {
      this._value = toReactive(newValue)
      this._rawValue=newValue
      triggerRefValue(this)
    }
  }
}

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)
