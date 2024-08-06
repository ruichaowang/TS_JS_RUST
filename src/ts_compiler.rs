use std::{path::Path, sync::Arc};
use swc::{config::IsModule, Compiler, PrintArgs};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, Mark, SourceMap, GLOBALS,
};
use swc_ecma_visit::FoldWith;

/// Transforms TypeScript to JavaScript. Returns tuple (js string, source map)
/// 优先读取路径下的文件，如果没有则读取代码
pub fn ts_to_js(file_path: Option<&str>, ts_code: Option<&str>) -> Result<String, anyhow::Error> {
    let cm: Arc<SourceMap> = Arc::new(Default::default());
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));
    let compiler = Compiler::new(cm.clone());

    let fm = if let Some(path) = file_path {
        cm.load_file(Path::new(path)).expect("failed to load file")
    } else if let Some(code) = ts_code {
        cm.new_source_file(
            Arc::new(FileName::Custom("no_file".to_string())),
            code.into(),
        )
    } else {
        return Err(anyhow::anyhow!("Both filename and ts_code cannot be None"));
    };

    GLOBALS.set(&Default::default(), || {
        let program = compiler.parse_js(
            fm,
            &handler,
            swc_ecma_ast::EsVersion::Es2015,
            swc_ecma_parser::Syntax::Typescript(Default::default()),
            IsModule::Bool(true),
            Some(compiler.comments()),
        )?;

        let program = program.fold_with(&mut swc_ecma_transforms_typescript::strip(
            Mark::new(),
            Mark::new(),
        ));

        let output = compiler.print(&program, PrintArgs::default())?;
        Ok(output.code)
    })
}

#[cfg(test)]
#[deny(warnings)]
mod tests {
    use super::*;
    use pretty_assertions::assert_eq;

    fn normalize_string(s: &str) -> String {
        s.split_whitespace().collect()
    }

    //let ts_code = std::fs::read_to_string("./ts/hello2.ts")?;
    #[test]
    fn test_ts_to_js() {
        let ts_code = r#"
        function add(a: number, b: number): number {
            return a + b;
        }
        "#;
        let js_result = ts_to_js(None, Some(ts_code));
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

        let js_result = ts_to_js(None, Some(ts_code));
        assert!(js_result.is_ok(), "Expected successful translation");

        if let Ok(js_code) = js_result {
            assert_eq!(js_code, "");
        }
    }
}
