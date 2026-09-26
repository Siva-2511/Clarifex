export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
}

/**
 * Downloads a file directly from Google Drive using the user's Google OAuth access token
 */
export async function downloadDriveFile(
  fileId: string,
  accessToken: string,
): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
  // 1. Fetch metadata first to know the name and MIME type
  const metaRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!metaRes.ok) {
    throw new Error(`Failed to fetch Google Drive metadata: ${metaRes.statusText}`);
  }

  const metadata: DriveFileMetadata = await metaRes.json();

  let downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  let finalMimeType = metadata.mimeType;

  // Handle Google Docs / Sheets exports
  if (metadata.mimeType === "application/vnd.google-apps.document") {
    downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=application/pdf`;
    finalMimeType = "application/pdf";
  }

  const contentRes = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!contentRes.ok) {
    throw new Error(`Failed to download Google Drive content: ${contentRes.statusText}`);
  }

  const arrayBuffer = await contentRes.arrayBuffer();
  return {
    buffer: Buffer.from(arrayBuffer),
    fileName: metadata.name.endsWith(".pdf") || metadata.mimeType !== "application/vnd.google-apps.document"
      ? metadata.name
      : `${metadata.name}.pdf`,
    mimeType: finalMimeType,
  };
}
