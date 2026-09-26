"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadTab } from "./tabs/UploadTab";
import { PasteTab } from "./tabs/PasteTab";
import { UrlTab } from "./tabs/UrlTab";
import { DriveTab } from "./tabs/DriveTab";
import { ScreenshotTab } from "./tabs/ScreenshotTab";
import { BatchTab } from "./tabs/BatchTab";
import { UploadCloud, FileEdit, Globe, HardDrive, Camera, Layers } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

export function DocumentUploader() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upload");

  const runAnalysis = trpc.analysis.run.useMutation({
    onSuccess: (data) => {
      router.push(`/dashboard/analyse/${data.analysisId}`);
    },
  });

  const handleSingleSuccess = (doc: { id: string; name: string; text: string }) => {
    // Automatically trigger analysis and redirect
    runAnalysis.mutate({
      documentIds: [doc.id],
      comprehensionLevel: "eli-10",
    });
  };

  const handleBatchSuccess = (docs: { id: string; name: string; text: string }[]) => {
    runAnalysis.mutate({
      documentIds: docs.map((d) => d.id),
      comprehensionLevel: "eli-10",
    });
  };

  return (
    <Card className="glass-panel border-border/80 shadow-2xl max-w-4xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-extrabold tracking-tight">
          Ingest Legal Documents
        </CardTitle>
        <CardDescription>
          Choose from 6 secure input channels to import and extract legal context
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto p-1.5 gap-1 bg-muted/60 rounded-xl mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-1.5 py-2 text-xs">
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload</span>
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-1.5 py-2 text-xs">
              <FileEdit className="h-3.5 w-3.5" />
              <span>Paste</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-1.5 py-2 text-xs">
              <Globe className="h-3.5 w-3.5" />
              <span>URL Fetch</span>
            </TabsTrigger>
            <TabsTrigger value="drive" className="flex items-center gap-1.5 py-2 text-xs">
              <HardDrive className="h-3.5 w-3.5" />
              <span>Google Drive</span>
            </TabsTrigger>
            <TabsTrigger value="screenshot" className="flex items-center gap-1.5 py-2 text-xs">
              <Camera className="h-3.5 w-3.5" />
              <span>OCR Vision</span>
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-1.5 py-2 text-xs">
              <Layers className="h-3.5 w-3.5" />
              <span>Batch</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <UploadTab onSuccess={handleSingleSuccess} />
          </TabsContent>

          <TabsContent value="paste">
            <PasteTab onSuccess={handleSingleSuccess} />
          </TabsContent>

          <TabsContent value="url">
            <UrlTab onSuccess={handleSingleSuccess} />
          </TabsContent>

          <TabsContent value="drive">
            <DriveTab onSuccess={handleSingleSuccess} />
          </TabsContent>

          <TabsContent value="screenshot">
            <ScreenshotTab onSuccess={handleSingleSuccess} />
          </TabsContent>

          <TabsContent value="batch">
            <BatchTab onSuccess={handleBatchSuccess} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
