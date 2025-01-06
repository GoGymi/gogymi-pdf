export interface TextConfig {
  size?: number;
  style?: "normal" | "itatlic" | "bold"
  color?: string
  align?: "left" | "center" | "right" | "justify"
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
export interface InsertTextParams {
  text: string;
  topLeft: [number, number];
  width: number;
  config: TextConfig
  height: number;
}