import { track, trigger } from './effect'

/**
 * @description 描述fn的作用或功能
 * @return {object}
 * @param target
 */
export function reactive(target:object):object{
  return  createReactiveObject(target,handler)
}

const handler = {
  get(target: any, p: string , receiver: any): any {
  //   track
    console.log('track')
    track(target,p)
   return  Reflect.get(target,p,receiver)
  },
  set(target: any, p: string ,value: any,receiver: any): any {
  // trigger
    const result = Reflect.set(target,p,value,receiver)
    trigger(target,p,value)
    console.log('trigger')
    return result
  }
}
// 返回代理对象
export function createReactiveObject (target,handler:ProxyHandler<any>):object{
  const proxy = new Proxy(target,handler)
  return proxy
}


export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const toReactive = (value:any)=>{
  return   isObject(value)?reactive(value):value
}
