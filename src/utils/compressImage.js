/**
 * Compress an image File before uploading.
 * Returns a new File with reduced size.
 *
 * @param {File} file - Original image file
 * @param {object} options
 * @param {number} options.maxWidth  - Max width in px (default 1920)
 * @param {number} options.maxHeight - Max height in px (default 1920)
 * @param {number} options.quality   - JPEG quality 0-1 (default 0.92)
 * @returns {Promise<File>}
 */
export async function compressImage(file, { maxWidth = 1920, maxHeight = 1920, quality = 0.92 } = {}) {
  // SVG and GIF — skip compression
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file

  // Already small enough — skip
  if (file.size < 500 * 1024) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      let { width, height } = img

      // Scale down if needed
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Use webp if supported, fallback to jpeg
      const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
      const outputQuality = outputType === 'image/png' ? undefined : quality

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas compression failed'))
          const compressed = new File([blob], file.name, { type: outputType, lastModified: Date.now() })
          console.log(`Compressed: ${(file.size / 1024).toFixed(0)}KB → ${(compressed.size / 1024).toFixed(0)}KB`)
          resolve(compressed)
        },
        outputType,
        outputQuality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file) // fallback to original on error
    }

    img.src = url
  })
}
