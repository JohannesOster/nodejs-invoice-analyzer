const getPrinterDevice = require("./getPrinterDevice");

const printerDevice = getPrinterDevice();
console.log("FoundUSB Printer: ", printerDevice);
