import { jsPDF } from "jspdf";
import type { TextConfig, PaddingConfig, InsertTextParams, EChartsInstance, BlockConfig } from "./types.ts";
import { init } from "echarts";

export const STYLES = {
  h1: { size: 32 },
  h2: { size: 24 },
  h3: { size: 18 },
  h4: { size: 14 },
  h5: { size: 12 },
  h6: { size: 10 },
  body2: { size: 10 },
}

type RichText = Array<string | TextConfig & { text: string }>

export class PDF {
  doc: jsPDF;
  y: number;

  constructor() {
    this.doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });
    this.y = 32;
    this.doc.setFontSize(11)
    this.addPage(true)
  }
  addPage(justNum=false) {
    if (!justNum) {
      this.doc.addPage("a4", "p")
    }
    this.insertText(this.doc.getNumberOfPages().toString(),[220,610],100)[1]()
  }
  computePadding(config?: PaddingConfig) {
    if (!config) {
      return [0, 0, 0, 0]
    }
    // Uses left top right bottom order
    return [
      ((config.pl ?? config.px) ?? config.p) ?? 0,
      ((config.pt ?? config.py) ?? config.p) ?? 0,
      ((config.pr ?? config.px) ?? config.p) ?? 0,
      ((config.pb ?? config.py) ?? config.p) ?? 0
    ]
  }
  addParagraph(text: string, config?: TextConfig & PaddingConfig): void {
    let px = config?.px ?? 0
    let width = 384 - px * 2
    let [h, doIt] = this.insertText(text, [32 + px, this.y], width, config)

    if (this.y + h > 600) {
      this.addPage()
      this.y = 32
      let newInsert = this.insertText(text, [32 + px, this.y], width, config)
      h = newInsert[0]
      doIt = newInsert[1]
    }
    doIt()
    this.y += h
  }
  addRichText(text: RichText, baseConfig: TextConfig & PaddingConfig): void {
    let textElements = this.richTextLayout(text,[32, this.y], 384, baseConfig)

    let pageOffset = 0

    for (let i of textElements) {
      if ((i.height + i.topLeft[1] - pageOffset) > 600) {
        pageOffset += 568
        this.addPage()
      }
      this.insertText(i.text,[i.topLeft[0],i.topLeft[1] - pageOffset],i.width, i.config)[1]()
      this.y = (i.height + i.topLeft[1] - pageOffset)
    }
  }
  addHead(image?: string, url?: string, width: number=1) {
    this.y -= 24
    this.doc.addImage(image ?? "data:image/png;base64,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", "png", 24, this.y, 64*width, 64);
    this.doc.text(url ?? "gogymi.ch", 416, this.y + 36, {align: "right"});
    this.y += 64
  }
  insertBar(value: number, maxValue: number, topLeft: [number, number], width: number, config?: PaddingConfig): [number, () => void] {
    let [pl, pt, pr, pb] = this.computePadding(config)

    return [8 + pt + pb, () => {

      const normalizedValue = (value / maxValue) * 100;

      const getColor = (value: number) => {
        if (value >= 90) return '#1a891a'; // green
        if (value >= 70) return '#71b014';
        if (value >= 50) return '#d8c218'; // yellow
        if (value >= 30) return '#ff9900';
        if (value >= 10) return '#ff3300';
        return '#ff0000'; // red
      };

      const barColor = getColor(normalizedValue);

      this.doc.setFillColor("#DDDDDD")
      this.doc.roundedRect(topLeft[0] + pl, topLeft[1] + pt, width - pl - pr, 8, 4, 4, "F")
      this.doc.setFillColor(barColor)
      this.doc.roundedRect(topLeft[0] + pl, topLeft[1] + pt, (width - pl - pr) * normalizedValue / 100, 8, 4, 4, "F")
    }]
  }
  addHR(baseConfig?: PaddingConfig & {color?: string}) {
    let [pl, pt, pr, pb] = this.computePadding(baseConfig)

    this.doc.setDrawColor(baseConfig?.color ?? "#555555")
    this.doc.line(32+pl,Math.round(this.y)+pt,408-pr,Math.round(this.y)+pt)
    this.y += pt + 2 + pb
  }
  richTextLayout(text: RichText, topLeft: [number, number], width: number, baseConfig?: TextConfig) {
    this.doc.setFontSize(baseConfig?.size ?? 11)
    let offset: [number,number] = [topLeft[0] , topLeft[1]]
    let elements: InsertTextParams[] = []

    while (text.length > 0) {
      let config = {...baseConfig,...(typeof text[0] == "string" ? {} : text[0])}

      let currentText = typeof text[0] == "string" ? text[0] : text[0].text

      this.doc.setFont("Helvetica", config.style ?? "normal")

      let firstLine = this.doc.splitTextToSize(currentText, width - offset[0])[0]

      let textWidth = this.doc.getStringUnitWidth(currentText) * this.doc.getFontSize() * 0.75 

      elements.push({
        text: firstLine,
        topLeft: [...offset],
        width: textWidth + 20,
        height: this.doc.getFontSize(),
        config
      })

      if (currentText[0] == "\n") {
        if (typeof text[0] == "string") {
          text[0] = currentText.slice(1).trim()
        } else {
          text[0].text = currentText.slice(1).trim()
        }
      } else if (firstLine.length == currentText.length) {
        text = text.slice(1)
        offset[0] += textWidth + 1
      } else {
        offset[0] = topLeft[0]
        offset[1] += this.doc.getLineHeight()
        if (typeof text[0] == "string") {
          text[0] = currentText.slice(firstLine.length).trim()
        } else {
          text[0].text = currentText.slice(firstLine.length).trim()
        }
      }
    }
    return elements
  }
  insertText(text: string, topLeft: [number, number], width: number, config?: TextConfig & PaddingConfig): [number, () => void] {
    console.log(config)
    console.log(topLeft)
    let textSize = config?.size ?? 11
    this.doc.setFontSize(textSize)

    let textStyle = config?.style ?? "normal"
    this.doc.setFont("Helvetica", textStyle)

    let textColor = config?.color ?? "#000000"
    this.doc.setTextColor(textColor)

    let [pl, pt, pr, pb] = this.computePadding(config)

    let splitText: string[] = this.doc.splitTextToSize(text, width - pl - pr)

    let x;
    switch (config?.align ?? "left") {
      case "left":
        x = topLeft[0] + pl
        break
      case "center":
        x = topLeft[0] + 0.5 * (width + pl - pr)
        break
      case "right":
        x = topLeft[0] + width - pr
        break
      case "justify":
        x = topLeft[0] + pl
        break
    }

    return [splitText.length * textSize + pt + pb, () => {
      if (config?.bg) {
        this.doc.setFillColor(config.bg)
        this.doc.rect(x, topLeft[1] + pt, width - pl - pr - 20, splitText.length * textSize,"F")
      }  
      this.doc.text(splitText, x, topLeft[1] + pt, { align: config?.align ?? "left", baseline: "top"});
    }]
  }
  addTable(contents: Array<Array<(positioning: [number, number, number]) => [number, () => void]>>, widths: Array<number | null>, config?: BlockConfig) {
    let [pl, pt, pr, pb] = this.computePadding(config)

    const borderWidth = config?.border?.width ?? (config?.border ? 1 : 0);

    const widthSum = widths.filter(i => i != null).reduce((acc, i) => acc + i, 0)

    const nullCount = widths.filter(i => i == null).length

    const filledWidths = widths.map(i => i != null ? i : (384 - pr - pl - widthSum) / nullCount)

    console.log(config)

    // Cumlative sum starting with 0
    function cumSum0(a: number[], base?: number): number[] {
      if (a.length == 0) {
        return [base ?? 0]
      }
      let prev = cumSum0(a.slice(0, -1), base)
      prev.push(a.slice(-1)[0] + prev.slice(-1)[0])
      return prev
    }
    const lefts = cumSum0(filledWidths, 32+pl+borderWidth)

    this.y += pt

    // Calculate total table height
    let totalHeight = 0;
    for (let i of contents) {
      let h = Math.max(...i.map((j, n) => j([lefts[n], this.y + totalHeight, filledWidths[n]])[0]))
      totalHeight += h;
    }

    // Draw background and border for the entire table
    const tableX = 32 + pl;
    const tableY = this.y;
    const tableWidth = 384 - pl - pr;
    const tableHeight = totalHeight;

    this.drawBackgroundAndBorder(tableX, tableY, tableWidth, tableHeight, config);

    // Draw table contents
    for (let i of contents) {
      let h = Math.max(...i.map((j, n) => j([lefts[n], this.y, filledWidths[n]])[0]))
      if (this.y + h > 600) {
        this.y = 32
        this.addPage()
      }
      i.map((j, n) => j([lefts[n], this.y, filledWidths[n]])[1]())
      this.y += h
    }

    this.y += pb
  }
  drawBackgroundAndBorder(x: number, y: number, width: number, height: number, config?: BlockConfig) {
    const borderWidth = config?.border?.width ?? (config?.border ? 1 : 0);
    const borderRadius = config?.borderRadius ?? 0;
    
    // Account for border width in positioning and sizing
    const contentX = x + borderWidth;
    const contentY = y + borderWidth;
    const contentWidth = width - (borderWidth * 2);
    const contentHeight = height - (borderWidth * 2);
    
    // Draw background (inside the border)
    if (config?.bg) {
      this.doc.setFillColor(config.bg);
      if (borderRadius > 0) {
        this.doc.roundedRect(contentX, contentY, contentWidth, contentHeight, borderRadius, borderRadius, "F");
      } else {
        this.doc.rect(contentX, contentY, contentWidth, contentHeight, "F");
      }
    }

    // Draw border
    if (config?.border) {
      const borderColor = config.border.color ?? "#000000";
      const borderStyle = config.border.style ?? "solid";

      this.doc.setDrawColor(borderColor);
      this.doc.setLineWidth(borderWidth);

      // Set line dash pattern based on style
      if (borderStyle === "dashed") {
        this.doc.setLineDashPattern([5, 5], 0);
      } else if (borderStyle === "dotted") {
        this.doc.setLineDashPattern([2, 2], 0);
      } else {
        this.doc.setLineDashPattern([], 0); // solid
      }

      if (borderRadius > 0) {
        this.doc.roundedRect(contentX, contentY, contentWidth, contentHeight, borderRadius, borderRadius, "S");
      } else {
        this.doc.rect(contentX, contentY, contentWidth, contentHeight, "S");
      }

      // Reset line dash pattern
      this.doc.setLineDashPattern([], 0);
    }
  }

  addBlock(f: (positioning: [number, number, number]) => [number, () => void], config?: BlockConfig) {
    let [pl, pt, pr, pb] = this.computePadding(config)

    const borderWidth = config?.border?.width ?? 0;
    const [h, init] = f([32+pl+borderWidth, this.y+pt+borderWidth, 384-pl-pr-(borderWidth*2)])

    // Draw background and border before content
    const x = 32 + pl;
    const y = this.y + pt;
    const width = 384 - pl - pr;
    const height = h;

    this.drawBackgroundAndBorder(x, y, width, height, config);

    // Then draw content
    init();
    this.y += h + pt + pb + (borderWidth * 2);
  }
  save(name?: string) {
    name = name ?? "test"
    this.doc.save(name + ".pdf");
  }
  addImage(img: HTMLImageElement, format: string, height?: number, width?: number) {

    const SCALE = 3

    if (width == undefined && height == undefined) {
      width = img.naturalWidth / SCALE
      height = img.naturalHeight / SCALE
    } else if (width == undefined) {
      width = height! * (img.naturalWidth / img.naturalHeight)
    } else if (height == undefined) {
      width = width * (img.naturalHeight / img.naturalWidth)
    }
    if (this.y + img.naturalHeight / SCALE > 600) {
      this.y = 32
      this.addPage()
    }
    this.doc.addImage(img, format, 32, this.y, img.naturalWidth / SCALE, img.naturalHeight / SCALE)
    this.y += img.naturalHeight / SCALE
  }
  async addEchart(instance: EChartsInstance,w=800, h=500) {
    var canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    canvas.style.width = w+"px"
    canvas.style.height = h+"px"

    var chart = init(canvas)
    chart.setOption({...instance.getOption(), dataZoom: undefined, animation: false, grid: {left: 10, containLabel: true}})

    let img = new Image()
    img.src = chart.getDataURL({type: "png",pixelRatio: 1.5})
    img = await new Promise<HTMLImageElement>((res) => {img.onload = () => {res(img)}})

    this.addImage(img,"png")
  }
}

