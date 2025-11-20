#!/usr/bin/env node

import { createRequire } from 'module'
import { PDFParse } from 'pdf-parse'
import { list, put } from '@vercel/blob'

const METADATA_PATH = 'metadata/policy-bins.json'
const token = process.env.BLOB_READ_WRITE_TOKEN

if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN. Set it before running this script.')
  process.exit(1)
}

const require = createRequire(import.meta.url)
const workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs')
PDFParse.setWorker(workerSrc)

async function fetchMetadata() {
  const { blobs } = await list({ prefix: 'metadata/', token })
  const metadataBlob = blobs.find(blob => blob.pathname === METADATA_PATH)
  if (!metadataBlob) {
    throw new Error(`Could not find ${METADATA_PATH} in your blob storage.`)
  }
  const response = await fetch(metadataBlob.url)
  if (!response.ok) {
    throw new Error(`Failed to download metadata: ${response.status} ${response.statusText}`)
  }
  return await response.json()
}

async function parseDocument(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  const parser = new PDFParse({ data: buffer })
  const result = await parser.getText()
  await parser.destroy()
  return result.text || ''
}

async function saveMetadata(bins) {
  const json = JSON.stringify(bins, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  await put(METADATA_PATH, blob, {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    token,
  })
}

async function main() {
  console.log('Downloading metadata…')
  const bins = await fetchMetadata()
  let parsed = 0

  for (const bin of bins) {
    for (const doc of bin.documents) {
      if (!doc.url) continue
      try {
        console.log(`Parsing ${doc.fileName}…`)
        doc.content = await parseDocument(doc.url)
        parsed += 1
      } catch (error) {
        console.error(`Failed to parse ${doc.fileName}:`, error.message)
      }
    }
  }

  console.log(`Parsed ${parsed} documents. Uploading metadata…`)
  await saveMetadata(bins)
  console.log('Done.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
