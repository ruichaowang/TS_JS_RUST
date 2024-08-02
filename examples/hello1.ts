console.log("Initialize JS UI...");

import {FrameLayoutBuilder, TextViewBuilder,
	HorizontalAlign_Center, VerticalAlign_Center, Regular,
	FrameLayout_add_view_with_lp, FrameLayoutParamsBuilder,
	WRAP_CONTENT, CENTER, set_content} from "ui_system";

let frame_layout_1
	= Object.assign(new FrameLayoutBuilder(parent), {
	background_drawable_res: bg_weather_empty,
	corner_radius: 20.0
}).js_build_rc_refcell();

FrameLayout_add_view_with_lp(frame_layout_1,
	Object.assign(new TextViewBuilder(parent), {
		text: "Hello World (Click me to load)",
		font_size: 36.0,
		h_align: HorizontalAlign_Center,
		v_align: VerticalAlign_Center,
		text_style: Regular,
		background_drawable_res: bg_red,
		on_click: click_listener
	}).js_build_rc_refcell(),
	Object.assign(new FrameLayoutParamsBuilder(), {
	width: WRAP_CONTENT,
	height: WRAP_CONTENT,
	gravity: CENTER
}).js_build_rc_refcell());
set_content(activity, frame_layout_1, Array(2880, 1620));
