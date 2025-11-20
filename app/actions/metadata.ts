'use server'

import { put, list } from '@vercel/blob'
import { PolicyBin } from '@/lib/policy-data'

const METADATA_PATH = 'metadata/policy-bins.json'

export async function saveMetadata(bins: PolicyBin[]) {
  try {
    const jsonData = JSON.stringify(bins, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    
    await put(METADATA_PATH, blob, {
      access: 'public',
      addRandomSuffix: false, // Keep the same filename
      allowOverwrite: true,
    })
    
    return { success: true }
  } catch (error) {
    console.error('[v0] Error saving metadata:', error)
    return { success: false, error: String(error) }
  }
}

export async function loadMetadata(): Promise<PolicyBin[] | null> {
  try {
    const { blobs } = await list({
      prefix: 'metadata/',
    })
    
    const metadataBlob = blobs.find(b => b.pathname === METADATA_PATH)
    
    if (!metadataBlob) {
      console.log('[v0] No metadata file found, using default bins')
      return null
    }
    
    // Fetch the metadata
    const response = await fetch(metadataBlob.url)
    
    if (!response.ok) {
      console.error('[v0] Failed to fetch metadata:', response.status)
      return null
    }
    
    const bins = await response.json()
    
    // Convert date strings back to Date objects
    const parsedBins = bins.map((bin: PolicyBin) => ({
      ...bin,
      documents: bin.documents.map(doc => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt),
        content: doc.content ?? '',
      }))
    }))
    
    console.log('[v0] Loaded metadata successfully:', parsedBins.length, 'bins')
    return parsedBins
  } catch (error) {
    console.error('[v0] Error loading metadata:', error)
    return null
  }
}
