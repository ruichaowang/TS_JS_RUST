use std::{cell::RefCell, rc::Rc};

use rquickjs::{class::Trace, Ctx, FromJs, IntoJs, Result, Value};

// #[derive(Trace)]
pub struct JsRc<T> {
    pub value: Rc<RefCell<T>>,
}

impl<T> JsRc<T> {
    pub fn new(inner: T) -> Self {
        JsRc {
            value: Rc::new(RefCell::new(inner)),
        }
    }

    pub fn clone_inner(&self) -> Rc<RefCell<T>> {
        Rc::clone(&self.value)
    }
}

impl<T> From<Rc<RefCell<T>>> for JsRc<T> {
    fn from(value: Rc<RefCell<T>>) -> Self {
        JsRc { value }
    }
}

impl<'js, T> IntoJs<'js> for JsRc<T>
where
    T: 'js + Trace<'js> + IntoJs<'js> + std::clone::Clone,
{
    fn into_js(self, ctx: &Ctx<'js>) -> rquickjs::Result<rquickjs::Value<'js>> {
        <RefCell<T> as Clone>::clone(&self.value).into_js(ctx)
    }
}

impl<'js, T> FromJs<'js> for JsRc<T>
where
    T: 'js + FromJs<'js>,
{
    fn from_js(ctx: &Ctx<'js>, value: Value<'js>) -> Result<Self> {
        let inner = T::from_js(ctx, value)?;
        Ok(JsRc {
            value: Rc::new(RefCell::new(inner)),
        })
    }
}
