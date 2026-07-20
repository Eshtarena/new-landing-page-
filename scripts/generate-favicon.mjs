import sharp from "sharp";
import path from "path";

async function generateFavicon() {
  const inputPath = path.join(process.cwd(), "public", "logo best.png");
  const outputPath = path.join(process.cwd(), "public", "favicon.png");

  try {
    // Generate PNG favicon
    await sharp(inputPath).resize(32, 32).png().toFile(outputPath);

    // Generate Apple Touch Icon (larger size)
    await sharp(inputPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(process.cwd(), "public", "apple-touch-icon.png"));

    console.log("Favicon generation completed successfully!");
  } catch (error) {
    console.error("Error generating favicon:", error);
    process.exit(1);
  }
}

generateFavicon();
