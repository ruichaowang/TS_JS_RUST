import { FrameLayoutBuilder, RGBA, set_content, FrameLayout_add_WidgetTrait_with_lp, WidgetTrait_from_FrameLayout, LEFT, CENTER_VERTICAL, TextViewBuilder, CENTER, Regular, FrameLayoutParamsBuilder, WRAP_CONTENT, FrameLayout_add_view_with_lp, WidgetTrait_from_ImageView, ImageViewBuilder, WidgetTrait_from_TextView, CenterCrop, RIGHT, TOP, BOTTOM, ScaleType_Center } from "ui_system";
const root = "/home/lixiang/ligraphic/";
const proj = "app/grt_widget_sdk/platform/android/app/";
const testBitmap = root + proj + "src/main/res/drawable/test.jpg";
class DemoBase {
    parent;
    constructor(parent){
        this.parent = parent;
    }
    createFrameLayout(color, radius = 0, paddingTop = 0) {
        return Object.assign(new FrameLayoutBuilder(this.parent), {
            background_color: color,
            corner_radius: radius,
            padding_top: paddingTop
        }).js_build_rc_refcell();
    }
    addTitleTextView(layout, text) {
        FrameLayout_add_view_with_lp(layout, Object.assign(new TextViewBuilder(this.parent), {
            text: text,
            text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
            text_size: 36,
            gravity: CENTER,
            text_style: Regular
        }).js_build_rc_refcell(), Object.assign(new FrameLayoutParamsBuilder(), {
            width: WRAP_CONTENT,
            height: WRAP_CONTENT,
            margin_left: 20
        }).js_build_rc_refcell());
    }
    addImageDemoCase(layout, gravity, text, image_view_args, image_layout_args, text_layout_args) {
        FrameLayout_add_WidgetTrait_with_lp(layout, WidgetTrait_from_ImageView(Object.assign(new ImageViewBuilder(this.parent), {
            src_path: testBitmap
        }, image_view_args).js_build_rc_refcell()), Object.assign(new FrameLayoutParamsBuilder(), {
            width: 640,
            height: 480,
            gravity: gravity
        }, image_layout_args).js_build_rc_refcell());
        FrameLayout_add_WidgetTrait_with_lp(layout, WidgetTrait_from_TextView(Object.assign(new TextViewBuilder(this.parent), {
            text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
            text_size: 36,
            gravity: CENTER,
            text: text
        }).js_build_rc_refcell()), Object.assign(new FrameLayoutParamsBuilder(), {
            width: 407,
            height: 75,
            gravity: gravity
        }, text_layout_args).js_build_rc_refcell());
    }
    addTextDemoCase(layout, text_view_args, top) {
        FrameLayout_add_view_with_lp(layout, Object.assign(new TextViewBuilder(this.parent), {
            text: "TextViews",
            text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
            text_size: 36,
            gravity: LEFT | CENTER_VERTICAL
        }, text_view_args).js_build_rc_refcell(), Object.assign(new FrameLayoutParamsBuilder(), {
            width: WRAP_CONTENT,
            height: WRAP_CONTENT,
            margin_left: 20,
            margin_top: top
        }).js_build_rc_refcell());
    }
}
class ImageDemo extends DemoBase {
    rootLayout;
    constructor(parent, rootLayout){
        super(parent);
        this.rootLayout = rootLayout;
    }
    addImageDemo() {
        let imageLayout = this.createFrameLayout(new RGBA(0xFF, 0xDD, 0xE7, 0xFF), 30, 20);
        FrameLayout_add_WidgetTrait_with_lp(this.rootLayout, WidgetTrait_from_FrameLayout(imageLayout), Object.assign(new FrameLayoutParamsBuilder(), {
            width: 1415,
            height: 1340,
            margin_left: 20,
            gravity: LEFT | CENTER_VERTICAL
        }).js_build_rc_refcell());
        this.addTitleTextView(imageLayout, "ImageViews");
        this.addImageDemoCase(imageLayout, LEFT | TOP, "FIT_XY", {}, {
            margin_left: 20,
            margin_top: 111
        }, {
            margin_left: 137,
            margin_top: 595
        });
        this.addImageDemoCase(imageLayout, RIGHT | TOP, "CENTER_CROP", {
            scale_type: CenterCrop
        }, {
            margin_right: 28,
            margin_top: 111
        }, {
            margin_right: 144,
            margin_top: 595
        });
        this.addImageDemoCase(imageLayout, LEFT | BOTTOM, "CENTER", {
            scale_type: ScaleType_Center
        }, {
            margin_left: 20,
            margin_bottom: 123
        }, {
            margin_left: 137,
            margin_bottom: 48
        });
        this.addImageDemoCase(imageLayout, RIGHT | BOTTOM, "Round Corner", {
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
}
class TextDemo extends DemoBase {
    rootLayout;
    constructor(parent, rootLayout){
        super(parent);
        this.rootLayout = rootLayout;
    }
    addTextDemo() {
        let textLayout = this.createFrameLayout(new RGBA(0xD5, 0xFF, 0xE7, 0xFF), 30);
        FrameLayout_add_WidgetTrait_with_lp(this.rootLayout, WidgetTrait_from_FrameLayout(textLayout), Object.assign(new FrameLayoutParamsBuilder(), {
            width: 1415,
            height: 1340,
            margin_right: 20,
            gravity: RIGHT | CENTER_VERTICAL
        }).js_build_rc_refcell());
        this.addTitleTextView(textLayout, "TextViews");
        this.addTextDemoCase(textLayout, {}, 110);
        this.addTextDemoCase(textLayout, {
            text_size: 48
        }, 228);
        this.addTextDemoCase(textLayout, {
            text_size: 64,
            text_style: Regular
        }, 358);
        this.addTextDemoCase(textLayout, {
            text_color: new RGBA(0xE4, 0x18, 0x18, 0xFF),
            text_size: 64,
            text_style: Regular
        }, 488);
        this.addTextDemoCase(textLayout, {
            text_color: new RGBA(0x18, 0x63, 0xE4, 0xFF),
            text_size: 64,
            text_style: Regular,
            background_color: new RGBA(0xFF, 0x00, 0x00, 0xFF),
            alpha: 0.5,
            visible: true
        }, 628);
    }
}
function initializeRootLayout(parent, activity) {
    let rootLayout = Object.assign(new FrameLayoutBuilder(parent), {
        background_color: new RGBA(0xC0, 0xC8, 0xFF, 0xFF)
    }).js_build_rc_refcell();
    set_content(activity, rootLayout, Array(2880, 1380));
    return rootLayout;
}
function main(parent, activity) {
    let rootLayout = initializeRootLayout(parent, activity);
    const textDemo = new TextDemo(parent, rootLayout);
    textDemo.addTextDemo();
    const imageDemo = new ImageDemo(parent, rootLayout);
    imageDemo.addImageDemo();
}
main(parent, activity);
