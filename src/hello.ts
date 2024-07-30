interface Args {
    name: string;
 }

function hello(param: Args) {
    print(`hello ${param.name} from typescript!`);
}

hello({ name: "World" });
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