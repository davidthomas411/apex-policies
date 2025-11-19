'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadFile } from '@/app/actions/upload'
import { PolicyDocument } from '@/lib/policy-data'
import { Loader2, UploadCloud } from 'lucide-react'

interface SingleUploadDialogProps {
  open: boolean
  evidenceIndicator: string | null
  onOpenChange: (open: boolean) => void
  onUploadComplete: (documents: PolicyDocument[]) => void
}

export function SingleUploadDialog({
  open,
  evidenceIndicator,
  onOpenChange,
  onUploadComplete,
}: SingleUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (!open) {
      setFile(null)
      setIsUploading(false)
    }
  }, [open])

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file || !evidenceIndicator) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('evidenceIndicator', evidenceIndicator)

      const result = await uploadFile(formData)

      const doc: PolicyDocument = {
        id: `single-${Date.now()}`,
        fileName: result.fileName,
        evidenceIndicator: result.evidenceIndicator,
        category: 'Uncategorized',
        uploadedAt: new Date(result.uploadedAt),
        status: 'pending',
        url: result.url,
      }

      onUploadComplete([doc])
      onOpenChange(false)
    } catch (error) {
      console.error('Single upload failed', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document directly to {evidenceIndicator ? `indicator ${evidenceIndicator}` : 'this indicator'}.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleUpload}>
          <div className="space-y-2">
            <Label htmlFor="single-upload-file">Document</Label>
            <Input
              id="single-upload-file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={event => setFile(event.target.files?.[0] ?? null)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={!file || !evidenceIndicator || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
