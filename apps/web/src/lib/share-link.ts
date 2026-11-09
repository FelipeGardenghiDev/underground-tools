import { InputListChannel, StageItem, TechRider } from '@/types';

export interface ShareableStageData {
  version: string;
  sharedAt: string;
  bandName: string;
  stageItems: StageItem[];
  inputList?: InputListChannel[];
  techRider?: Partial<TechRider>;
}

// Converte Uint8Array para Base64 URL-safe (sem +, / ou =)
function uint8ArrayToBase64Url(uint8: Uint8Array): string {
  let binary = '';
  const len = uint8.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Converte Base64 URL-safe de volta para Uint8Array
function base64UrlToUint8Array(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compacta os dados do palco/rider usando a CompressionStream nativa do navegador (gzip/deflate)
 * e devolve uma string URL-safe compacta para ser usada como fragmento de hash (#plot=...)
 */
export async function encodeShareData(data: ShareableStageData): Promise<string> {
  const jsonStr = JSON.stringify(data);

  if (typeof CompressionStream !== 'undefined') {
    try {
      const cs = new CompressionStream('deflate');
      const writer = cs.writable.getWriter();
      writer.write(new TextEncoder().encode(jsonStr));
      writer.close();

      const chunks: Uint8Array[] = [];
      const reader = cs.readable.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }

      // Concatena todos os pedaços
      const totalLen = chunks.reduce((acc, c) => acc + c.byteLength, 0);
      const merged = new Uint8Array(totalLen);
      let offset = 0;
      for (const c of chunks) {
        merged.set(c, offset);
        offset += c.byteLength;
      }

      return 'v1.' + uint8ArrayToBase64Url(merged);
    } catch (e) {
      console.warn('[ShareLink] Falha ao comprimir com CompressionStream, usando fallback base64:', e);
    }
  }

  // Fallback se CompressionStream não estiver disponível
  return 'raw.' + encodeURIComponent(jsonStr);
}

/**
 * Descompacta a string contida no hash (#plot=...) de volta para o objeto de dados original
 */
export async function decodeShareData(encodedString: string): Promise<ShareableStageData | null> {
  if (!encodedString) return null;

  try {
    if (encodedString.startsWith('v1.')) {
      const rawPayload = encodedString.slice(3);
      const uint8 = base64UrlToUint8Array(rawPayload);

      if (typeof DecompressionStream !== 'undefined') {
        const ds = new DecompressionStream('deflate');
        const writer = ds.writable.getWriter();
        writer.write(uint8 as unknown as BufferSource);
        writer.close();

        const chunks: Uint8Array[] = [];
        const reader = ds.readable.getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          if (value) chunks.push(value);
        }

        const totalLen = chunks.reduce((acc, c) => acc + c.byteLength, 0);
        const merged = new Uint8Array(totalLen);
        let offset = 0;
        for (const c of chunks) {
          merged.set(c, offset);
          offset += c.byteLength;
        }

        const jsonStr = new TextDecoder().decode(merged);
        return JSON.parse(jsonStr) as ShareableStageData;
      }
    } else if (encodedString.startsWith('raw.')) {
      const jsonStr = decodeURIComponent(encodedString.slice(4));
      return JSON.parse(jsonStr) as ShareableStageData;
    }
  } catch (err) {
    console.error('[ShareLink] Erro ao decodificar link de palco compartilhado:', err);
  }

  return null;
}

/**
 * Cria a URL completa compartilhável pronta para envio no WhatsApp/Email
 */
export async function generateShareableUrl(data: ShareableStageData): Promise<string> {
  const token = await encodeShareData(data);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://underground-tools.vercel.app';
  return `${origin}/#plot=${token}`;
}
