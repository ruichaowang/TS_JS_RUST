use std::{env, fs, time::Instant};

use ts_compiler::ts_to_js;

mod ts_compiler;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let start_time_swc = Instant::now();
    let current_dir = env::current_dir()?;
    println!("Current directory: {}", current_dir.display());
    // let ts_code = fs::read_to_string("./src/main.ts")?;
    let ts_code = fs::read_to_string("./main.ts")?;
    let (js_script, sourcemap) = ts_to_js("mian.ts", &ts_code);

    println!("Generated JavaScript:");
    println!("{}\n", js_script);
    println!("Source Map:");
    println!("{}\n", sourcemap);
    println!("swc convert took: {:?}", start_time_swc.elapsed());

    Ok(())
}
