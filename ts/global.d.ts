declare module "ui_system" {
    interface Parent { }
    interface Activity { }

    const parent: Parent;
    const activity: Activity;
    // 主布局和视图构建相关类和常量
    export class FrameLayoutBuilder {
        constructor(parent: Parent);
        background_color: RGBA;
        corner_radius: number;
        padding_top: number;
        js_build_rc_refcell(): any;
    }

    export class FrameLayoutParamsBuilder {
        width: number;
        height: number;
        margin_left?: number;
        margin_right?: number;
        margin_top?: number;
        margin_bottom?: number;
        gravity?: number;
        js_build_rc_refcell(): any;
    }

    export function set_content(activity: Activity, rootLayout: any, dimensions: Array<number>): void;

    export function FrameLayout_add_WidgetTrait_with_lp(layout: any, widgetTrait: any, layoutParams: any): void;
    export function WidgetTrait_from_FrameLayout(frameLayout: any): any;
    export function FrameLayout_add_view_with_lp(layout: any, view: any, layoutParams: any): void;

    // 常量声明
    export const LEFT: number;
    export const CENTER_VERTICAL: number;
    export const CENTER: number;
    export const Bold: number;
    export const RIGHT: number;
    export const TOP: number;
    export const BOTTOM: number;
    export const WRAP_CONTENT: number;

    // 样式和颜色相关类和常量
    export class RGBA {
        constructor(r: number, g: number, b: number, a: number);
    }

    export const CenterCrop: any;
    export const ScaleType_Center: any;

    // 文本视图相关类
    export class TextViewBuilder {
        constructor(parent: Parent);
        text: string;
        text_color: RGBA;
        text_size: number;
        gravity: number;
        text_style: number;
        js_build_rc_refcell(): any;
    }

    export function WidgetTrait_from_TextView(textView: any): any;

    // 图片视图相关类
    export class ImageViewBuilder {
        constructor(parent: Parent);
        src_path: string;
        scale_type?: any;
        corner_radius?: number;
        js_build_rc_refcell(): any;
    }

    export function WidgetTrait_from_ImageView(imageView: any): any;
}