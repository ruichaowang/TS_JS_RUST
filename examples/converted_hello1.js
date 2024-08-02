console.log("Initialize JS UI...");
import { FrameLayoutBuilder, TextViewBuilder, HorizontalAlign_Center, VerticalAlign_Center, Regular, FrameLayout_add_view_with_lp, FrameLayoutParamsBuilder, WRAP_CONTENT, CENTER, set_content } from "ui_system";
const createFrameLayout = (parent, bgDrawable, radius) => {
    return Object.assign(new FrameLayoutBuilder(parent), {
        background_drawable_res: bgDrawable,
        corner_radius: radius
    }).js_build_rc_refcell();
};
const createTextView = (parent, text, fontSize, bgDrawable, onClick) => {
    return Object.assign(new TextViewBuilder(parent), {
        text: text,
        font_size: fontSize,
        h_align: HorizontalAlign_Center,
        v_align: VerticalAlign_Center,
        text_style: Regular,
        background_drawable_res: bgDrawable,
        on_click: onClick
    }).js_build_rc_refcell();
};
const createLayoutParams = (width, height, gravity) => {
    return Object.assign(new FrameLayoutParamsBuilder(), {
        width: width,
        height: height,
        gravity: gravity
    }).js_build_rc_refcell();
};
const frame_layout = createFrameLayout(parent, bg_weather_empty, 20.0);
const text_view = createTextView(parent, "Hello World (Click me to load)", 36.0, bg_red, click_listener);
const layout_params = createLayoutParams(WRAP_CONTENT, WRAP_CONTENT, CENTER);
FrameLayout_add_view_with_lp(frame_layout, text_view, layout_params);
set_content(activity, frame_layout, [
    2880,
    1620
]);
