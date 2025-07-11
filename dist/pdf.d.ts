import { jsPDF } from "jspdf";
import type { TextConfig, PaddingConfig, InsertTextParams, EChartsInstance, BlockConfig, PreparedImage } from "./types.ts";
export declare const STYLES: {
    h1: {
        size: number;
    };
    h2: {
        size: number;
    };
    h3: {
        size: number;
    };
    h4: {
        size: number;
    };
    h5: {
        size: number;
    };
    h6: {
        size: number;
    };
    body2: {
        size: number;
    };
};
type RichText = Array<string | (TextConfig & PaddingConfig & {
    text: string;
})>;
export declare function prepareImage(image: string): Promise<PreparedImage>;
export declare class PDF {
    doc: jsPDF;
    y: number;
    headerImage?: PreparedImage;
    constructor();
    addNum(): void;
    addPage(): void;
    computePadding(config?: PaddingConfig): number[];
    addParagraph(text: string, config?: TextConfig & PaddingConfig): void;
    addRichText(text: RichText, baseConfig: TextConfig & PaddingConfig): void;
    addHead(image?: string, url?: string, width?: number): void;
    insertBar(value: number, maxValue: number, topLeft: [number, number], width: number, config?: PaddingConfig): [number, () => void];
    addHR(baseConfig?: PaddingConfig & {
        color?: string;
    }): void;
    richTextLayout(text: RichText, topLeft: [number, number], width: number, baseConfig?: TextConfig): InsertTextParams[];
    insertText(text: string, topLeft: [number, number], width: number, config?: TextConfig & PaddingConfig): [number, () => void];
    addTable(contents: Array<Array<(positioning: [number, number, number]) => [number, () => void]>>, widths: Array<number | null>, config?: BlockConfig): void;
    drawBackgroundAndBorder(x: number, y: number, width: number, height: number, config?: BlockConfig): void;
    addBlock(f: (positioning: [number, number, number]) => [number, () => void], config?: BlockConfig): void;
    save(name?: string): void;
    addImage(img: HTMLImageElement, format: string, height?: number, width?: number): void;
    addEchart(instance: EChartsInstance, w?: number, h?: number): Promise<void>;
}
export {};
