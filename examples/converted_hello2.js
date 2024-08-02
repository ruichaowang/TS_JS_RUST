import { FrameLayoutBuilder, RGBA, set_content, FrameLayout_add_WidgetTrait_with_lp, WidgetTrait_from_FrameLayout, LEFT, CENTER_VERTICAL, TextViewBuilder, CENTER, Bold, FrameLayoutParamsBuilder, WRAP_CONTENT, FrameLayout_add_view_with_lp, WidgetTrait_from_ImageView, ImageViewBuilder, CenterCrop, RIGHT, TOP, BOTTOM, ScaleType_Center } from "ui_system";
console.log("Initialize JS UI demo...");
const createFrameLayout = (parent, color, radius, paddingTop = 0)=>{
    return Object.assign(new FrameLayoutBuilder(parent), {
        background_color: color,
        corner_radius: radius,
        padding_top: paddingTop
    }).js_build_rc_refcell();
};
const addTextView = (layout, parent, text, textColor, textSize, gravity, style, marginTop, marginLeft)=>{
    FrameLayout_add_view_with_lp(layout, Object.assign(new TextViewBuilder(parent), {
        text: text,
        text_color: textColor,
        text_size: textSize,
        gravity: gravity,
        text_style: style
    }).js_build_rc_refcell(), Object.assign(new FrameLayoutParamsBuilder(), {
        width: WRAP_CONTENT,
        height: WRAP_CONTENT,
        margin_top: marginTop,
        margin_left: marginLeft
    }).js_build_rc_refcell());
};
const addImageView = (layout, parent, srcPath, width, height, gravity, imageArgs = {}, layoutArgs = {})=>{
    FrameLayout_add_WidgetTrait_with_lp(layout, WidgetTrait_from_ImageView(Object.assign(new ImageViewBuilder(parent), {
        src_path: srcPath,
        ...imageArgs
    }).js_build_rc_refcell()), Object.assign(new FrameLayoutParamsBuilder(), {
        width: width,
        height: height,
        gravity: gravity,
        ...layoutArgs
    }).js_build_rc_refcell());
};
const rootLayout = createFrameLayout(parent, new RGBA(0xC0, 0xC8, 0xD8, 0xFF), 0);
set_content(activity, rootLayout, [
    2880,
    1380
]);
const root = "/home/lixiang/ligraphic/";
const proj = "app/grt_widget_sdk/platform/android/app/";
const testBitmap = `${root}${proj}src/main/res/drawable/test.jpg`;
console.log("Test bitmap path: " + testBitmap);
const createImageLayout = (parent)=>{
    const layout = createFrameLayout(parent, new RGBA(0xFF, 0xFF, 0xE7, 0xFF), 30, 20);
    FrameLayout_add_WidgetTrait_with_lp(rootLayout, WidgetTrait_from_FrameLayout(layout), Object.assign(new FrameLayoutParamsBuilder(), {
        width: 1415,
        height: 1340,
        margin_left: 20,
        gravity: LEFT | CENTER_VERTICAL
    }).js_build_rc_refcell());
    addTextView(layout, parent, "ImageViews", new RGBA(0x3D, 0x3D, 0x3D, 0xFF), 36, CENTER, Bold, undefined, 20);
    function addImageDemoCase(gravity, text, imageArgs = {}, imageLayoutArgs = {}, textLayoutArgs = {}) {
        addImageView(layout, parent, testBitmap, 640, 480, gravity, imageArgs, imageLayoutArgs);
        addTextView(layout, parent, text, new RGBA(0x3D, 0x3D, 0x3D, 0xFF), 36, gravity, undefined, textLayoutArgs.margin_top, textLayoutArgs.margin_left);
    }
    addImageDemoCase(LEFT | TOP, "FIT_XY", {}, {
        margin_left: 20,
        margin_top: 111
    }, {
        margin_left: 137,
        margin_top: 595
    });
    addImageDemoCase(RIGHT | TOP, "CENTER_CROP", {
        scale_type: CenterCrop
    }, {
        margin_right: 28,
        margin_top: 111
    }, {
        margin_right: 144,
        margin_top: 595
    });
    addImageDemoCase(LEFT | BOTTOM, "CENTER", {
        scale_type: ScaleType_Center
    }, {
        margin_left: 20,
        margin_bottom: 123
    }, {
        margin_left: 137,
        margin_bottom: 48
    });
    addImageDemoCase(RIGHT | BOTTOM, "Round Corner", {
        scale_type: CenterCrop,
        corner_radius: 123
    }, {
        margin_right: 28,
        margin_bottom: 123
    }, {
        margin_right: 144,
        margin_bottom: 48
    });
};
const createTextLayout = (parent)=>{
    const layout = createFrameLayout(parent, new RGBA(0xD5, 0xDD, 0xE7, 0xFF), 30);
    FrameLayout_add_WidgetTrait_with_lp(rootLayout, WidgetTrait_from_FrameLayout(layout), Object.assign(new FrameLayoutParamsBuilder(), {
        width: 1415,
        height: 1340,
        margin_right: 20,
        gravity: RIGHT | CENTER_VERTICAL
    }).js_build_rc_refcell());
    addTextView(layout, parent, "TextViews", new RGBA(0x3D, 0x3D, 0x3D, 0xFF), 36, CENTER, Bold, 20, 20);
    function addTextDemoCase(textViewArgs = {}, top) {
        addTextView(layout, parent, "TextViews", new RGBA(0x3D, 0x3D, 0x3D, 0xFF), 36, LEFT | CENTER_VERTICAL, undefined, top, 20);
    }
    addTextDemoCase({}, 110);
    addTextDemoCase({
        text_size: 48
    }, 228);
    addTextDemoCase({
        text_size: 64,
        text_style: Bold
    }, 358);
    addTextDemoCase({
        text_color: new RGBA(0xE4, 0x18, 0x18, 0xFF),
        text_size: 64,
        text_style: Bold
    }, 488);
    addTextDemoCase({
        text_color: new RGBA(0x18, 0x63, 0xE4, 0xFF),
        text_size: 64,
        text_style: Bold,
        background_color: new RGBA(0xFF, 0x00, 0x00, 0xFF),
        alpha: 0.5,
        visible: true
    }, 628);
};
createImageLayout(parent);
createTextLayout(parent);
