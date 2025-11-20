'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'
import { matchFileToEvidenceIndicator, createPolicyDocument } from '@/lib/upload-utils'
import { PolicyDocument } from '@/lib/policy-data'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { uploadFile } from '@/app/actions/upload'

interface BulkUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete: (documents: PolicyDocument[]) => void
}

interface FileMatch {
  file: File
  evidenceIndicator: string | null
  matched: boolean
}

export function BulkUploadDialog({ open, onOpenChange, onUploadComplete }: BulkUploadDialogProps) {
  const [files, setFiles] = useState<FileMatch[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const fileMatches: FileMatch[] = Array.from(selectedFiles).map(file => {
      const evidenceIndicator = matchFileToEvidenceIndicator(file.name)
      return {
        file,
        evidenceIndicator,
        matched: evidenceIndicator !== null
      }
    })

    setFiles(prev => [...prev, ...fileMatches])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    setIsUploading(true)
    const filesToUpload = files.filter(f => f.matched && f.evidenceIndicator)
    const uploadedDocs: PolicyDocument[] = []

    try {
      for (const fileMatch of filesToUpload) {
        const formData = new FormData()
        formData.append('file', fileMatch.file)
        formData.append('evidenceIndicator', fileMatch.evidenceIndicator!)

        const result = await uploadFile(formData)
        
        const doc: PolicyDocument = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          fileName: result.fileName,
          evidenceIndicator: result.evidenceIndicator,
          category: 'Uncategorized', // This will be fixed by the parent component
          uploadedAt: new Date(result.uploadedAt),
          status: 'pending',
          url: result.url,
          content: result.content ?? ''
        }
        uploadedDocs.push(doc)
      }

      onUploadComplete(uploadedDocs)
      setFiles([])
      onOpenChange(false)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const matchedCount = files.filter(f => f.matched).length
  const unmatchedCount = files.length - matchedCount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 shrink-0">
          <DialogTitle>Bulk Upload Documents</DialogTitle>
          <DialogDescription>
            Upload multiple policy documents. Files will be automatically assigned to the appropriate evidence indicator bins.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0 px-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors shrink-0 ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop files here, or click to browse
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx"
            />
            <Button asChild variant="outline" size="sm">
              <label htmlFor="file-upload" className="cursor-pointer">
                Browse Files
              </label>
            </Button>
          </div>

          {files.length > 0 && (
            <>
              <div className="flex items-center justify-between py-3 shrink-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{files.length} files selected</span>
                  {matchedCount > 0 && (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {matchedCount} matched
                    </Badge>
                  )}
                  {unmatchedCount > 0 && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {unmatchedCount} unmatched
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
                  Clear All
                </Button>
              </div>

              <ScrollArea className="flex-1 min-h-0 -mx-6 px-6">
                <div className="space-y-2 pb-4">
                  {files.map((fileMatch, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        fileMatch.matched ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <FileText className={`h-4 w-4 shrink-0 ${
                        fileMatch.matched ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{fileMatch.file.name}</p>
                        {fileMatch.matched && fileMatch.evidenceIndicator && (
                          <p className="text-xs text-muted-foreground">
                            → Evidence Indicator: {fileMatch.evidenceIndicator}
                          </p>
                        )}
                        {!fileMatch.matched && (
                          <p className="text-xs text-red-600">
                            No matching evidence indicator found
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {files.length > 0 && (
          <div className="flex justify-end gap-2 p-6 pt-4 border-t shrink-0 bg-background">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={matchedCount === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Upload ${matchedCount} ${matchedCount === 1 ? 'Document' : 'Documents'}`
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
