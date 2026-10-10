import React, { useEffect, useRef, useState } from "react";

/* ────────────────────────────── Constantes ────────────────────────────── */

export const NAVY = "#1B2A4A";
export const GOLD = "#9A7B2F";
export const GOLD_LIGHT = "#E3C878"; // or éclairci pour le texte sur fond marine (contraste)
export const PASTOR = "Pasteur Bequel CHERELUS";
export const CHURCH = "Église du Nazaréen de Damé";
export const SITE = "www.eglisedunazareendedame.org";
export const DEFAULT_PASSWORD = "Nazareen2026"; // À CHANGER
export const AUTH_KEY = "end_secretariat_auth";

/* ────────────────────────────── Types ────────────────────────────── */

export type Status = "En cours" | "En attente" | "Terminé";
export interface Metric { label: string; value: string }
export interface Project {
  id: string; title: string; category: string; partner: string; leader: string;
  description: string; status: Status; url: string; metrics: Metric[]; archived: boolean;
}
export interface Member { id: string; name: string; phone: string; ministry: string; baptismDate: string }
export interface EventItem {
  id: string; title: string; kind: string; date: string; time: string;
  location: string; description: string; published: boolean;
}
export interface Sermon {
  id: string; title: string; speaker: string; passage: string; date: string;
  audioUrl: string; fileName?: string;
}
export interface Announcement {
  id: string; title: string; content: string; date: string;
  priority: "Normale" | "Importante"; published: boolean;
}
export type DocType = "bapteme" | "recommandation" | "attestation" | "invitation";
export type DocValues = Record<string, string>;
export interface IssuedDoc { id: string; ref: string; type: DocType; issueDate: string; recipient: string; values: DocValues }
export interface BuiltDoc { ref: string; title: string; paragraphs: string[]; place: string }
export type Notify = (msg: string, kind?: "ok" | "error") => void;
export type SectionId = "accueil" | "projets" | "documents" | "membres" | "agenda" | "medias";

/* ────────────────────────────── Utilitaires ────────────────────────────── */

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
export const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const addDays = (n: number) => { const d = new Date(); d.setDate(d.getDate() + n); return toISO(d); };
export const parseDate = (iso: string) => new Date(iso + "T12:00:00");
export const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  const d = parseDate(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};
export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const isHttpUrl = (s: string) => /^https?:\/\/\S+\.\S+/i.test(s);
export const isAudioSource = (s: string) => isHttpUrl(s) || s.startsWith("/") || s.startsWith("blob:") || s.startsWith("data:");
export const slug = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function downloadFile(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

export interface CsvExportOptions {
  delimiter?: ";" | ",";
  includeMetadata?: boolean;
  fileNamePrefix?: string;
}

export function buildMembersCsvRows(list: Member[], includeMetadata = true): string[][] {
  const exportDate = fmtDate(todayISO());
  const headers = [
    "N°",
    "Nom complet",
    "Téléphone",
    "Ministère / Groupe",
    "Statut de baptême",
    "Date de baptême (ISO)",
    "Date de baptême (Formatée)",
    ...(includeMetadata ? ["Assemblée", "Date d'exportation"] : []),
  ];
  const dataRows = list.map((m, idx) => [
    String(idx + 1),
    m.name || "",
    m.phone || "Non renseigné",
    m.ministry || "Assemblée générale",
    m.baptismDate ? "Baptisé(e)" : "Non renseigné",
    m.baptismDate || "",
    m.baptismDate ? fmtDate(m.baptismDate) : "Non renseignée",
    ...(includeMetadata ? [CHURCH, exportDate] : []),
  ]);
  return [headers, ...dataRows];
}

export function exportMembersToCsv(list: Member[], options: CsvExportOptions = {}): string {
  const delimiter = options.delimiter || ";";
  const includeMetadata = options.includeMetadata !== false;
  const prefix = options.fileNamePrefix || "registre-membres-nazareen-dame";
  const cell = (s: string) => `"${String(s ?? "").replace(/"/g, '""')}"`;
  const rows = buildMembersCsvRows(list, includeMetadata);
  // BOM UTF-8 (\uFEFF) pour une ouverture directe avec accents dans Excel, LibreOffice et Google Sheets
  const csv = "\uFEFF" + rows.map((r) => r.map(cell).join(delimiter)).join("\r\n");
  const fileName = `${prefix}-${todayISO()}.csv`;
  downloadFile(fileName, csv, "text/csv;charset=utf-8");
  return fileName;
}

/** Fichiers audio choisis depuis l'appareil : disponibles pendant la session seulement. */
export const localAudioUrls: Record<string, string> = {};

/** localStorage avec try/catch et notification live vers les vues publiques. */
export function useStored<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch { /* ignore */ }
    return typeof initial === "function" ? (initial as () => T)() : initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("end_sec_updated", { detail: { key, value } }));
        if (key === "end_sec_projects" || key === "end_sec_announcements") {
          window.dispatchEvent(new CustomEvent("dame_publications_updated", { detail: { key, value } }));
        }
        if (key === "end_sec_events") {
          window.dispatchEvent(new CustomEvent("dame_events_updated", { detail: { key, value } }));
        }
      }
    } catch { /* ignore */ }
  }, [key, value]);
  return [value, setValue] as const;
}

