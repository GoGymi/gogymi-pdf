import { PDF, STYLES } from "./pdf";

const pdf = new PDF()
pdf.addHead()
console.log(pdf.doc.getFontList())
pdf.addParagraph("Really long text that is really long and will hopefully exceed the size of the page lets go this is a good test")
pdf.addTable([
  [
    ([x,y,w]) => pdf.insertText("Short",[x,y],w),
    ([x,y,w]) => pdf.insertText("Some longer text that will wrap over to the next line hopefully. I guess we will see but I really hope so",[x,y],w),
  ],[
    ([x,y,w]) => pdf.insertText("Row 2",[x,y],w, STYLES.h2),
    ([x,y,w]) => pdf.insertText("Hiii!",[x,y],w),
  ]
],[100,200])
let a = new Array(50).fill(0)
a.map((_, n) => pdf.addParagraph((n+1) + "."))
pdf.addParagraph("END")
pdf.save("newtitle")