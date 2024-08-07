use std::process::Command;

fn main() {
    // 示例：运行外部命令（例如：TypeScript 编译器 tsc）
    let output = Command::new("tsc")
        .arg("--project")
        .arg("./ts/hello2_tsconfig.json")
        .output()
        .expect("Failed to run tsc");

    if !output.status.success() {
        // 捕获标准输出和标准错误输出
        let stderr = String::from_utf8_lossy(&output.stderr);
        let stdout = String::from_utf8_lossy(&output.stdout);

        // 打印 TypeScript 编译错误信息
        println!("cargo:warning=TypeScript compilation failed");
        println!("cargo:warning=stderr: {}", stderr);
        println!("cargo:warning=stdout: {}", stdout);
        // 退出构建脚本
        panic!("TypeScript compilation failed");
    }

    // 使用 Cargo 指令通知编译器何时重新运行此构建脚本
    println!("cargo:rerun-if-changed=ts/*.ts");
    println!("cargo:rerun-if-changed=ts/hello2_tsconfig.json");
}
