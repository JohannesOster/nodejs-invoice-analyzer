const usb = require("usb");

/** Vendor ids of suppported printers */
const VENDOR_IDS = [1452];

/** Find a device with a supported vendor id */
const getPrinterDevice = () => {
  const deviceList = usb.getDeviceList();

  for (let i = 0; i < deviceList.length; i++) {
    const idVendor = deviceList[i].deviceDescriptor.idVendor;
    if (VENDOR_IDS.includes(idVendor)) {
      return deviceList[i];
    }
  }
};

module.exports = getPrinterDevice;
