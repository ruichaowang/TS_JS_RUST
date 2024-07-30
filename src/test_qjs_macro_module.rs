#[rquickjs::module]
#[allow(non_upper_case_globals)]
pub mod counter_wrapper {
    #[derive(rquickjs::class::Trace, Clone, Debug)]
    #[rquickjs::class(rename = "TestClass")]
    pub struct TestRustClass {
        value: u32,
    }

    #[rquickjs::methods]
    impl TestRustClass {
        #[qjs(constructor)]
        pub fn new(value: u32) -> TestRustClass {
            TestRustClass { value }
        }

        #[qjs(get, rename = "value")]
        pub fn get_value(&self) -> u32 {
            self.value
        }

        #[qjs(set, rename = "value")]
        pub fn set_value(&mut self, value: u32) {
            self.value = value;
        }

        pub fn increment(&mut self) {
            self.value += 1;
        }

        pub fn decrement(&mut self) {
            self.value -= 1;
        }
    }

    impl Default for TestRustClass {
        fn default() -> Self {
            Self::new(0)
        }
    }
}
