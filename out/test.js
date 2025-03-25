"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdf_1 = require("./pdf");
var pdf = new pdf_1.PDF();
pdf.addHead();
console.log(pdf.doc.getFontList());
pdf.addParagraph("Really long text that is really long and will hopefully exceed the size of the page lets go this is a good test");
pdf.addTable([
    [
        function (_a) {
            var x = _a[0], y = _a[1], w = _a[2];
            return pdf.insertText("Short", [x, y], w);
        },
        function (_a) {
            var x = _a[0], y = _a[1], w = _a[2];
            return pdf.insertText("Some longer text that will wrap over to the next line hopefully. I guess we will see but I really hope so", [x, y], w);
        },
    ], [
        function (_a) {
            var x = _a[0], y = _a[1], w = _a[2];
            return pdf.insertText("Row 2", [x, y], w, pdf_1.STYLES.h2);
        },
        function (_a) {
            var x = _a[0], y = _a[1], w = _a[2];
            return pdf.insertText("Hiii!", [x, y], w);
        },
    ]
], [100, 200]);
var a = new Array(50).fill(0);
a.map(function (_, n) { return pdf.addParagraph((n + 1) + "."); });
pdf.addParagraph("END");
pdf.addRichText(["TESTING THE RICH TEXT TO SEE IF IT WORKS IDK", { color: "#FF00FF", text: "SOME" }, "MORE TEXT THAT MIGHT WRAP", "SOME FINAL TEXT"], pdf_1.STYLES.h4);
pdf.save("newtitle");
//# sourceMappingURL=test.js.map