/* ────────────────────────────── Icônes ────────────────────────────── */

const ICONS: Record<string, string> = {
  dashboard: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  file: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h6",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M21 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3",
  lock: "M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V7a4 4 0 0 1 8 0v4",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  plus: "M12 5v14M5 12h14",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6",
  archive: "M3 4h18v4H3zM5 8v12h14V8M10 12h4",
  print: "M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z",
  download: "M12 3v12M7 10l5 5 5-5M4 21h16",
  menu: "M3 6h18M3 12h18M3 18h18",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  megaphone: "M3 11v2a1 1 0 0 0 1 1h3l8 5V5L7 10H4a1 1 0 0 0-1 1zM19 8a5 5 0 0 1 0 8",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeOff: "M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 4M6.5 6.6A17 17 0 0 0 2 12s4 7 10 7a9.7 9.7 0 0 0 4-.9",
  restore: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
};

export function Icon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 ${className}`}>
      <path d={ICONS[name] || ""} />
    </svg>
  );
}

/* ────────────────────────────── Sceau officiel (SVG) ────────────────────────────── */

export function sealSvg(size = 110): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Sceau de l'${CHURCH}">
<defs>
<path id="sealTop" d="M 22 60 A 38 38 0 0 1 98 60"/>
<path id="sealBot" d="M 14 60 A 46 46 0 0 0 106 60"/>
</defs>
<circle cx="60" cy="60" r="58" fill="#fff" stroke="${GOLD}" stroke-width="2.5"/>
<circle cx="60" cy="60" r="54.5" fill="none" stroke="${NAVY}" stroke-width="0.8"/>
<circle cx="60" cy="60" r="34" fill="none" stroke="${NAVY}" stroke-width="0.8"/>
<circle cx="60" cy="60" r="29" fill="${NAVY}"/>
<circle cx="60" cy="60" r="26" fill="none" stroke="${GOLD}" stroke-width="0.8"/>
<path d="M60 46v28M50 55h20" stroke="${GOLD}" stroke-width="4.5" stroke-linecap="round"/>
<text font-family="Georgia,serif" font-size="8" font-weight="700" fill="${NAVY}" letter-spacing="0.6">
<textPath href="#sealTop" startOffset="50%" text-anchor="middle">ÉGLISE DU NAZARÉEN</textPath></text>
<text font-family="Georgia,serif" font-size="8" font-weight="700" fill="${NAVY}" letter-spacing="1.2">
<textPath href="#sealBot" startOffset="50%" text-anchor="middle">DAMÉ · HAÏTI</textPath></text>
</svg>`;
}

/* ────────────────────────────── Documents officiels ────────────────────────────── */

export interface FieldDef {
  key: string; label: string; type: "text" | "date" | "time" | "textarea" | "select";
  options?: string[]; required?: boolean; placeholder?: string; wide?: boolean;
}
export interface DocConfig { label: string; hint: string; fields: FieldDef[]; defaults: () => DocValues }

const CIVILITY: FieldDef = { key: "civility", label: "Frère / Sœur", type: "select", options: ["Frère", "Sœur"] };

