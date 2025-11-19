'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { PolicyBin, PolicyDocument, policyBins } from '@/lib/policy-data'
import { loadMetadata, saveMetadata } from '@/app/actions/metadata'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash2 } from 'lucide-react'

type DocumentStatus = PolicyDocument['status']

const defaultFormState = {
  evidenceIndicator: '',
  fileName: '',
  url: '',
  status: 'pending' as DocumentStatus,
}

export default function AdminPage() {
  const [bins, setBins] = useState<PolicyBin[]>(policyBins)
  const [isLoading, setIsLoading] = useState(true)
  const [formState, setFormState] = useState(defaultFormState)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadBins() {
      const saved = await loadMetadata()
      if (saved) {
        setBins(saved)
      }
      setIsLoading(false)
    }

    loadBins()
  }, [])

  const totalDocuments = bins.reduce((sum, bin) => sum + bin.documents.length, 0)

  const duplicateGroups = useMemo(() => {
    const groups: Array<{ bin: PolicyBin; documents: PolicyDocument[] }> = []

    bins.forEach(bin => {
      const seen = new Map<string, PolicyDocument[]>()
      bin.documents.forEach(doc => {
        const key = doc.fileName.toLowerCase()
        if (!seen.has(key)) {
          seen.set(key, [])
        }
        seen.get(key)!.push(doc)
      })

      seen.forEach(docs => {
        if (docs.length > 1) {
          groups.push({ bin, documents: docs })
        }
      })
    })

    return groups
  }, [bins])

  const handleAddDocument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.evidenceIndicator || !formState.fileName) return

    const targetBin = bins.find(bin => bin.evidenceIndicator === formState.evidenceIndicator)
    if (!targetBin) return

    setIsSaving(true)

    const newDoc: PolicyDocument = {
      id: `manual-${Date.now()}`,
      fileName: formState.fileName,
      evidenceIndicator: targetBin.evidenceIndicator,
      category: targetBin.category,
      uploadedAt: new Date(),
      status: formState.status,
      url: formState.url || undefined,
    }

    const updatedBins = bins.map(bin => {
      if (bin.evidenceIndicator === targetBin.evidenceIndicator) {
        return {
          ...bin,
          documents: [...bin.documents, newDoc],
        }
      }
      return bin
    })

    setBins(updatedBins)
    await saveMetadata(updatedBins)
    setFormState(prev => ({
      evidenceIndicator: prev.evidenceIndicator,
      fileName: '',
      url: '',
      status: prev.status,
    }))
    setIsSaving(false)
  }

  const handleDeleteDocument = async (binIndicator: string, documentId: string) => {
    setDeletingId(documentId)
    const updatedBins = bins.map(bin => {
      if (bin.evidenceIndicator === binIndicator) {
        return {
          ...bin,
          documents: bin.documents.filter(doc => doc.id !== documentId),
        }
      }
      return bin
    })

    setBins(updatedBins)
    await saveMetadata(updatedBins)
    setDeletingId(null)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading admin tools…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10 max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Policies Admin</p>
            <h1 className="text-3xl font-serif font-bold">Document Management</h1>
            <p className="text-muted-foreground mt-2">
              Add documents manually and clean up duplicate uploads across all bins.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {bins.length} bins · {totalDocuments} documents
            </Badge>
            <Button variant="outline" asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manual Document Entry</CardTitle>
            <CardDescription>
              Assign an existing blob URL to a specific evidence indicator without re-uploading files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6 md:grid-cols-2" onSubmit={handleAddDocument}>
              <div className="space-y-2">
                <Label>Evidence Indicator</Label>
                <Select
                  value={formState.evidenceIndicator}
                  onValueChange={value => setFormState(prev => ({ ...prev, evidenceIndicator: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a bin" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {bins.map(bin => (
                      <SelectItem key={bin.evidenceIndicator} value={bin.evidenceIndicator}>
                        {bin.evidenceIndicator} · {bin.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Status</Label>
                <Select
                  value={formState.status}
                  onValueChange={value =>
                    setFormState(prev => ({ ...prev, status: value as DocumentStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Name</Label>
                <Input
                  placeholder="policy-document.pdf"
                  value={formState.fileName}
                  onChange={event => setFormState(prev => ({ ...prev, fileName: event.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Document URL</Label>
                <Input
                  placeholder="https://blob.vercel-storage.com/..."
                  value={formState.url}
                  onChange={event => setFormState(prev => ({ ...prev, url: event.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <Button type="submit" disabled={!formState.evidenceIndicator || isSaving}>
                  {isSaving ? 'Saving…' : 'Add Document'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duplicate Documents</CardTitle>
            <CardDescription>
              Documents with the same filename inside the same bin are listed below. Remove the ones you
              no longer need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {duplicateGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground">No duplicates detected 🎉</p>
            ) : (
              <div className="space-y-6">
                {duplicateGroups.map(group => (
                  <div key={`${group.bin.evidenceIndicator}-${group.documents[0].fileName}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <p className="font-medium">{group.documents[0].fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {group.bin.evidenceIndicator} · {group.bin.title}
                        </p>
                      </div>
                      <Badge variant="secondary">{group.documents.length} copies</Badge>
                    </div>
                    <ScrollArea className="border rounded-md max-h-72">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Uploaded</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.documents.map(doc => (
                            <TableRow key={doc.id}>
                              <TableCell className="whitespace-nowrap text-sm">
                                {format(doc.uploadedAt, 'PP p')}
                              </TableCell>
                              <TableCell className="capitalize">{doc.status}</TableCell>
                              <TableCell className="max-w-sm truncate text-muted-foreground">
                                {doc.url ? (
                                  <a
                                    href={doc.url}
                                    className="hover:underline text-primary"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {doc.url}
                                  </a>
                                ) : (
                                  '—'
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteDocument(group.bin.evidenceIndicator, doc.id)}
                                  disabled={deletingId === doc.id}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableCaption>
                          Remove at least one copy to resolve this duplicate group.
                        </TableCaption>
                      </Table>
                    </ScrollArea>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>Review every document currently stored in metadata.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {bins.map(bin => (
                <div key={bin.evidenceIndicator} className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium">
                        {bin.evidenceIndicator} · {bin.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{bin.documents.length} documents</p>
                    </div>
                    <Badge variant="outline">{bin.category}</Badge>
                  </div>
                  {bin.documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No documents in this bin.</p>
                  ) : (
                    <ScrollArea className="border rounded-md max-h-72">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Uploaded</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bin.documents.map(doc => (
                            <TableRow key={doc.id}>
                              <TableCell className="max-w-sm">
                                <div className="flex flex-col">
                                  <span className="font-medium truncate">{doc.fileName}</span>
                                  {doc.url && (
                                    <a
                                      href={doc.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary truncate hover:underline"
                                    >
                                      {doc.url}
                                    </a>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="capitalize">{doc.status}</TableCell>
                              <TableCell className="whitespace-nowrap text-sm">
                                {format(doc.uploadedAt, 'PP p')}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteDocument(bin.evidenceIndicator, doc.id)}
                                  disabled={deletingId === doc.id}
                                >
                                  <Trash2 className="h-4 w-4 mr-1 text-muted-foreground" />
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
