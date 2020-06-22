const fs = require("fs");
const Printer = require("./ipp-printer").Printer;
const { exec } = require("child_process");

const printer = new Printer();

let i = 0; // file id counter
printer.on("job", (job) => {
  const filePath = `./print-jobs/${i}`;

  // write job to postscript file
  const wStream = fs.createWriteStream(filePath + ".ps");
  job.pipe(wStream);

  job.on("finish", () => {
    console.log(`Successfully wrote file to ${filePath}.ps`);

    const ps2pdf = `ps2pdf ${filePath}.ps ${filePath}.pdf`; // converts postscript file to pdf
    // since tesseract cannot read pdf file pdf file has to be converted to highres .tiff file
    const convertToTiff = `convert -density 300 ${filePath}.pdf -depth 8 -strip -background white -alpha off ${filePath}.tiff`;

    exec(ps2pdf + " && " + convertToTiff, (error, stdout, stderr) => {
      if (error) return console.error(`error: ${error.message}`);
      if (stderr) console.debug(`stderr: ${stderr}`);

      console.log(stdout);
      console.log(`Successfully converted file to .tiff.`);

      const resultFile = `./results/result-${i}`;
      const tess = `tesseract ${filePath}.tiff ${resultFile} -l deu --oem 1 --psm 3`;
      exec(tess, (error, stdout, stderr) => {
        if (error) return console.error(`error: ${error}`);
        if (stderr) console.debug(stderr);

        console.log(stdout);
        console.log(`Successfully analysed ${filePath}.tiff`);
        console.log(`Result at ${resultFile}.txt`);

        console.log("Remove blank lines from result file.");
        const data = fs.readFileSync(resultFile + ".txt", "utf-8");
        const removeBlankLines = data.replace(/^\s*\n/gm, "");
        fs.writeFileSync(
          `./results/result-${i}.edited.txt`,
          removeBlankLines,
          "utf-8"
        );

        console.log(`Removed blank lines.`);

        // after successull analyzation increase counter
        i += 1;
      });
    });
  });
});