export const DOC_CONFIG: Record<DocType, DocConfig> = {
  bapteme: {
    label: "Certificat de baptême", hint: "Atteste le baptême d'un fidèle.",
    fields: [
      CIVILITY,
      { key: "fullName", label: "Nom complet", type: "text", required: true, placeholder: "Prénom et nom" },
      { key: "birthDate", label: "Date de naissance", type: "date" },
      { key: "birthPlace", label: "Lieu de naissance", type: "text" },
      { key: "father", label: "Nom du père", type: "text" },
      { key: "mother", label: "Nom de la mère", type: "text" },
      { key: "baptismDate", label: "Date du baptême", type: "date", required: true },
      { key: "baptismPlace", label: "Lieu du baptême", type: "text" },
      { key: "officiant", label: "Officiant", type: "text", wide: true },
    ],
    defaults: () => ({ civility: "Frère", fullName: "", birthDate: "", birthPlace: "", father: "", mother: "", baptismDate: "", baptismPlace: "Damé", officiant: PASTOR }),
  },
  recommandation: {
    label: "Lettre de recommandation / transfert", hint: "Recommande ou transfère un membre vers une autre assemblée.",
    fields: [
      { key: "kind", label: "Type de lettre", type: "select", options: ["Lettre de recommandation", "Lettre de transfert"], wide: true },
      CIVILITY,
      { key: "fullName", label: "Nom complet", type: "text", required: true, placeholder: "Prénom et nom" },
      { key: "memberSince", label: "Membre depuis le", type: "date" },
      { key: "ministry", label: "Ministère / groupe", type: "text" },
      { key: "destination", label: "Église ou organisme destinataire", type: "text", required: true, wide: true },
      { key: "city", label: "Ville du destinataire", type: "text" },
      { key: "remarks", label: "Remarques du pasteur (facultatif)", type: "textarea", wide: true },
    ],
    defaults: () => ({ kind: "Lettre de recommandation", civility: "Frère", fullName: "", memberSince: "", ministry: "", destination: "", city: "", remarks: "" }),
  },
  attestation: {
    label: "Attestation de membre", hint: "Confirme l'appartenance d'une personne à l'église.",
    fields: [
      CIVILITY,
      { key: "fullName", label: "Nom complet", type: "text", required: true, placeholder: "Prénom et nom" },
      { key: "birthDate", label: "Date de naissance", type: "date" },
      { key: "memberSince", label: "Membre depuis le", type: "date" },
      { key: "ministry", label: "Ministère / groupe", type: "text" },
      { key: "purpose", label: "Délivrée pour", type: "text", wide: true },
    ],
    defaults: () => ({ civility: "Frère", fullName: "", birthDate: "", memberSince: "", ministry: "", purpose: "servir et valoir ce que de droit" }),
  },
  invitation: {
    label: "Invitation à la convention / au culte", hint: "Invite des personnes ou des églises à un événement.",
    fields: [
      { key: "recipient", label: "Destinataire", type: "text", wide: true },
      { key: "eventTitle", label: "Événement", type: "text", required: true, placeholder: "Ex. : Convention de réveil", wide: true },
      { key: "eventDate", label: "Date", type: "date", required: true },
      { key: "eventTime", label: "Heure", type: "time" },
      { key: "location", label: "Lieu", type: "text", wide: true },
      { key: "message", label: "Message personnel (facultatif)", type: "textarea", wide: true },
    ],
    defaults: () => ({ recipient: "Chers frères et sœurs en Christ", eventTitle: "", eventDate: "", eventTime: "", location: CHURCH, message: "" }),
  },
};
export const DOC_TYPES = Object.keys(DOC_CONFIG) as DocType[];
export const DOC_CODE: Record<DocType, string> = { bapteme: "BAP", recommandation: "REC", attestation: "ATT", invitation: "INV" };

export const makeRef = (type: DocType, n: number, issueDate: string) =>
  `DAME-${DOC_CODE[type]}-${(issueDate || todayISO()).slice(0, 4)}-${String(n).padStart(3, "0")}`;
export const recipientOf = (type: DocType, v: DocValues) => (type === "invitation" ? v.eventTitle : v.fullName) || "—";

