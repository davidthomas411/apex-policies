'use client'

import { useState, useEffect } from 'react'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { PolicyBinCard } from '@/components/policy-bin-card'
import { BulkUploadDialog } from '@/components/bulk-upload-dialog'
import { SingleUploadDialog } from '@/components/single-upload-dialog'
import { policyBins, policyCategories, PolicyDocument } from '@/lib/policy-data'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { loadMetadata, saveMetadata } from '@/app/actions/metadata'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false)
  const [singleUploadOpen, setSingleUploadOpen] = useState(false)
  const [singleUploadIndicator, setSingleUploadIndicator] = useState<string | null>(null)
  const [bins, setBins] = useState(policyBins)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const savedBins = await loadMetadata()
      if (savedBins) {
        setBins(savedBins)
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleUploadComplete = async (documents: PolicyDocument[]) => {
    let updatedBins: PolicyBin[] = []

    setBins(prevBins => {
      const newBinsArray = prevBins.map(bin => {
        const newDocuments = documents
          .filter(doc => doc.evidenceIndicator === bin.evidenceIndicator)
          .map(doc => ({
            ...doc,
            category: bin.category,
          }))

        if (newDocuments.length === 0) {
          return bin
        }

        return {
          ...bin,
          documents: [...bin.documents, ...newDocuments],
        }
      })

      updatedBins = newBinsArray
      return newBinsArray
    })

    if (updatedBins.length > 0) {
      await saveMetadata(updatedBins)
    }

    return updatedBins
  }

  const handleSingleUpload = (indicator: string) => {
    setSingleUploadIndicator(indicator)
    setSingleUploadOpen(true)
  }

  const filteredBins = bins.filter(bin => {
    const matchesCategory = selectedCategory === null || 
      policyCategories.find(c => c.id === selectedCategory)?.name === bin.category

    const normalizedQuery = searchQuery.toLowerCase()
    const matchesDocuments = normalizedQuery === '' ? false : bin.documents.some(doc =>
      doc.fileName.toLowerCase().includes(normalizedQuery)
    )
    const matchesSearch = searchQuery === '' ||
      bin.title.toLowerCase().includes(normalizedQuery) ||
      bin.evidenceIndicator.toLowerCase().includes(normalizedQuery) ||
      bin.description.toLowerCase().includes(normalizedQuery) ||
      matchesDocuments
    
    return matchesCategory && matchesSearch
  })

  const selectedCategoryName = selectedCategory 
    ? policyCategories.find(c => c.id === selectedCategory)?.name 
    : 'All Categories'

  const totalDocuments = bins.reduce((sum, bin) => sum + bin.documents.length, 0)
  const totalBins = bins.length
  const binsWithDocs = bins.filter(b => b.documents.length > 0).length

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading policy bins...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-72 shrink-0 hidden md:block">
        <DashboardSidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onBulkUpload={() => setBulkUploadOpen(true)}
        />
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="container py-6 max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold font-serif tracking-tight text-primary">
                  {selectedCategoryName}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredBins.length} evidence {filteredBins.length === 1 ? 'indicator' : 'indicators'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    <span className="font-bold text-primary">{totalDocuments}</span>
                    <span className="text-muted-foreground">documents</span>
                  </Badge>
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    <span className="font-bold text-primary">{binsWithDocs}/{totalBins}</span>
                    <span className="text-muted-foreground">bins filled</span>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by evidence indicator, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-secondary/30 border-secondary"
              />
            </div>
          </div>
        </div>

        <div className="container py-8 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBins.map((bin) => (
              <PolicyBinCard
                key={bin.evidenceIndicator}
                bin={bin}
                onUpload={handleSingleUpload}
              />
            ))}
          </div>

          {filteredBins.length === 0 && (
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground font-medium">
                No evidence indicators found matching your search.
              </p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </main>

      <SingleUploadDialog
        open={singleUploadOpen}
        evidenceIndicator={singleUploadIndicator}
        onOpenChange={(open) => {
          setSingleUploadOpen(open)
          if (!open) {
            setSingleUploadIndicator(null)
          }
        }}
        onUploadComplete={handleUploadComplete}
      />

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  )
}
