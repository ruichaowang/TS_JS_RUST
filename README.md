# Rust 和 TypeScript 的例子

- 本项目展示了如何使用 SWC 将 TypeScript 转译为 JavaScript，并通过 RQuickJS 在 Rust 中执行 JavaScript 代码。由于 RQuickJS 当前版本对 aarch64 支持较差，该项目也提供了在 Android 上的编译和测试指南。
- 静态检查需要安装 tsc 编译的的环境

## macOS 上运行

在 macOS 上，你可以直接运行以下命令来查看 TS 转 JS 和 JS 执行的时间,但是由于有需要静态检测，必须用 tsc 编译的的环境

```bash
brew install typescript
tsc --version   

cargo run
```

## 背景

- RQuickJS 虽然可以转译 JS 并和 Rust 交互，但是由于缺乏类型检查，不容易使得在编写代码时能够发现和纠正错误。
- TS 中可以定义接口和数据结构，使得代码更容易理解。
- SWC 本身是 rust 写的，且可以转译 TypeScript 为 JavaScript，同时提供了静态检查。

## 细节

- rust struct 数据被传递到 JS， JS 可以进行访问修改, JS 运行完毕后 rust 可以重新访问被 JS 修改的数据。
- typescript to javascript 具体的转译的方法以及限制没有声明，有大量的 SWC 的功能无法被 QuickJS 所支持，需要确认哪种可以支持
- Rust 中 Rc<RefCell<T>> 包裹的 Struct，通过 JsRc<T> 进行转换
- JsRc<T> 通过 IntoJs<'js> 和 FromJs<'js> 进行转换
- 由于转化过程会有 clone ，所以需要 Rc<RefCell<T>> 包裹，打破 clone

## swc android

- 安卓例子中，因为 RQuickjs 当前官方不支持 aarch64 的编译，所以只能演示 TS 转JS 并测试时间。
- rquicjs 是可以自己编译 bidgen 的

```bash
cargo build --target aarch64-linux-android
adb push target/aarch64-linux-android/debug/android_swc /data/local/tmp
adb push src/main.ts /data/local/tmp
chmod +x android_swc
```

### test benchmark

```bash
 cargo run --example test_swc_convert_time --release
```
