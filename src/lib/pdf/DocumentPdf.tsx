import { Document, Font, Line, Page, Rect, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import { site } from "@/content/site";
import type { DocumentBundle } from "@/lib/portal/documents";
import { KIND_LABEL, KIND_LABEL_NL, formatDate, formatMoney } from "@/lib/portal/labels";

const fontUrl = (file: string) => `${site.url}/fonts/${file}`;

Font.register({
  family: "Cormorant",
  fonts: [
    { src: fontUrl("cormorant-500.ttf"), fontWeight: 500 },
    { src: fontUrl("cormorant-500-italic.ttf"), fontWeight: 500, fontStyle: "italic" },
  ],
});
Font.register({
  family: "Outfit",
  fonts: [
    { src: fontUrl("outfit-300.ttf"), fontWeight: 300 },
    { src: fontUrl("outfit-400.ttf"), fontWeight: 400 },
    { src: fontUrl("outfit-500.ttf"), fontWeight: 500 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const INK = "#0a0908";
const CREAM = "#f4eee2";
const TAUPE = "#978c78";
const CHAMPAGNE = "#c9b48c";
const LINE = "#d9cfb9";

const styles = StyleSheet.create({
  page: { backgroundColor: CREAM, color: INK, fontFamily: "Outfit", fontWeight: 300, fontSize: 9.5, paddingTop: 54, paddingBottom: 64, paddingHorizontal: 54 },
  eyebrow: { fontFamily: "Outfit", fontWeight: 400, fontSize: 7, letterSpacing: 2.2, textTransform: "uppercase", color: TAUPE },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontFamily: "Cormorant", fontWeight: 500, fontSize: 30, lineHeight: 1.05, marginTop: 22 },
  subtitle: { fontFamily: "Cormorant", fontWeight: 500, fontStyle: "italic", fontSize: 14, color: "#4a4238", marginTop: 4 },
  metaGrid: { flexDirection: "row", marginTop: 26, borderTopWidth: 0.6, borderTopColor: LINE, paddingTop: 14 },
  metaCol: { flex: 1, paddingRight: 16 },
  metaLabel: { fontFamily: "Outfit", fontWeight: 400, fontSize: 6.5, letterSpacing: 2, textTransform: "uppercase", color: TAUPE, marginBottom: 5 },
  metaText: { fontSize: 9.5, lineHeight: 1.5 },
  table: { marginTop: 28 },
  th: { flexDirection: "row", borderBottomWidth: 0.6, borderBottomColor: INK, paddingBottom: 6 },
  tr: { flexDirection: "row", borderBottomWidth: 0.4, borderBottomColor: LINE, paddingVertical: 8 },
  cDesc: { flex: 1, paddingRight: 12 },
  cQty: { width: 48, textAlign: "right" },
  cUnit: { width: 78, textAlign: "right" },
  cTotal: { width: 84, textAlign: "right" },
  totals: { marginTop: 14, alignSelf: "flex-end", width: 230 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  grand: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 0.6, borderTopColor: INK, marginTop: 6, paddingTop: 8 },
  grandText: { fontFamily: "Cormorant", fontWeight: 500, fontSize: 16 },
  body: { marginTop: 26, fontSize: 9.5, lineHeight: 1.7 },
  bodyPara: { marginBottom: 8 },
  signBox: { marginTop: 28, borderTopWidth: 0.6, borderTopColor: INK, paddingTop: 12 },
  signName: { fontFamily: "Cormorant", fontWeight: 500, fontStyle: "italic", fontSize: 20, marginTop: 4 },
  signMeta: { fontSize: 7.5, lineHeight: 1.6, color: TAUPE, marginTop: 6 },
  footer: { position: "absolute", left: 54, right: 54, bottom: 30, borderTopWidth: 0.6, borderTopColor: LINE, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 6.5, letterSpacing: 1.6, textTransform: "uppercase", color: TAUPE },
  closing: { marginTop: 30, fontFamily: "Cormorant", fontWeight: 500, fontStyle: "italic", fontSize: 13, color: "#4a4238" },
});

/** The interlocking frames, drawn as vector strokes (front frame knocks out the back). */
function Mark({ size = 40 }: { size?: number }) {
  const s = size / 120;
  return (
    <Svg width={120 * s} height={92 * s} viewBox="0 0 120 92">
      <Rect x={4.1} y={4.1} width={78.3} height={60.9} rx={6.9} ry={6.9} stroke={INK} strokeWidth={4} fill="none" />
      <Rect x={45.1} y={24.2} width={70.8} height={63.7} rx={6.9} ry={6.9} stroke={INK} strokeWidth={4} fill={CREAM} />
      <Line x1={25.3} y1={49.6} x2={72.3} y2={49.6} stroke={INK} strokeWidth={4} />
    </Svg>
  );
}

const words = (nl: boolean) => ({
  from: nl ? "Van" : "From",
  to: nl ? "Voor" : "For",
  details: nl ? "Gegevens" : "Details",
  issued: nl ? "Datum" : "Issued",
  due: nl ? "Vervaldatum" : "Due",
  validUntil: nl ? "Geldig tot" : "Valid until",
  project: nl ? "Project" : "Project",
  description: nl ? "Omschrijving" : "Description",
  qty: nl ? "Aantal" : "Qty",
  unit: nl ? "Prijs" : "Unit",
  amount: nl ? "Bedrag" : "Amount",
  subtotal: nl ? "Subtotaal" : "Subtotal",
  vat: nl ? "Btw" : "VAT",
  total: nl ? "Totaal" : "Total",
  noVat: nl ? "Btw niet van toepassing" : "VAT not applicable",
  payBy: nl ? "Te betalen vóór" : "Please pay by",
  iban: "IBAN",
  reference: nl ? "Mededeling" : "Reference",
  draft: nl ? "Ontwerp" : "Draft",
  signedBy: nl ? "Elektronisch getekend door" : "Electronically signed by",
  signedOn: nl ? "op" : "on",
  hash: nl ? "Documentvingerafdruk" : "Document fingerprint",
});

const formatMoment = (value: string, nl: boolean) =>
  new Date(value).toLocaleString(nl ? "nl-BE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Brussels",
  });

export default function DocumentPdf({ document, lines, client, studio, project, signatures }: DocumentBundle) {
  const nl = client.language === "nl";
  const t = words(nl);
  const kindLabel = (nl ? KIND_LABEL_NL : KIND_LABEL)[document.kind];
  const number = document.number ?? t.draft;
  const isMoney = document.kind === "quote" || document.kind === "invoice";
  const paragraphs = (document.body ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <Document title={`${kindLabel} ${number} · ${studio.name}`} author={studio.name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>{studio.name}</Text>
            <Text style={[styles.eyebrow, { marginTop: 3, color: CHAMPAGNE }]}>{site.tagline}</Text>
          </View>
          <Mark size={44} />
        </View>

        <Text style={styles.title}>
          {kindLabel} {number}
        </Text>
        <Text style={styles.subtitle}>{document.title}</Text>

        <View style={styles.metaGrid}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>{t.to}</Text>
            <Text style={styles.metaText}>
              {client.name}
              {client.company ? `\n${client.company}` : ""}
              {client.address_line1 ? `\n${client.address_line1}` : ""}
              {client.postal_code || client.city ? `\n${[client.postal_code, client.city].filter(Boolean).join(" ")}` : ""}
              {client.vat_number ? `\n${t.vat} ${client.vat_number}` : ""}
              {`\n${client.email}`}
            </Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>{t.from}</Text>
            <Text style={styles.metaText}>
              {studio.name}
              {studio.address_line1 ? `\n${studio.address_line1}` : ""}
              {studio.postal_code || studio.city ? `\n${[studio.postal_code, studio.city].filter(Boolean).join(" ")}` : ""}
              {studio.vat_number ? `\n${t.vat} ${studio.vat_number}` : ""}
              {`\n${studio.email}`}
            </Text>
          </View>
          <View style={[styles.metaCol, { paddingRight: 0 }]}>
            <Text style={styles.metaLabel}>{t.details}</Text>
            <Text style={styles.metaText}>
              {`${t.issued}: ${formatDate(document.issue_date)}`}
              {document.due_date ? `\n${document.kind === "quote" ? t.validUntil : t.due}: ${formatDate(document.due_date)}` : ""}
              {project ? `\n${t.project}: ${project.title}` : ""}
            </Text>
          </View>
        </View>

        {isMoney && lines.length ? (
          <View style={styles.table}>
            <View style={styles.th}>
              <Text style={[styles.cDesc, styles.metaLabel, { marginBottom: 0 }]}>{t.description}</Text>
              <Text style={[styles.cQty, styles.metaLabel, { marginBottom: 0 }]}>{t.qty}</Text>
              <Text style={[styles.cUnit, styles.metaLabel, { marginBottom: 0 }]}>{t.unit}</Text>
              <Text style={[styles.cTotal, styles.metaLabel, { marginBottom: 0 }]}>{t.amount}</Text>
            </View>
            {lines.map((line) => (
              <View key={line.id} style={styles.tr} wrap={false}>
                <Text style={styles.cDesc}>{line.description}</Text>
                <Text style={styles.cQty}>{Number(line.quantity).toLocaleString("nl-BE")}</Text>
                <Text style={styles.cUnit}>{formatMoney(line.unit_price_cents, document.currency)}</Text>
                <Text style={styles.cTotal}>{formatMoney(line.line_total_cents, document.currency)}</Text>
              </View>
            ))}
            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text>{t.subtotal}</Text>
                <Text>{formatMoney(document.subtotal_cents, document.currency)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text>{Number(document.vat_rate) > 0 ? `${t.vat} ${Number(document.vat_rate)}%` : t.noVat}</Text>
                <Text>{formatMoney(document.vat_cents, document.currency)}</Text>
              </View>
              <View style={styles.grand}>
                <Text style={styles.grandText}>{t.total}</Text>
                <Text style={styles.grandText}>{formatMoney(document.total_cents, document.currency)}</Text>
              </View>
            </View>
          </View>
        ) : null}

        {paragraphs.length ? (
          <View style={styles.body}>
            {paragraphs.map((paragraph, index) => (
              <Text key={index} style={styles.bodyPara}>
                {paragraph}
              </Text>
            ))}
          </View>
        ) : null}

        {document.kind === "invoice" ? (
          <View style={[styles.body, { marginTop: 22 }]}>
            {document.due_date ? <Text>{`${t.payBy} ${formatDate(document.due_date)}.`}</Text> : null}
            {studio.iban ? <Text>{`${t.iban} ${studio.iban}`}</Text> : null}
            {document.number ? <Text>{`${t.reference} ${document.number}`}</Text> : null}
          </View>
        ) : null}

        {signatures.map((signature) => (
          <View key={signature.id} style={styles.signBox} wrap={false}>
            <Text style={styles.metaLabel}>{t.signedBy}</Text>
            <Text style={styles.signName}>{signature.signer_name}</Text>
            <Text style={styles.signMeta}>
              {`${signature.signer_email} · ${t.signedOn} ${formatMoment(signature.signed_at, nl)}${signature.ip ? ` · IP ${signature.ip}` : ""}`}
            </Text>
            <Text style={styles.signMeta}>{`${t.hash} ${signature.document_hash}`}</Text>
          </View>
        ))}

        <Text style={styles.closing}>{studio.invoice_footer}</Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{studio.name}</Text>
          <Text style={styles.footerText}>{studio.website.replace(/^https?:\/\//, "")}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
