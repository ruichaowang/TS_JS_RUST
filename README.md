# Rust 和 TypeScript 交互的例子
- typescript to javascript 具体的转译的方法以及限制没有声明，有大量的 SWC 的功能无法被 QuickJS 所支持，需要确认哪种可以支持
- Rust 中 Rc<RefCell<T>> 包裹的 Struct，通过 JsRc<T> 进行转换
- JsRc<T> 通过 IntoJs<'js> 和 FromJs<'js> 进行转换
