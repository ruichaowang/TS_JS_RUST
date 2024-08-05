use swc::{config::IsModule, Compiler, PrintArgs};
use swc_common::{
    errors::{ColorConfig, Handler},
    source_map::SourceMap,
    sync::Lrc,
    FileName, Mark, GLOBALS,
};
use swc_ecma_visit::FoldWith;

/// Transforms TypeScript to JavaScript. Returns tuple (js string, source map)
/// 当前参数使用的是默认参数
pub fn ts_to_js(filename: &str, ts_code: &str) -> Result<String, String> {
    let cm: Lrc<SourceMap> = Lrc::new(SourceMap::default());
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));
    let compiler = Compiler::new(cm.clone());

    let fm = cm.new_source_file(
        Lrc::new(FileName::Custom(filename.into())),
        ts_code.to_string(),
    );

    return GLOBALS.set(&Default::default(), || {
        let program = match compiler.parse_js(
            fm,
            &handler,
            swc_ecma_ast::EsVersion::Es2020,
            swc_ecma_parser::Syntax::Typescript(Default::default()),
            IsModule::Bool(true),
            Some(compiler.comments()),
        ) {
            Ok(program) => program,
            Err(err) => return Err(format!("parse_js failed: {}", err)),
        };

        let program = program.fold_with(&mut swc_ecma_transforms_typescript::strip(
            Mark::new(),
            Mark::new(),
        ));

        match compiler.print(&program, PrintArgs::default()) {
            Ok(ret) => Ok(ret.code),
            Err(err) => Err(format!("print failed: {}", err)),
        }
    });
}

#[cfg(test)]
#[deny(warnings)]
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
        let js_result = ts_to_js("test.ts", ts_code);
        assert!(js_result.is_ok(), "Expected successful translation");

        let expected_js_code = r#"
        function add(a, b) {
            return a + b;
        }
        "#;

        if let Ok(js_code) = js_result {
            assert_eq!(
                normalize_string(js_code.trim()),
                normalize_string(expected_js_code.trim())
            );
        }
    }

    #[test]
    fn test_empty_code() {
        let ts_code = "";

        let js_result = ts_to_js("test.ts", ts_code);
        assert!(js_result.is_ok(), "Expected successful translation");

        if let Ok(js_code) = js_result {
            assert_eq!(js_code, "");
        }
    }

    #[test]
    fn test_invalid_code() {
        let ts_code = r#"
        function add(a: number, b: number): number {
            return a + 
        }
        "#;

        let js_result = ts_to_js("test.ts", ts_code);
        assert!(js_result.is_err(), "Expected translation to fail");

        if let Err(error_message) = js_result {
            assert!(
                error_message.contains("parse_js failed"),
                "Unexpected error message"
            );
        }
    }
}