export function buildDoc(type: DocType, v: DocValues, issueDate: string, ref: string): BuiltDoc {
  const ph = (x?: string, fallback = "………") => (x && x.trim() ? x.trim() : fallback);
  const sister = v.civility === "Sœur";
  const e = sister ? "e" : "";
  const le = sister ? "la" : "le";
  const civ = v.civility || "Frère";
  const name = `${civ} ${ph(v.fullName)}`;
  const place = `Fait à Damé, le ${fmtDate(issueDate)}`;
  const time = v.eventTime ? v.eventTime.replace(":", "h") : "";
  let title = "";
  const p: string[] = [];

  if (type === "bapteme") {
    title = "Certificat de baptême";
    const parents = [v.father, v.mother].filter((x) => x && x.trim());
    const filiation = parents.length ? `, ${sister ? "fille" : "fils"} de ${parents.join(" et de ")}` : "";
    const birth = v.birthDate ? `, né${e} le ${fmtDate(v.birthDate)}${v.birthPlace ? ` à ${v.birthPlace}` : ""}` : "";
    p.push(
      `Nous, soussignés, pasteur et secrétariat de l'${CHURCH}, certifions que ${name}${birth}${filiation}, a reçu le saint baptême d'eau le ${v.baptismDate ? fmtDate(v.baptismDate) : "………"}${v.baptismPlace ? ` à ${v.baptismPlace}` : ""}, ${v.officiant ? `des mains de ${v.officiant}, ` : ""}au nom du Père, du Fils et du Saint-Esprit.`,
      `Ce certificat atteste de son engagement public envers Jésus-Christ et de son entrée dans la communion de l'Église. « Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit. » (Matthieu 28:19)`,
    );
  } else if (type === "recommandation") {
    const kind = v.kind || "Lettre de recommandation";
    const transfer = /transfert/i.test(kind);
    title = kind;
    p.push(
      `Objet : ${kind} — ${name}`,
      `À l'attention de ${ph(v.destination)}${v.city ? `, ${v.city}` : ""}.`,
      `Par la présente, nous certifions que ${name} est membre de l'${CHURCH}${v.memberSince ? ` depuis le ${fmtDate(v.memberSince)}` : ""}${v.ministry ? ` et sert fidèlement dans le ministère « ${v.ministry} »` : ""}.`,
      transfer
        ? `Appelé${e} à poursuivre son cheminement chrétien auprès de vous, nous ${le} transférons avec joie et vous ${le} recommandons chaleureusement à votre communion fraternelle.`
        : `Nous ${le} recommandons chaleureusement à votre bienveillance et à votre communion fraternelle.`,
    );
    if (v.remarks && v.remarks.trim()) p.push(v.remarks.trim());
    p.push("Que le Seigneur vous bénisse richement. Fraternellement en Christ.");
  } else if (type === "attestation") {
    title = "Attestation de membre";
    p.push(
      `Nous, soussignés, attestons que ${name}${v.birthDate ? `, né${e} le ${fmtDate(v.birthDate)}` : ""}, est membre ${sister ? "active" : "actif"} de l'${CHURCH}${v.memberSince ? ` depuis le ${fmtDate(v.memberSince)}` : ""}${v.ministry ? ` et participe au ministère « ${v.ministry} »` : ""}.`,
      `Cette attestation lui est délivrée, à sa demande, pour ${ph(v.purpose, "servir et valoir ce que de droit")}.`,
    );
  } else {
    title = "Invitation";
    p.push(
      `${ph(v.recipient, "Chers frères et sœurs en Christ")},`,
      `La grâce et la paix de notre Seigneur Jésus-Christ soient avec vous. L'${CHURCH} a la joie de vous inviter à « ${ph(v.eventTitle)} », le ${v.eventDate ? fmtDate(v.eventDate) : "………"}${time ? `, à ${time}` : ""}${v.location ? `, à ${v.location}` : ""}.`,
    );
    if (v.message && v.message.trim()) p.push(v.message.trim());
    p.push("Votre présence sera une bénédiction pour toute l'assemblée. Soyez les bienvenus !");
  }
  return { ref, title, paragraphs: p, place };
}

