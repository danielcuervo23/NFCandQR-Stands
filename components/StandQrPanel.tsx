"use client";

import { Download, ExternalLink } from "lucide-react";

export default function StandQrPanel({
  standId,
  baseUrl,
}: {
  standId: string;
  baseUrl: string;
}) {
  const nfcUrl = `${baseUrl}/r/${standId}?src=nfc`;
  const qrUrl = `${baseUrl}/r/${standId}?src=qr`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-2">
          Código QR (para litografía / corte láser)
        </h3>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/admin/stands/${standId}/qr?format=png`}
          alt={`QR de ${standId}`}
          className="w-40 h-40 border border-slate-200 rounded-lg"
        />
        <div className="flex gap-2 mt-3">
          <a
            href={`/admin/stands/${standId}/qr?format=svg`}
            className="flex items-center gap-1.5 text-xs font-medium border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            SVG
          </a>
          <a
            href={`/admin/stands/${standId}/qr?format=png`}
            className="flex items-center gap-1.5 text-xs font-medium border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50"
          >
            <Download className="w-3.5 h-3.5" />
            PNG
          </a>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4 space-y-2">
        <h3 className="text-sm font-medium text-slate-700">
          Probar redirecciones
        </h3>
        <a
          href={nfcUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"
        >
          <span className="font-mono truncate">{nfcUrl}</span>
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 ml-2" />
        </a>
        <a
          href={qrUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50"
        >
          <span className="font-mono truncate">{qrUrl}</span>
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 ml-2" />
        </a>
        <p className="text-xs text-slate-400 pt-1">
          Estas son las URLs permanentes que se graban en el chip NFC y se
          imprimen en el QR físico del stand.
        </p>
      </div>
    </div>
  );
}
