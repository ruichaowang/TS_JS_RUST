use swc::{config::IsModule, Compiler, PrintArgs};
use swc_common::FileName;
use swc_common::{errors::Handler, source_map::SourceMap, sync::Lrc, Mark, GLOBALS};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::FoldWith;

use std::io;

/// Transforms TypeScript to JavaScript. Returns tuple (js string, source map)
/// 当前参数使用的是默认参数
pub fn ts_to_js(filename: &str, ts_code: &str) -> (String, String) {
    let cm = Lrc::new(SourceMap::new(swc_common::FilePathMapping::empty()));

    let compiler = Compiler::new(cm.clone());

    let source = cm.new_source_file(
        Lrc::new(FileName::Custom(filename.into())),
        ts_code.to_string(),
    );

    let handler = Handler::with_emitter_writer(Box::new(io::stderr()), Some(compiler.cm.clone()));

    return GLOBALS.set(&Default::default(), || {
        let res = compiler
            .parse_js(
                source,
                &handler,
                EsVersion::Es2020,
                Syntax::Typescript(Default::default()),
                IsModule::Bool(true),
                Some(compiler.comments()),
            )
            .expect("parse_js failed");

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

#[cfg(test)]
mod tests {
    use super::*;
    use pretty_assertions::assert_eq;

    fn normalize_string(s: &str) -> String {
        s.split_whitespace().collect()
    }

    #[test]
    fn test_ts_to_js() {
        let ts_code = r#"
        function add(a: number, b: number): number {
            return a + b;
        }
        "#;
        let (js_code, source_map) = ts_to_js("test.ts", ts_code);

        let expected_js_code = r#"
        function add(a, b) {
            return a + b;
        }
        "#;

        assert_eq!(
            normalize_string(js_code.trim()),
            normalize_string(expected_js_code.trim())
        );
        assert!(!source_map.is_empty(), "Source map should not be empty");
    }

    #[test]
    fn test_empty_code() {
        let ts_code = "";
        let (js_code, source_map) = ts_to_js("test.ts", ts_code);
        assert_eq!(js_code, "");
        assert!(!source_map.is_empty(), "Source map should not be empty");
    }
}
