"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, UploadCloud, FolderLock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocumentCard } from "@/components/vault/DocumentCard";
import { trpc } from "@/lib/trpc/client";

export default function VaultPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data, refetch, isLoading } = trpc.document.list.useQuery({
    searchQuery: search || undefined,
    type: filterType !== "all" ? filterType : undefined,
  });

  const documents = data?.items || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Document Vault</h1>
          <p className="text-sm text-muted-foreground">
            Encrypted repository of your contracts, agreements, and policies stored in Cloudflare R2.
          </p>
        </div>
        <Button variant="gradient" asChild className="gap-2">
          <Link href="/dashboard/upload">
            <UploadCloud className="h-4 w-4" />
            Upload New
          </Link>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents by title or text content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="All File Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All File Types</SelectItem>
              <SelectItem value="pdf">PDF Documents</SelectItem>
              <SelectItem value="docx">DOCX Word</SelectItem>
              <SelectItem value="url">Web URLs</SelectItem>
              <SelectItem value="screenshot">Screenshot OCR</SelectItem>
              <SelectItem value="paste">Pasted Text</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Document Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-muted-foreground">
          Loading documents from vault...
        </div>
      ) : documents.length === 0 ? (
        <div className="border border-dashed rounded-2xl py-16 text-center space-y-4 max-w-md mx-auto">
          <FolderLock className="h-10 w-10 text-muted-foreground/50 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">No documents found</h3>
            <p className="text-xs text-muted-foreground">
              {search ? "No documents match your search query." : "Your vault is currently empty."}
            </p>
          </div>
          <Button size="sm" variant="gradient" asChild>
            <Link href="/dashboard/upload">Add Document</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onDelete={() => refetch()} />
          ))}
        </div>
      )}
    </div>
  );
}
