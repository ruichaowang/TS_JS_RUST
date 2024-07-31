export { };

interface RustInstanceExample {
    value: number;
    increment(): void;
    decrement(): void;
}

declare global {
    function print(message: string): void;
    var rustInstance: RustInstanceExample;
}

try {
    print(`Initial Vaule = ${rustInstance.value}`);
    rustInstance.value = 5;
    print(`Updated value = ${rustInstance.value}`);
    rustInstance.increment();
    print(`Incremented value = ${rustInstance.value}`);
    rustInstance.decrement();
    print(`Decremented value = ${rustInstance.value}`);
} catch (e) {
    print(`JavaScript Error: ${e.stack}`);
    throw e;  // Re-throw to allow Rust to capture the exception
}