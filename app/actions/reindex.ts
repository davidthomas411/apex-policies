'use server'

import { loadMetadata, saveMetadata } from '@/app/actions/metadata'
import { PolicyBin, PolicyDocument } from '@/lib/policy-data'
import { extractPdfText } from '@/lib/pdf-text'

async function parseDocumentFromUrl(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error('[v0] Failed to fetch document for parsing', url, response.status)
      return null
    }
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return await extractPdfText(buffer)
  } catch (error) {
    console.error('[v0] Error parsing document content', url, error)
    return null
  }
}

export async function reindexDocumentContent() {
  const bins = await loadMetadata()
  if (!bins) {
    return { success: false, message: 'No metadata available' }
  }

  let parsedCount = 0
  const updatedBins: PolicyBin[] = []

  for (const bin of bins) {
    const updatedDocs: PolicyDocument[] = []
    for (const doc of bin.documents) {
      if (!doc.url) {
        updatedDocs.push(doc)
        continue
      }

      const parsedText = await parseDocumentFromUrl(doc.url)
      if (parsedText !== null) {
        parsedCount += 1
        updatedDocs.push({
          ...doc,
          content: parsedText,
        })
      } else {
        updatedDocs.push(doc)
      }
    }

    updatedBins.push({
      ...bin,
      documents: updatedDocs,
    })
  }

  await saveMetadata(updatedBins)
  return { success: true, parsedCount }
}
