# GoGymi PDF Generator

A TypeScript library for generating PDFs with support for rich text, charts, images, and styled blocks.

## Features

- Rich text formatting with colors, styles, and backgrounds
- Chart generation using ECharts
- Image insertion and manipulation
- Styled blocks with backgrounds, borders, and rounded corners
- Table generation
- Progress bars
- Page management

## Installation

```bash
npm install jspdf echarts
```

## Usage

### Basic PDF Creation

```typescript
import { PDF } from "./src/pdf.ts";

const pdf = new PDF();
pdf.addParagraph("Hello, World!");
pdf.save("output");
```

### Styled Blocks

The `addBlock` method now supports backgrounds, borders, and rounded corners:

```typescript
// Block with background color
pdf.addBlock(
  ([x, y, width]) => {
    return pdf.insertText("Content here", [x, y], width, {
      size: 14,
      align: "center"
    });
  },
  {
    bg: "#e6f3ff",        // Background color
    p: 20                 // Padding
  }
);

// Block with border and rounded corners
pdf.addBlock(
  ([x, y, width]) => {
    return pdf.insertText("Content here", [x, y], width, {
      size: 14,
      align: "center"
    });
  },
  {
    border: {
      color: "#333333",   // Border color
      width: 2,           // Border width
      style: "solid"      // Border style: "solid", "dashed", or "dotted"
    },
    borderRadius: 10,     // Corner radius
    p: 20                 // Padding
  }
);

// Block with background, dashed border, and rounded corners
pdf.addBlock(
  ([x, y, width]) => {
    return pdf.insertText("Content here", [x, y], width, {
      size: 14,
      align: "center"
    });
  },
  {
    bg: "#fff2e6",
    border: {
      color: "#ff6600",
      width: 1,
      style: "dashed"
    },
    borderRadius: 8,
    p: 20
  }
);
```

### Block Configuration Options

The `BlockConfig` interface extends `PaddingConfig` with the following additional properties:

- `bg?: string` - Background color (hex, rgb, or named color)
- `border?: { color?: string, width?: number, style?: "solid" | "dashed" | "dotted" }` - Border configuration
- `borderRadius?: number` - Corner radius for rounded rectangles

### Padding Configuration

All padding properties from `PaddingConfig` are supported:

- `p?: number` - All sides padding
- `px?: number` - Horizontal padding (left + right)
- `py?: number` - Vertical padding (top + bottom)
- `pl?: number` - Left padding
- `pt?: number` - Top padding
- `pr?: number` - Right padding
- `pb?: number` - Bottom padding

## Examples

See `src/test.ts` for comprehensive examples of all features including the new block styling capabilities. 