'use server'

import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File
  const evidenceIndicator = formData.get('evidenceIndicator') as string
  
  if (!file) {
    throw new Error('No file provided')
  }

  const blob = await put(file.name, file, {
    access: 'public',
  })

  revalidatePath('/')
  
  return {
    url: blob.url,
    fileName: file.name,
    evidenceIndicator,
    uploadedAt: new Date().toISOString()
  }
}
