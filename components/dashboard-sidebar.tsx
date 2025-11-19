'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { policyCategories } from '@/lib/policy-data'
import { LayoutDashboard, Upload, Search } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'

interface DashboardSidebarProps {
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
  onBulkUpload: () => void
}

export function DashboardSidebar({ 
  selectedCategory, 
  onCategorySelect,
  onBulkUpload 
}: DashboardSidebarProps) {
  return (
    <div className="flex flex-col h-full border-r bg-gradient-to-b from-[#152456] to-[#0f1a3d] text-sidebar-foreground">
      <div className="p-6 pb-4">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="relative w-full h-20 rounded overflow-hidden shrink-0">
            <Image 
              src="/images/tju-logo-blue.jpg" 
              alt="Thomas Jefferson University" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-sidebar-foreground/90">APEx Policy Dashboard</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-sidebar-foreground/50" />
          <Input
            placeholder="Search policies..."
            className="pl-8 bg-sidebar-accent/20 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus-visible:ring-sidebar-primary"
          />
        </div>

        <Button 
          onClick={onBulkUpload}
          className="w-full gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Upload className="h-4 w-4" />
          Bulk Upload
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 pb-4 space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              selectedCategory === null && "bg-sidebar-accent font-medium"
            )}
            onClick={() => onCategorySelect(null)}
          >
            <LayoutDashboard className="h-4 w-4" />
            All Categories
          </Button>

          <div className="pt-4 pb-2">
            <p className="text-xs font-semibold text-sidebar-foreground/60 px-3 uppercase tracking-wider">
              Categories
            </p>
          </div>

          {policyCategories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-auto py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                selectedCategory === category.id && "bg-sidebar-accent text-sidebar-foreground font-medium"
              )}
              onClick={() => onCategorySelect(category.id)}
            >
              <span className="truncate">{category.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
            AU
          </div>
          <div className="text-sm">
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-sidebar-foreground/60">admin@jefferson.edu</p>
          </div>
        </div>
      </div>
    </div>
  )
}
