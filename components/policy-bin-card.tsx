'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Upload, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { PolicyBin } from '@/lib/policy-data'

interface PolicyBinCardProps {
  bin: PolicyBin
  onUpload: (evidenceIndicator: string) => void
}

export function PolicyBinCard({ bin, onUpload }: PolicyBinCardProps) {
  const documentCount = bin.documents.length
  const pendingCount = bin.documents.filter(d => d.status === 'pending').length
  const approvedCount = bin.documents.filter(d => d.status === 'approved').length
  const rejectedCount = bin.documents.filter(d => d.status === 'rejected').length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle2 className="h-3 w-3 text-green-600" />
      case 'rejected': return <XCircle className="h-3 w-3 text-red-600" />
      default: return <Clock className="h-3 w-3 text-yellow-600" />
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs">
                {bin.evidenceIndicator}
              </Badge>
              {documentCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {documentCount} {documentCount === 1 ? 'doc' : 'docs'}
                </Badge>
              )}
            </div>
            <CardTitle className="text-base leading-tight">{bin.title}</CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUpload(bin.evidenceIndicator)}
            className="shrink-0"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {bin.description}
        </CardDescription>
      </CardHeader>
      
      {documentCount > 0 && (
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {approvedCount > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                <span>{approvedCount}</span>
              </div>
            )}
            {pendingCount > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-yellow-600" />
                <span>{pendingCount}</span>
              </div>
            )}
            {rejectedCount > 0 && (
              <div className="flex items-center gap-1">
                <XCircle className="h-3 w-3 text-red-600" />
                <span>{rejectedCount}</span>
              </div>
            )}
          </div>
          
          <div className="mt-3 space-y-1">
            {bin.documents.slice(0, 2).map(doc => (
              <div key={doc.id} className="flex items-center justify-between gap-2 text-xs group">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-primary hover:underline"
                    >
                      {doc.fileName}
                    </a>
                  ) : (
                    <span className="truncate text-muted-foreground">{doc.fileName}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getStatusIcon(doc.status)}
                </div>
              </div>
            ))}
            {bin.documents.length > 2 && (
              <div className="text-xs text-muted-foreground pl-5">
                +{bin.documents.length - 2} more
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
