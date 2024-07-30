pub mod js_rc;
pub mod test_qjs_macro_module; // 由于转化过程会有 clone ，所以需要 Rc<RefCell<T>> 包裹，打破 clone

use js_rc::JsRc;
use rquickjs::{
    loader::{BuiltinResolver, FileResolver, ScriptLoader},
    CatchResultExt, Function, Module, Runtime,
};
use std::{cell::RefCell, env, fs, io, rc::Rc};
use swc::{config::IsModule, Compiler, PrintArgs};
use swc_common::{errors::Handler, source_map::SourceMap, sync::Lrc, Mark, GLOBALS};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::FoldWith;
use test_qjs_macro_module::counter_wrapper::TestRustClass;

/// Transforms typescript to javascript. Returns tuple (js string, source map)
/// 备注：具体的转译的方法以及限制没有声明，有大量的 SWC 的功能无法被 QuickJS 所支持，需要确认哪种可以支持
fn ts_to_js(filename: &str, ts_code: &str) -> (String, String) {
    let cm = Lrc::new(SourceMap::new(swc_common::FilePathMapping::empty()));

    let compiler = Compiler::new(cm.clone());

    let source = cm.new_source_file(
        Lrc::new(swc_common::FileName::Custom(filename.into())),
        ts_code.to_string(),
    );

    let handler = Handler::with_emitter_writer(Box::new(io::stderr()), Some(compiler.cm.clone()));

    return GLOBALS.set(&Default::default(), || {
        let res = compiler
            .parse_js(
                source,
                &handler,
                EsVersion::Es5,
                Syntax::Typescript(Default::default()),
                IsModule::Bool(true),
                Some(compiler.comments()),
            )
            .expect("parse_js failed");

        // Transform the Program
        let program = res;
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();
        let program = program.fold_with(&mut strip(unresolved_mark, top_level_mark));

        // Construct PrintArgs struct for print method
        let print_args = PrintArgs::default();
        // https://rustdoc.swc.rs/swc/struct.Compiler.html#method.print
        let ret = compiler
            .print(
                &program,   // ast to print
                print_args, // print options
            )
            .expect("print failed");

        return (ret.code, ret.map.expect("no source map"));
    });
}

/// Rust 和 TypeScript 交互的例子
/// Rust 中 Rc<RefCell<T>> 包裹的 Struct，通过 JsRc<T> 进行转换
/// JsRc<T> 通过 IntoJs<'js> 和 FromJs<'js> 进行转换
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let current_dir = env::current_dir()?;
    println!("Current directory: {}", current_dir.display());
    let ts_code = fs::read_to_string("./src/hello.ts")?;
    let (js_script, sourcemap) = ts_to_js("hello.ts", &ts_code);

    println!("Generated JavaScript:");
    println!("{}\n", js_script);
    println!("Source Map:");
    println!("{}\n", sourcemap);

    //  TS 转译 Done
    let rust_struct_rc = Rc::new(RefCell::new(TestRustClass::new(1)));
    let js_rc_struct: JsRc<TestRustClass> = JsRc::from(Rc::clone(&rust_struct_rc));

    let rt = Runtime::new()?;
    let ctx = rquickjs::Context::full(&rt)?;
    rt.set_loader(
        (BuiltinResolver::default(), FileResolver::default()),
        (ScriptLoader::default(),),
    );

    // rust struct 数据被传递到 JS， JS 可以进行访问修改
    ctx.with(|ctx| -> Result<(), Box<dyn std::error::Error>> {
        let closure_print = Function::new(ctx.clone(), |msg: String| {
            println!("{msg}");
        })?;

        let global = ctx.globals();
        global.set("print", closure_print)?;
        global.set("rustInstance", js_rc_struct)?;

        match Module::evaluate(ctx.clone(), "test", js_script) {
            Ok(result) => match result.finish::<()>().catch(&ctx) {
                Ok(_) => println!("Script executed successfully."),
                Err(e) => eprintln!("Failed to finish script: {:?}", e),
            },
            Err(e) => eprintln!("Failed to evaluate module: {:?}", e),
        }
        Ok(())
    })?;

    // rust struct 数据被更新，并可以访问到
    let rust_struct_from_js = ctx.with(|ctx| {
        let global = ctx.globals();
        global
            .get::<_, JsRc<TestRustClass>>("rustInstance")
            .unwrap()
    });
    println!(
        "Rust Updated value: {:?}",
        rust_struct_from_js.value.borrow().get_value()
    );

    Ok(())
}
