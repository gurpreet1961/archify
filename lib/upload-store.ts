/**
 * In-memory store for uploaded image data between route navigations.
 * Avoids sessionStorage quota limits for large Base64 strings.
 */
const uploadStore = new Map<string, string>();

export function setUploadData(projectId: string, base64Data: string): void {
    uploadStore.set(projectId, base64Data);
}

export function getUploadData(projectId: string): string | null {
    return uploadStore.get(projectId) ?? null;
}

export function removeUploadData(projectId: string): void {
    uploadStore.delete(projectId);
}
