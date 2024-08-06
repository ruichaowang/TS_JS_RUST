extern crate test_type_script;
use test_type_script::ts_to_js;

/*
Time taken for 10 lines of code: 2.885625ms
Time taken for 100 lines of code: 2.584209ms
Time taken for 1000 lines of code: 27.440292ms
Time taken for 10000 lines of code: 249.579417ms
Time taken for 100000 lines of code: 2.566028959s
*/

/// 测试 SWC 实际转译 JS 所需要的时间
/// https://swc.rs/docs/benchmarks
fn main() {
    for i in [10, 100, 1000, 10000, 100000].iter() {
        let ts_code = (0..*i)
            .map(|j| format!("function func_{}() {{ return {}; }}", j, j))
            .collect::<Vec<_>>()
            .join("\n");

        let start = std::time::Instant::now();
        let _ = ts_to_js(None, Some(&ts_code));
        let duration = start.elapsed();

        println!("Time taken for {} lines of code: {:?}", *i, duration);
    }
}
