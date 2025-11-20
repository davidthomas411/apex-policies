import { PDFParse } from 'pdf-parse'

const WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.296/legacy/build/pdf.worker.min.mjs'
PDFParse.setWorker(WORKER_URL)

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
