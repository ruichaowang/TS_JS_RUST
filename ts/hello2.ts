interface Parent { }
interface Activity { }

declare const parent: Parent;
declare const activity: Activity;
import {
    FrameLayoutBuilder, RGBA, set_content,
    FrameLayout_add_WidgetTrait_with_lp, WidgetTrait_from_FrameLayout,
    LEFT, CENTER_VERTICAL, TextViewBuilder, CENTER, Bold,
    FrameLayoutParamsBuilder, WRAP_CONTENT, FrameLayout_add_view_with_lp,
    WidgetTrait_from_ImageView, ImageViewBuilder, WidgetTrait_from_TextView,
    CenterCrop, RIGHT, TOP, BOTTOM, ScaleType_Center
} from "ui_system";

// Constants for the demo
const root = "/home/lixiang/ligraphic/";
const proj = "app/grt_widget_sdk/platform/android/app/";
const testBitmap = root + proj + "src/main/res/drawable/test.jpg";
class DemoBase {
    protected parent: Parent;

    constructor(parent: Parent) {
        this.parent = parent;
    }

    protected createFrameLayout(color: RGBA, radius = 0, paddingTop = 0): any {
        return Object.assign(new FrameLayoutBuilder(this.parent), {
            background_color: color,
            corner_radius: radius,
            padding_top: paddingTop
        }).js_build_rc_refcell();
    }

    protected addTitleTextView(layout: any, text: string): void {
        FrameLayout_add_view_with_lp(layout,
            Object.assign(new TextViewBuilder(this.parent), {
                text: text,
                text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
                text_size: 36,
                gravity: CENTER,
                text_style: Bold
            }).js_build_rc_refcell(), Object.assign(new FrameLayoutParamsBuilder(), {
                width: WRAP_CONTENT,
                height: WRAP_CONTENT,
                margin_left: 20
            }).js_build_rc_refcell());
    }

    protected addImageDemoCase(
        layout: any, gravity: number, text: string,
        image_view_args: object, image_layout_args: object, text_layout_args: object): void {

        FrameLayout_add_WidgetTrait_with_lp(layout,
            WidgetTrait_from_ImageView(
                Object.assign(new ImageViewBuilder(this.parent), {
                    src_path: testBitmap
                }, image_view_args).js_build_rc_refcell()
            ),
            Object.assign(new FrameLayoutParamsBuilder(), {
                width: 640,
                height: 480,
                gravity: gravity
            }, image_layout_args).js_build_rc_refcell()
        );
        FrameLayout_add_WidgetTrait_with_lp(layout,
            WidgetTrait_from_TextView(
                Object.assign(new TextViewBuilder(this.parent), {
                    text_color: new RGBA(0x3D, 0x3D, 0x3D, 0xFF),
                    text_size: 36,
                    gravity: CENTER,
                    text: text
                }).js_build_rc_refcell()
            ),
            Object.assign(new FrameLayoutParamsBuilder(), {
                width: 407,
                height: 75,
                gravity: gravity
            }, text_layout_args).js_build_rc_refcell()
        );
    }

    protected addTextDemoCase(
        layout: any, text_view_args: object, top: number): void {

        FrameLayout_add_view_with_lp(layout,
            Object.assign(new TextViewBuilder(this.parent), {
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
            }).js_build_rc_refcell());
    }
}

class ImageDemo extends DemoBase {
    private rootLayout: any;

    constructor(parent: Parent, rootLayout: any) {
        super(parent);
        this.rootLayout = rootLayout;
    }

    addImageDemo(): void {
        let imageLayout = this.createFrameLayout(new RGBA(0xFF, 0xDD, 0xE7, 0xFF), 30, 20);

        FrameLayout_add_WidgetTrait_with_lp(this.rootLayout,
            WidgetTrait_from_FrameLayout(imageLayout),
            Object.assign(new FrameLayoutParamsBuilder(), {
                width: 1415,
                height: 1340,
                margin_left: 20,
                gravity: LEFT | CENTER_VERTICAL
            }).js_build_rc_refcell());

        this.addTitleTextView(imageLayout, "ImageViews");

        // Add various image demo cases
        this.addImageDemoCase(imageLayout, LEFT | TOP, "FIT_XY", {}, { margin_left: 20, margin_top: 111 }, { margin_left: 137, margin_top: 595 });
        this.addImageDemoCase(imageLayout, RIGHT | TOP, "CENTER_CROP", { scale_type: CenterCrop }, { margin_right: 28, margin_top: 111 }, { margin_right: 144, margin_top: 595 });
        this.addImageDemoCase(imageLayout, LEFT | BOTTOM, "CENTER", { scale_type: ScaleType_Center }, { margin_left: 20, margin_bottom: 123 }, { margin_left: 137, margin_bottom: 48 });
        this.addImageDemoCase(imageLayout, RIGHT | BOTTOM, "Round Corner", { scale_type: CenterCrop, corner_radius: 123 }, { margin_right: 28, margin_bottom: 123 }, { margin_right: 144, margin_bottom: 48 });
    }
}

class TextDemo extends DemoBase {
    private rootLayout: any;

    constructor(parent: Parent, rootLayout: any) {
        super(parent);
        this.rootLayout = rootLayout;
    }

    addTextDemo(): void {
        let textLayout = this.createFrameLayout(new RGBA(0xD5, 0xFF, 0xE7, 0xFF), 30);

        FrameLayout_add_WidgetTrait_with_lp(this.rootLayout,
            WidgetTrait_from_FrameLayout(textLayout),
            Object.assign(new FrameLayoutParamsBuilder(), {
                width: 1415,
                height: 1340,
                margin_right: 20,
                gravity: RIGHT | CENTER_VERTICAL
            }).js_build_rc_refcell());

        this.addTitleTextView(textLayout, "TextViews");

        // Add various text demo cases
        this.addTextDemoCase(textLayout, {}, 110);
        this.addTextDemoCase(textLayout, { text_size: 48 }, 228);
        this.addTextDemoCase(textLayout, { text_size: 64, text_style: Bold }, 358);
        this.addTextDemoCase(textLayout, { text_color: new RGBA(0xE4, 0x18, 0x18, 0xFF), text_size: 64, text_style: Bold }, 488);
        this.addTextDemoCase(textLayout, { text_color: new RGBA(0x18, 0x63, 0xE4, 0xFF), text_size: 64, text_style: Bold, background_color: new RGBA(0xFF, 0x00, 0x00, 0xFF), alpha: 0.5, visible: true }, 628);
    }
}

// Initialize root layout
function initializeRootLayout(parent: Parent, activity: Activity): any {
    let rootLayout = Object.assign(new FrameLayoutBuilder(parent), {
        background_color: new RGBA(0xC0, 0xC8, 0xFF, 0xFF)
    }).js_build_rc_refcell();
    set_content(activity, rootLayout, Array(2880, 1380));
    return rootLayout;
}

// Main function to initialize the UI
function main(parent: Parent, activity: Activity): void {
    let rootLayout = initializeRootLayout(parent, activity);
    const textDemo = new TextDemo(parent, rootLayout);
    textDemo.addTextDemo();
    const imageDemo = new ImageDemo(parent, rootLayout);
    imageDemo.addImageDemo();
}

// Call the main function with appropriate arguments (parent and activity)
main(parent, activity);
