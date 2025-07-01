const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

async function generateFavicon() {
  const inputPath = path.join(process.cwd(), "public", "app_icon.svg");
  const outputPath = path.join(process.cwd(), "public", "app_icon.webp");

  try {
    // Generate PNG favicon
    await sharp(inputPath).resize(32, 32).webp().toFile(outputPath);

    // Generate Apple Touch Icon (larger size)
    await sharp(inputPath)
      .resize(180, 180)
      .webp()
      .toFile(path.join(process.cwd(), "public", "apple-touch-icon.webp"));

    console.log("Favicon generation completed successfully!");
  } catch (error) {
    console.error("Error generating favicon:", error);
    process.exit(1);
  }
}

generateFavicon();
