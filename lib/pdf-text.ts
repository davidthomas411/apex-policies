import { PDFParse } from 'pdf-parse'

export async function extractPdfText(buffer: Buffer) {
  try {
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    await parser.destroy()
    return result.text || ''
  } catch (error) {
    console.error('[v0] Failed to parse PDF content:', error)
    return ''
  }
}
