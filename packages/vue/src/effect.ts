//完成targetMap建立
//完成effect函数
// trigger函数
// track函数


const targetMap = new WeakMap<object,any>()
// 全局变量
let activeEffect:any = undefined

export class ReactiveEffect {
  deps=[]

  constructor(public fn) {
  }
  run(){
    activeEffect = this
    return this.fn()
  }
}
// -----------------------用于跟踪副作用-----------------------------
export function trackEffect(dep:Set<any>){
  dep.add(activeEffect!)
}
// 用于标记响应式，添加dep
export function track(target:object,key:string) {

  // 判断是否有全局副作用
  if(activeEffect){
    //   判断target下面存在副作用与否
    let depsMap = targetMap.get(target)
    if(!depsMap){
      depsMap = new Map()
      targetMap.set(target,(depsMap))
    }
// 判断depsMap存在key相关的响应式与否
    let dep = depsMap.get(key)
    if(!dep){
      dep = new Set()
      depsMap.set(key,dep)
    }
  //
trackEffect(dep)
  }


}

// -----------------------trigger用于执行副作用-----------------------------

// 用于触发dep的回调fn
export function trigger(target:object,key:string,value:any) {
  const depsMap = targetMap.get(target)
  if(!depsMap){
    // 没有被tracked
    return
  }
  const dep = depsMap.get(key)
  if(!dep){
    return
  }
  triggerEffects(dep)
}
// 执行副作用
const triggerEffects = (dep:Set<any>)=>{
const effects = [...dep]
  effects.forEach((d)=>{
    triggerEffect(d)
  })
}

const triggerEffect = (effect:ReactiveEffect)=>{
  effect.run()
}

// -----------------------ref-----------------------------
export function trackRefValue(target) {
  if(activeEffect){
    trackEffect(target.dep || (target.dep=new Set()))
  }
}
export function triggerRefValue(target) {
  if(target.dep){

  triggerEffects(target.dep)
  }
}
// -----------------------创建响应式副作用-----------------------------

export function effect(fn:Function) {
//   为activeEffect放入值
//   执行fn，用以触发get里面track
//   清空为activeEffect放入值
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
