import { renderToBuffer } from "@react-pdf/renderer";
import DocumentPdf from "@/lib/pdf/DocumentPdf";
import type { DocumentBundle } from "@/lib/portal/documents";
import { KIND_LABEL } from "@/lib/portal/labels";

/** Renders a document bundle to a PDF buffer plus a tidy filename. */
export async function renderDocumentPdf(bundle: DocumentBundle) {
  const buffer = await renderToBuffer(<DocumentPdf {...bundle} />);
  const label = KIND_LABEL[bundle.document.kind];
  const stem = (bundle.document.number ?? `${label}-draft`).replace(/[^\w.-]+/g, "-");
  return { buffer, filename: `${stem}.pdf` };
}
