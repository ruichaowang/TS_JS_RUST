extern crate test_type_script;
use std::io::Write;
use test_type_script::{run_tsc, ts_to_js};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Current directory: {}", std::env::current_dir()?.display());

    //1 先静态检查
    let result: std::result::Result<(), anyhow::Error> =
        run_tsc(None, Some("./ts/hello2_tsconfig.json"));
    assert!(result.is_ok(), "Expected the type check to pass");

    //2 convert
    let ts_code = std::fs::read_to_string("./ts/hello2.ts")?;
    let js_converted = ts_to_js("hello", Some(&ts_code))?;
    // let output_path = "/mnt/b9e649fa-9394-476b-a89a-13f4b571aa04/LiGraphic/app/dsldemo/src/demos/samples/hello_world/activity_hello.app2.js";
    let output_path = "./test.ts";
    let mut file = std::fs::File::create(output_path)?;
    file.write_all(js_converted.as_bytes())?;
    println!(
        "JavaScript converted content has been saved to {}",
        output_path
    );

    Ok(())
}