/** HTML complet du document : sert à la fois à l'aperçu (iframe) et à l'impression / PDF. */
export function printHtml(doc: BuiltDoc): string {
  const paras = doc.paragraphs
    .map((t) => `<p${t.startsWith("Objet :") ? ' class="obj"' : ""}>${esc(t)}</p>`)
    .join("");
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>${esc(doc.title)} — ${esc(doc.ref)}</title>
<style>
@page{size:A4;margin:14mm}
*{box-sizing:border-box}
html,body{margin:0;background:#fff;color:#1c2540;font-family:Georgia,'Times New Roman',serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@media screen{body{padding:14mm}}
.frame{border:3px double ${GOLD};padding:12mm 15mm 10mm;min-height:268mm;display:flex;flex-direction:column}
.head{text-align:center;border-bottom:2px solid ${GOLD};padding-bottom:5mm}
.head .seal{display:flex;justify-content:center;margin-bottom:3mm}
.head h1{margin:0;font-size:20pt;letter-spacing:.05em;color:${NAVY};font-weight:700}
.head .sub{margin-top:1.5mm;font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#5b6678}
.ref{text-align:right;font-family:Arial,Helvetica,sans-serif;font-size:9pt;color:#5b6678;margin:5mm 0 0}
h2.title{text-align:center;font-size:20pt;color:${NAVY};margin:8mm 0 9mm;font-weight:700}
h2.title:after{content:"";display:block;width:36mm;height:2px;background:${GOLD};margin:3mm auto 0}
.body{flex:1}
.body p{font-size:12.5pt;line-height:1.7;text-align:justify;margin:0 0 5mm}
.body p.obj{font-weight:700;text-align:left}
.foot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:8mm;gap:8mm}
.place{font-size:11.5pt}
.sign{position:relative;width:72mm;padding-top:30mm;text-align:center}
.sign .seal{position:absolute;top:0;left:50%;margin-left:-53px}
.sign .line{border-top:1px solid ${NAVY};padding-top:2mm;font-weight:700;font-size:12pt}
.sign .role{font-family:Arial,Helvetica,sans-serif;font-size:9.5pt;color:#5b6678}
</style></head><body><div class="frame">
<div class="head"><div class="seal">${sealSvg(84)}</div>
<h1>${esc(CHURCH.toUpperCase())}</h1>
<div class="sub">Secrétariat paroissial · Damé, Haïti</div>
<div class="sub">${esc(SITE)}</div></div>
<div class="ref">Référence : ${esc(doc.ref)}</div>
<h2 class="title">${esc(doc.title)}</h2>
<div class="body">${paras}</div>
<div class="foot"><div class="place">${esc(doc.place)}</div>
<div class="sign"><div class="seal">${sealSvg(106)}</div><div class="line">${esc(PASTOR)}</div><div class="role">Pasteur de l'assemblée</div></div></div>
</div></body></html>`;
}

export function textVersion(doc: BuiltDoc): string {
  return [
    CHURCH.toUpperCase(), "Secrétariat paroissial · Damé, Haïti", SITE, "",
    `Référence : ${doc.ref}`, "", doc.title.toUpperCase(), "",
    ...doc.paragraphs.flatMap((t) => [t, ""]),
    doc.place, "", "[Sceau de l'église]", PASTOR, "Pasteur de l'assemblée",
  ].join("\n");
}

/** Impression sans popup : iframe invisible → boîte de dialogue d'impression (choisir « Enregistrer en PDF »). */
export function printDoc(doc: BuiltDoc) {
  const f = document.createElement("iframe");
  f.setAttribute("title", "Impression du document");
  f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  f.onload = () => {
    setTimeout(() => {
      f.contentWindow?.focus();
      f.contentWindow?.print();
      setTimeout(() => f.remove(), 60000);
    }, 250);
  };
  f.srcdoc = printHtml(doc);
  document.body.appendChild(f);
}

/* ────────────────────────────── Styles partagés ────────────────────────────── */

export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9A7B2F] focus-visible:ring-offset-2";
export const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#9A7B2F] focus:outline-none focus:ring-2 focus:ring-[#9A7B2F]/30";
export const btnBase = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`;
export const btnPrimary = `${btnBase} bg-[#1B2A4A] text-white hover:bg-[#24385f]`;
export const btnGold = `${btnBase} bg-[#9A7B2F] text-white hover:bg-[#836826]`;
export const btnGhost = `${btnBase} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`;
export const btnDanger = `${btnBase} bg-red-600 text-white hover:bg-red-700`;
export const iconBtn = `rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#1B2A4A] ${focusRing}`;
export const cardCls = "rounded-xl border border-slate-200 bg-white shadow-sm";

export const FontStyles = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,500;6..72,600;6..72,700&family=Figtree:wght@400;500;600;700&display=swap');
.es-root{font-family:'Figtree',ui-sans-serif,system-ui,sans-serif}
.es-serif{font-family:'Newsreader',Georgia,'Times New Roman',serif}
@media (prefers-reduced-motion: reduce){.es-root *{transition:none!important;animation:none!important}}
`}</style>
);

/* ────────────────────────────── Composants communs ────────────────────────────── */

export function Badge({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

export function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-600"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-red-600" role="alert">{error}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") closeRef.current(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#1B2A4A]/60 sm:items-center sm:p-4"
      role="dialog" aria-modal="true" aria-label={title}
      onMouseDown={(ev) => { if (ev.target === ev.currentTarget) onClose(); }}>
      <div className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h3 className="es-serif text-xl font-semibold text-[#1B2A4A]">{title}</h3>
          <button type="button" onClick={onClose} className={iconBtn} aria-label="Fermer"><Icon name="x" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: {
  title: string; message: string; confirmLabel: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" className={btnGhost} onClick={onCancel}>Annuler</button>
        <button type="button" className={btnDanger} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}

export function FormActions({ onCancel, submitLabel }: { onCancel: () => void; submitLabel: string }) {
  return (
    <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
      <button type="button" className={btnGhost} onClick={onCancel}>Annuler</button>
      <button type="submit" className={btnPrimary}><Icon name="check" size={16} />{submitLabel}</button>
    </div>
  );
}

export function SectionHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="es-serif text-2xl font-semibold text-[#1B2A4A] sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative min-w-[200px] flex-1">
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input type="search" value={value} onChange={(ev) => onChange(ev.target.value)} placeholder={placeholder}
        aria-label={placeholder} className={`${inputCls} pl-10`} />
    </div>
  );
}

export function EmptyState({ title, hint, children }: { title: string; hint: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="font-semibold text-slate-700">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{hint}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

/* ────────────────────────────── Données d'exemple ────────────────────────────── */

export const seedProjects = (): Project[] => [
  { id: "projet-honnold-solaire", title: "Projet d'Énergie Solaire Communautaire à Damé (Partenariat Honnold Foundation)", category: "Énergie", partner: "Honnold", leader: "Pasteur Bequel CHERELUS, Leader du Projet",
    description: "En partenariat avec la Honnold Foundation, l'Église du Nazaréen de Damé déploie un programme d'énergie solaire propre pour remplacer les lampes à kérosène toxiques et permettre aux élèves d'étudier en toute sécurité.",
    status: "En cours", url: "https://www.honnoldfoundation.org/partner/eglise-du-nazareen-de-dame", metrics: [{ label: "Stations solaires portables", value: "100" }, { label: "Élèves impactés", value: "300+" }, { label: "Femmes dans le Comité d'Énergie", value: "50%" }], archived: false },
  { id: uid(), title: "Élevage caprin communautaire", category: "Agriculture / Élevage", partner: "Église locale", leader: "Frère Samuel Jean-Baptiste",
    description: "Distribution de chèvres à des familles du quartier, avec formation à l'élevage et suivi vétérinaire.",
    status: "En cours", url: "", metrics: [{ label: "Familles bénéficiaires", value: "18" }, { label: "Chèvres distribuées", value: "40" }], archived: false },
  { id: uid(), title: "Compassion HA0926", category: "Parrainage d'enfants", partner: "Compassion", leader: "Sœur Marie-Carmelle Louis",
    description: "Centre d'accueil et de développement des enfants parrainés : soutien scolaire, santé, formation spirituelle.",
    status: "En cours", url: "", metrics: [{ label: "Enfants inscrits", value: "150" }, { label: "Tuteurs", value: "12" }], archived: false },
  { id: uid(), title: "Micro-crédit des femmes", category: "Économie / Microcrédit", partner: "Digicel", leader: "Sœur Nadège Pierre",
    description: "Petits prêts et accompagnement pour les femmes qui lancent ou développent une activité commerciale.",
    status: "En attente", url: "", metrics: [{ label: "Bénéficiaires visées", value: "40" }], archived: false },
];

export const seedMembers = (): Member[] => [
  { id: uid(), name: "Jean-Robert Pierre", phone: "+509 3700 0001", ministry: "Diaconat", baptismDate: addDays(-900) },
  { id: uid(), name: "Marie-Carmelle Louis", phone: "+509 3700 0002", ministry: "Femmes", baptismDate: addDays(-1500) },
  { id: uid(), name: "Wilner Joseph", phone: "+509 3700 0003", ministry: "Hommes", baptismDate: addDays(-700) },
  { id: uid(), name: "Nadège Pierre", phone: "+509 3700 0004", ministry: "Femmes", baptismDate: addDays(-420) },
  { id: uid(), name: "Esther Charles", phone: "+509 3700 0005", ministry: "Chorale", baptismDate: addDays(-40) },
  { id: uid(), name: "Samuel Jean-Baptiste", phone: "+509 3700 0006", ministry: "Jeunesse", baptismDate: addDays(-300) },
  { id: uid(), name: "Rachelle Étienne", phone: "+509 3700 0007", ministry: "École du dimanche", baptismDate: "" },
  { id: uid(), name: "Daniel Saint-Fleur", phone: "+509 3700 0008", ministry: "Intercession", baptismDate: addDays(-1100) },
];

export const seedEvents = (): EventItem[] => [
  { id: uid(), title: "Culte d'adoration du dimanche", kind: "Culte", date: addDays(3), time: "09:00", location: CHURCH,
    description: "Culte dominical avec école du dimanche à 8h00.", published: true },
  { id: uid(), title: "Veillée de prière", kind: "Réunion de prière", date: addDays(8), time: "18:00", location: CHURCH,
    description: "Intercession pour l'église, la communauté et le pays.", published: true },
  { id: uid(), title: "Convention de réveil spirituel", kind: "Convention", date: addDays(24), time: "17:30", location: CHURCH,
    description: "Trois soirées de louange et de prédication. Églises invitées du district.", published: true },
  { id: uid(), title: "Journée communautaire de santé", kind: "Événement communautaire", date: addDays(40), time: "08:00", location: "Cour de l'église",
    description: "Consultations de base et sensibilisation, ouvertes à tous.", published: false },
  { id: uid(), title: "Culte d'action de grâce", kind: "Culte", date: addDays(-12), time: "09:00", location: CHURCH,
    description: "", published: true },
];

export const seedSermons = (): Sermon[] => [
  { id: uid(), title: "La foi qui agit", speaker: PASTOR, passage: "Jacques 2:14-26", date: addDays(-7), audioUrl: "" },
  { id: uid(), title: "Marcher dans la lumière", speaker: PASTOR, passage: "1 Jean 1:5-10", date: addDays(-14), audioUrl: "" },
  { id: uid(), title: "L'espérance qui ne déçoit pas", speaker: "Frère Wilner Joseph", passage: "Romains 5:1-5", date: addDays(-21), audioUrl: "" },
];

export const seedAnnouncements = (): Announcement[] => [
  { id: uid(), title: "Répétition de la chorale", content: "La chorale se réunit chaque samedi à 16h00 dans l'église. Nouveaux membres bienvenus.", date: addDays(-2), priority: "Normale", published: true },
  { id: uid(), title: "Convention : inscriptions ouvertes", content: "Les délégations des églises sœurs peuvent s'inscrire auprès du secrétariat avant la convention.", date: addDays(-1), priority: "Importante", published: true },
  { id: uid(), title: "Collecte pour le projet solaire", content: "Une offrande spéciale sera reçue dimanche pour soutenir le projet solaire.", date: addDays(0), priority: "Normale", published: false },
];

export const seedDocs = (): IssuedDoc[] => {
  const d1: DocValues = { ...DOC_CONFIG.bapteme.defaults(), civility: "Sœur", fullName: "Esther Charles", baptismDate: addDays(-40) };
  const d2: DocValues = { ...DOC_CONFIG.attestation.defaults(), fullName: "Daniel Saint-Fleur", ministry: "Intercession" };
  const y = todayISO().slice(0, 4);
  return [
    { id: uid(), ref: `DAME-BAP-${y}-001`, type: "bapteme", issueDate: addDays(-38), recipient: "Esther Charles", values: d1 },
    { id: uid(), ref: `DAME-ATT-${y}-002`, type: "attestation", issueDate: addDays(-15), recipient: "Daniel Saint-Fleur", values: d2 },
  ];
};
