pub mod js_rc;
pub mod test_qjs_macro_module;
mod ts_compiler;

use js_rc::JsRc;
use rquickjs::{
    loader::{BuiltinResolver, FileResolver, ScriptLoader},
    CatchResultExt, Function, Module, Runtime,
};
use std::{cell::RefCell, env, fs, rc::Rc, time::Instant};
use test_qjs_macro_module::counter_wrapper::TestRustClass;
use ts_compiler::ts_to_js;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let start_time_swc = Instant::now();
    let current_dir = env::current_dir()?;
    println!("Current directory: {}", current_dir.display());
    let ts_code = fs::read_to_string("./src/main.ts")?;
    let (js_script, sourcemap) = ts_to_js("mian.ts", &ts_code);

    println!("Generated JavaScript:");
    println!("{}\n", js_script);
    println!("Source Map:");
    println!("{}\n", sourcemap);
    println!("swc convert took: {:?}", start_time_swc.elapsed());

    let start_time_rqjs = Instant::now();
    let rust_struct_rc = Rc::new(RefCell::new(TestRustClass::new(1)));
    let js_rc_struct: JsRc<TestRustClass> = JsRc::from(Rc::clone(&rust_struct_rc));

    let rt = Runtime::new()?;
    let ctx = rquickjs::Context::full(&rt)?;
    rt.set_loader(
        (BuiltinResolver::default(), FileResolver::default()),
        (ScriptLoader::default(),),
    );

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
    println!("rqjs took: {:?}", start_time_rqjs.elapsed());

    let rust_struct_from_js = ctx.with(|ctx| {
        ctx.globals()
            .get::<_, JsRc<TestRustClass>>("rustInstance")
            .unwrap()
    });
    println!(
        "Rust Updated value: {:?}",
        rust_struct_from_js.value.borrow().get_value()
    );

    Ok(())
}
