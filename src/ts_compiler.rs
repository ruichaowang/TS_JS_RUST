use std::io::Write;

use anyhow::{Context, Result};
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
pub fn ts_to_js(filename: &str, ts_code: &str) -> Result<String, anyhow::Error> {
    let temp_file = TempFile::new(ts_code)?;
    run_tsc(&temp_file)?;

    let cm: Lrc<SourceMap> = Lrc::new(SourceMap::default());
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));
    let compiler = Compiler::new(cm.clone());

    let fm = cm.new_source_file(
        Lrc::new(FileName::Custom(filename.into())),
        ts_code.to_string(),
    );

    GLOBALS.set(&Default::default(), || {
        let program = compiler.parse_js(
            fm,
            &handler,
            swc_ecma_ast::EsVersion::Es2020,
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

// 使用 UUID 生成唯一文件名
fn generate_unique_filename() -> String {
    format!("temp_file_{}.ts", uuid::Uuid::new_v4())
}

// 结构体用于自动管理临时文件
struct TempFile {
    path: String,
}

impl TempFile {
    fn new(ts_code: &str) -> Result<Self> {
        let path = generate_unique_filename();

        // 写入 TypeScript 代码到临时文件
        let mut file = std::fs::File::create(&path)
            .with_context(|| format!("Unable to create temp file: {}", path))?;
        file.write_all(ts_code.as_bytes())
            .with_context(|| format!("Unable to write to temp file: {}", path))?;

        Ok(Self { path })
    }
}

impl Drop for TempFile {
    fn drop(&mut self) {
        if let Err(e) = std::fs::remove_file(&self.path) {
            eprintln!("Failed to delete temp file {}: {}", self.path, e);
        }
    }
}

/// 为了静态检查 TypeScript 代码，我们需要使用 tsc 命令行工具
fn run_tsc(temp_file: &TempFile) -> Result<()> {
    let output = std::process::Command::new("tsc")
        .arg("--noEmit") // 只进行类型检查，不生成输出文件
        .arg(&temp_file.path)
        .output()
        .with_context(|| format!("Failed to start tsc for file: {}", temp_file.path))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);
        eprintln!("tsc stderr: {}", stderr);
        eprintln!("tsc stdout: {}", stdout);
        return Err(anyhow::anyhow!(
            "TypeScript type check error: {}\n{}",
            stderr,
            stdout
        ));
    }
    Ok(())
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
    fn test_run_tsc_valid_code() {
        let ts_code = r#"
        function add(a: number, b: number): number {
            return a + b;
        }
        "#;

        let temp_file = TempFile::new(ts_code).unwrap();

        let result: std::result::Result<(), anyhow::Error> = run_tsc(&temp_file);
        assert!(result.is_ok(), "Expected the type check to pass");
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

    /// 需要用静态检查 SWC 检查作物
    #[test]
    fn test_invalid_code() {
        let ts_code = r#"
        function add(a: number, b: number): number {
            return a + 
        }
        "#;

        let js_result = ts_to_js("test.ts", ts_code);
        assert!(js_result.is_err(), "Expected translation to fail");

        if let Err(error) = js_result {
            assert!(
                error.to_string().contains("Expression expected"),
                "Unexpected error message: {}",
                error
            );
        }
    }

    #[test]
    fn test_type_error() {
        let ts_code = r#"
        function add(a: number, b: number): string {
            return a + b;
        }
        "#;

        let js_result = ts_to_js("test.ts", ts_code);
        assert!(js_result.is_err(), "Expected translation to fail");

        if let Err(error) = js_result {
            eprintln!("Full Error: {:?}", error); // 打印完整的错误信息
            assert!(
                error.to_string().contains("TypeScript type check error"),
                "Unexpected error message"
            );
        }
    }

    #[test]
    fn test_missing_parameter() {
        let ts_code = r#"
        function add(a: number, b: number): number {
            return a + b;
        }
    
        const result = add(10);
        "#;

        let js_result = ts_to_js("test.ts", ts_code);
        assert!(js_result.is_err(), "Expected translation to fail");

        if let Err(error) = js_result {
            // assert!(error.to_string().contains("Syntax Error"), "Unexpected error message");
            assert!(
                error.to_string().contains("TypeScript type check error"),
                "Unexpected error message"
            );
        }
    }
}
