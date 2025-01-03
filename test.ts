import { PDF, STYLES } from "./pdf";

const pdf = new PDF()
pdf.addHead()
pdf.addTable([
  [
    ([x,y,w]) => pdf.insertText("Short",[x,y],w),
    ([x,y,w]) => pdf.insertText("Some longer text that will wrap over to the next line hopefully. I guess we will see but I really hope so",[x,y],w),
  ],[
    ([x,y,w]) => pdf.insertText("Row 2",[x,y],w, STYLES.h2),
    ([x,y,w]) => pdf.insertText("Hiii!",[x,y],w),
  ]
],[100,200])
pdf.save("newtitle")