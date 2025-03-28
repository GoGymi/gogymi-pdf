import { jsPDF } from "jspdf";
import type { TextConfig, PaddingConfig, InsertTextParams, EChartsInstance } from "./types.ts";
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
type RichText = Array<string | TextConfig & {
    text: string;
}>;
export declare class PDF {
    doc: jsPDF;
    y: number;
    constructor();
    addPage(justNum?: boolean): void;
    computePadding(config?: PaddingConfig): number[];
    addParagraph(text: string, config?: TextConfig & PaddingConfig): void;
    addRichText(text: RichText, baseConfig: TextConfig & PaddingConfig): void;
    addHead(img?: string | HTMLImageElement): void;
    insertBar(value: number, maxValue: number, topLeft: [number, number], width: number, config?: PaddingConfig): [number, () => void];
    richTextLayout(text: RichText, topLeft: [number, number], width: number, baseConfig?: TextConfig): InsertTextParams[];
    insertText(text: string, topLeft: [number, number], width: number, config?: TextConfig & PaddingConfig): [number, () => void];
    addTable(contents: Array<Array<(positioning: [number, number, number]) => [number, () => void]>>, widths: number[], config?: any): void;
    save(name?: string): void;
    addImage(img: HTMLImageElement, format: string, height?: number, width?: number): void;
    addEchart(instance: EChartsInstance, w?: number, h?: number): Promise<void>;
}
export {};
