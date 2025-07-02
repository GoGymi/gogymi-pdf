import type { init } from "echarts"

export interface TextConfig {
  size?: number;
  style?: "normal" | "italic" | "bold"
  color?: string
  align?: "left" | "center" | "right" | "justify"
  bg?: string
}
export interface PaddingConfig {
  p?: number;
  px?: number;
  py?: number;
  pl?: number;
  pt?: number;
  pr?: number;
  pb?: number;
}
export interface BlockConfig extends PaddingConfig {
  bg?: string;
  border?: {
    color?: string;
    width?: number;
    style?: "solid" | "dashed" | "dotted";
  };
  borderRadius?: number;
}
export interface InsertTextParams {
  text: string;
  topLeft: [number, number];
  width: number;
  config: TextConfig
  height: number;
}
export type EChartsInstance = ReturnType<typeof init>