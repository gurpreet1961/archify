// @ts-ignore
import puter from "@heyputer/puter.js";
import { ARCHIFY_RENDER_PROMPT } from "./constants";

export const fetchAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const generate3DView = async ({ sourceImage }: Generate3DViewParams) => {
    const dataUrl = sourceImage.startsWith('data:')
        ? sourceImage
        : await fetchAsDataUrl(sourceImage);

    console.log('[generate3DView] image size:', Math.round(dataUrl.length / 1024), 'KB');

    // Use puter.ai.chat() instead of txt2img because txt2img encodes
    // everything into the URL, which triggers Cloudflare 414 errors.
    // The chat API sends data via POST body — no size limits.
    const response = await puter.ai.chat(
        ARCHIFY_RENDER_PROMPT,
        dataUrl,   // image parameter: accepts data URL directly
        {
            model: "google/gemini-2.5-flash-image",
        }
    );

    console.log('[generate3DView] chat response:', JSON.stringify(response, null, 2).substring(0, 500));

    // The chat API response format varies. Try multiple extraction paths.
    const resp = response as any;

    // 1. Response has images array on message (Puter Gemini image generation format)
    if (resp?.message?.images && Array.isArray(resp.message.images)) {
        for (const img of resp.message.images) {
            const url = img?.image_url?.url;
            if (url) {
                const renderedImage = url.startsWith('data:') ? url : await fetchAsDataUrl(url);
                return { renderedImage, renderedPath: undefined };
            }
        }
    }

    // 2. Direct message text that is a data URL
    if (resp?.message?.content && typeof resp.message.content === 'string') {
        if (resp.message.content.startsWith('data:image/')) {
            return { renderedImage: resp.message.content, renderedPath: undefined };
        }
    }

    // 2. Response has inline_data in parts (Gemini multimodal response)
    if (resp?.message?.content && Array.isArray(resp.message.content)) {
        for (const part of resp.message.content) {
            // { type: 'image', source: { data, media_type } }
            if (part?.type === 'image' && part?.source?.data) {
                const renderedImage = `data:${part.source.media_type || 'image/png'};base64,${part.source.data}`;
                return { renderedImage, renderedPath: undefined };
            }
            // { inline_data: { data, mime_type } }
            if (part?.inline_data?.data) {
                const renderedImage = `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`;
                return { renderedImage, renderedPath: undefined };
            }
            // { type: 'image_url', image_url: { url } }
            if (part?.type === 'image_url' && part?.image_url?.url) {
                const url = part.image_url.url;
                const renderedImage = url.startsWith('data:') ? url : await fetchAsDataUrl(url);
                return { renderedImage, renderedPath: undefined };
            }
        }
    }

    // 3. Response is an HTMLImageElement (unlikely from chat but possible)
    if (resp instanceof HTMLImageElement && resp.src) {
        if (resp.src.startsWith('data:image/')) {
            return { renderedImage: resp.src, renderedPath: undefined };
        }
    }

    // 4. Response has an image property
    if (resp?.image) {
        const src = typeof resp.image === 'string' ? resp.image : resp.image?.src;
        if (src) {
            const renderedImage = src.startsWith('data:') ? src : await fetchAsDataUrl(src);
            return { renderedImage, renderedPath: undefined };
        }
    }

    // 5. Plain string response
    if (typeof resp === 'string' && resp.startsWith('data:image/')) {
        return { renderedImage: resp, renderedPath: undefined };
    }

    // 6. Try toString
    const text = resp?.toString?.() ?? String(resp);
    if (text.startsWith('data:image/')) {
        return { renderedImage: text, renderedPath: undefined };
    }

    console.warn('[generate3DView] Could not extract image. Response keys:', resp ? Object.keys(resp) : 'null');
    return { renderedImage: null, renderedPath: undefined };
}