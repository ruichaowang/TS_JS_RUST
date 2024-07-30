use swc::{config::IsModule, Compiler, PrintArgs};
use swc_common::FileName;
use swc_common::{errors::Handler, source_map::SourceMap, sync::Lrc, Mark, GLOBALS};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::Syntax;
use swc_ecma_transforms_typescript::strip;
use swc_ecma_visit::FoldWith;

use std::io;

/// Transforms TypeScript to JavaScript. Returns tuple (js string, source map)
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

        // Transform theProgram
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
