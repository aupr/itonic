

# iTonic
This is a simple javascript library which is very helpful to make a dynamic or interactive web applications.

### Key Features!
- Dialog/Modal view and easy handling method
- Data loading view
- File upload executor and easy progress monitor system
- URI query parser
- Code character to Entity converter
- Toggle full screen controller
- Color verification method
- Pixel verification method

### Additional Features!
- Dedicated css file to make custom graphical view of Dialog or Loading
- Multiple naming for same execution to remind the function name easily
- Used sassy scss for advanced and easier css design
- Minified version of both css and js file

### Limitations!
- iTonic javascript library is to use only for environments that have a `window` with a `document`
- jQuery version 3.0.0 or higher is required

### List of working functions
- `boolean it.isColor(string pixel)`
- `boolean it.isPixel(string color)`
- `string it.CCToEntity(string text)`
- `object it.getURIQuery([boolean considerArray, string customUrl])`
- `boolean it.fullScrToggle(object element)`
- `boolean it.dialog.execute(object propertyObject)`
- `boolean it.dialog.open(string headerText, string bodyHtml, string hfColor, string width, string buttons, function callback)`
- `boolean it.dialog.warning(string bodyHtml, string callback)`
- `boolean it.dialog.success(string bodyHtml)`
- `boolean it.dialog.info(string bodyHtml)`
- `boolean it.dialog.error(string bodyHtml)`
- `boolean it.dialog.onDuty([object propertyObject])`
- `boolean it.dialog.loading([string loadingMessage, string loadingImageLink, string msgColor, string backLayerColor])`
- `boolean it.dialog.close(void)`
- `void it.upload.execute(object propertyObject)`
- `void it.upload.drive(string targetUrl, string inputFileId, string inputName, string fileExtensions, number fileSizeMax, number filesMax, function cbProgress, function cbSuccess, function cbDone, function cbEvaluate, function cbFail)`

### Multiple naming access!
- `[iTonic = itonic = it]*`
- `(*.)[dialog = modal]**`
- `(**.)[open = view]`
- `(*.upload.)[drive = run]`
### License
> iTonic is a free javascript library! You can redistribute it and/or modify it under the terms of the MIT License. Please read the LICENSE file for more details.



