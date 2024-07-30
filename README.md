# Rust 和 TypeScript 交互的例子

- rust struct 数据被传递到 JS， JS 可以进行访问修改, JS 运行完毕后 rust 可以重新访问被 JS 修改的数据。
- typescript to javascript 具体的转译的方法以及限制没有声明，有大量的 SWC 的功能无法被 QuickJS 所支持，需要确认哪种可以支持
- Rust 中 Rc<RefCell<T>> 包裹的 Struct，通过 JsRc<T> 进行转换
- JsRc<T> 通过 IntoJs<'js> 和 FromJs<'js> 进行转换
- 由于转化过程会有 clone ，所以需要 Rc<RefCell<T>> 包裹，打破 clone
