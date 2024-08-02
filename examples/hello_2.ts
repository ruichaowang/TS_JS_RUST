console.log("Initialize JS UI demo...");

// NOTE: Port from main/java/com/lixiang/grt/widget/demo/MainActivity.java in
//	app/grt_widget_sdk/platform/android/app/src/.

import {FrameLayoutBuilder, RGBA, set_content,
	FrameLayout_add_WidgetTrait_with_lp, WidgetTrait_from_FrameLayout,
	LEFT, CENTER_VERTICAL, TextViewBuilder, CENTER, Bold,
	FrameLayoutParamsBuilder, WRAP_CONTENT, FrameLayout_add_view_with_lp,
	WidgetTrait_from_ImageView, ImageViewBuilder, WidgetTrait_from_TextView,
	CenterCrop, RIGHT, TOP, BOTTOM, ScaleType_Center} from "ui_system";

let rootLayout = Object.assign(new FrameLayoutBuilder(parent), {
	background_color: new RGBA(0xC0, 0xC8, 0xD8, 0xFF)
}).js_build_rc_refcell();
set_content(activity, rootLayout, Array(2880, 1380));

// image demo
{
	// image view demo layout
	let imageLayout = Object.assign(new FrameLayoutBuilder(parent), {
		background_color: new RGBA(0xD5, 0xDD, 0xE7, 0xFF),
		corner_radius: 30,
		padding_top: 20
	}).js_build_rc_refcell();
	FrameLayout_add_WidgetTrait_with_lp(rootLayout,
		WidgetTrait_from_FrameLayout(imageLayout),
		Object.assign(new FrameLayoutParamsBuilder(), {
		width: 1415,
		height: 1340,
		margin_left: 20,
		gravity: LEFT | CENTER_VERTICAL
	}).js_build_rc_refcell());

	// image view demo title
	FrameLayout_add_view_with_lp(imageLayout,
		Object.assign(new TextViewBuilder(parent), {
		text: "ImageViews",
		text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
		text_size: 36,
		gravity: CENTER,
		text_style: Bold
	}).js_build_rc_refcell(), Object.assign(new FrameLayoutParamsBuilder(), {
		width: WRAP_CONTENT,
		height: WRAP_CONTENT,
		margin_left: 20
	}).js_build_rc_refcell());

	const root = "/home/lixiang/ligraphic/";
	const proj = "app/grt_widget_sdk/platform/android/app/";
	const testBitmap = root + proj + "src/main/res/drawable/test.jpg";

	console.log("Test bitmap path:" + testBitmap);

	function add_image_demo_case(gravity, text, image_view_args,
		image_layout_args, text_layout_args) {
		FrameLayout_add_WidgetTrait_with_lp(imageLayout,
			WidgetTrait_from_ImageView(
			Object.assign(new ImageViewBuilder(parent), {
				src_path: testBitmap
			}, image_view_args).js_build_rc_refcell()),
			Object.assign(new FrameLayoutParamsBuilder(), {
				width: 640,
				height: 480,
				gravity: gravity
			}, image_layout_args).js_build_rc_refcell()
		);
		FrameLayout_add_WidgetTrait_with_lp(imageLayout,
			WidgetTrait_from_TextView(
			Object.assign(new TextViewBuilder(parent), {
				text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
				text_size: 36,
				gravity: CENTER,
				text: text
			}).js_build_rc_refcell()),
			Object.assign(new FrameLayoutParamsBuilder(), {
				width: 407,
				height: 75,
				gravity: gravity
			}, text_layout_args).js_build_rc_refcell()
		);
	}

	// image view demo fix_xy views
	add_image_demo_case(LEFT | TOP, "FIT_XY", {}, {
		margin_left: 20,
		margin_top: 111
	}, {
		margin_left: 137,
		margin_top: 595
	});
	// image view demo center_crop views
	add_image_demo_case(RIGHT | TOP, "CENTER_CROP", {
		scale_type: CenterCrop
	}, {
		margin_right: 28,
		margin_top: 111
	}, {
		margin_right: 144,
		margin_top: 595
	});

	// image view demo center views
	add_image_demo_case(LEFT | BOTTOM, "CENTER", {
		scale_type: ScaleType_Center
	}, {
		margin_left: 20,
		margin_bottom: 123
	}, {
		margin_left: 137,
		margin_bottom: 48
	});
	// image view demo round corner views
	add_image_demo_case(RIGHT | BOTTOM, "Round Corner", {
		scale_type: CenterCrop,
		corner_radius: 123
	}, {
		margin_right: 28,
		margin_bottom: 123
	}, {
		margin_right: 144,
		margin_bottom: 48
	});
}

// text demo
{
	// image view demo layout
	let imageLayout = Object.assign(new FrameLayoutBuilder(parent), {
		background_color: new RGBA(0xD5, 0xDD, 0xE7, 0xFF),
		corner_radius: 30
	}).js_build_rc_refcell();
	FrameLayout_add_WidgetTrait_with_lp(rootLayout,
		WidgetTrait_from_FrameLayout(imageLayout),
		Object.assign(new FrameLayoutParamsBuilder(), {
		width: 1415,
		height: 1340,
		margin_right: 20,
		gravity: RIGHT | CENTER_VERTICAL
	}).js_build_rc_refcell());

	// text view demo title
	FrameLayout_add_view_with_lp(imageLayout,
		Object.assign(new TextViewBuilder(parent), {
		text: "TextViews",
		text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
		text_size: 36,
		gravity: CENTER,
		text_style: Bold
	}).js_build_rc_refcell(), Object.assign(new FrameLayoutParamsBuilder(), {
		width: WRAP_CONTENT,
		height: WRAP_CONTENT,
		margin_left: 20,
		margin_top: 20
	}).js_build_rc_refcell());

	function add_text_demo_case(text_view_args, top) {
		FrameLayout_add_view_with_lp(imageLayout,
			Object.assign(new TextViewBuilder(parent), {
				text: "TextViews",
				text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
				text_size: 36,
				gravity: LEFT | CENTER_VERTICAL
			}, text_view_args).js_build_rc_refcell(),
			Object.assign(new FrameLayoutParamsBuilder(), {
				width: WRAP_CONTENT,
				height: WRAP_CONTENT,
				margin_left: 20,
				margin_top: top
			}).js_build_rc_refcell()
		);
	}

	// base textview
	add_text_demo_case({}, 110);
	// text size
	add_text_demo_case({
		text_size: 48
	}, 228);
	// typeface
	add_text_demo_case({
		text_size: 64,
		text_style: Bold
	}, 358);
	// text color
	add_text_demo_case({
		text_color: new RGBA(0xE4, 0x18, 0x18, 0xFF),
		text_size: 64,
		text_style: Bold
	}, 488);
	// text color + background
	add_text_demo_case({
		text_color: new RGBA(0x18, 0x63, 0xE4, 0xFF),
		text_size: 64,
		text_style: Bold,
		background_color: new RGBA(0xFF, 0x00, 0x00, 0xFF),
        //textView5.setId(R.id.text_view5)
        alpha: 0.5,
		visible: true
	}, 628);
}

