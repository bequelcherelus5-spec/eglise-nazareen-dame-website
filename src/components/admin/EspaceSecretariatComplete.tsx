/**
 * EspaceSecretariatComplete.tsx
 * Espace Secrétariat / tableau de bord admin — Église du Nazaréen de Damé
 * www.eglisedunazareendedame.org
 *
 * Dépendances : React 17+ et Tailwind CSS 3+ (aucune autre librairie).
 * Utilisation : <EspaceSecretariatComplete password="VotreMotDePasse" />
 *
 * IMPORTANT (sécurité) : le mot de passe ci-dessous protège l'interface côté navigateur
 * uniquement. Il n'empêche pas un développeur averti de lire le code ou le localStorage.
 * Pour des données réelles (membres, téléphones), validez l'accès et enregistrez les
 * données côté serveur (API + authentification).
 *
 * Persistance : toutes les données sont conservées dans le localStorage du navigateur.
 * Les données ci-dessous sont des EXEMPLES à remplacer.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  NAVY,
  GOLD,
  GOLD_LIGHT,
  PASTOR,
  CHURCH,
  SITE,
  DEFAULT_PASSWORD,
  AUTH_KEY,
  Status,
  Metric,
  Project,
  Member,
  EventItem,
  Sermon,
  Announcement,
  DocType,
  DocValues,
  IssuedDoc,
  BuiltDoc,
  Notify,
  SectionId,
  uid,
  pad,
  todayISO,
  fmtDate,
  isHttpUrl,
  isAudioSource,
  slug,
  downloadFile,
  exportMembersToCsv,
  buildMembersCsvRows,
  parseMembersCsv,
  exportProjectsToCsv,
  exportEventsToCsv,
  exportDocsToCsv,
  localAudioUrls,
  useStored,
  Icon,
  sealSvg,
  DOC_CONFIG,
  DOC_TYPES,
  DOC_CODE,
  makeRef,
  recipientOf,
  buildDoc,
  printHtml,
  textVersion,
  printDoc,
  focusRing,
  inputCls,
  btnPrimary,
  btnGold,
  btnGhost,
  iconBtn,
  cardCls,
  FontStyles,
  Badge,
  Field,
  Modal,
  ConfirmDialog,
  FormActions,
  SectionHeader,
  SearchBox,
  EmptyState,
  seedProjects,
  seedMembers,
  seedEvents,
  seedSermons,
  seedAnnouncements,
  seedDocs,
} from "./secretariatCore";
import { apiService } from "../../services/apiService";
import NewsletterManager from "./NewsletterManager";

export type {
  Status,
  Metric,
  Project,
  Member,
  EventItem,
  Sermon,
  Announcement,
  DocType,
  DocValues,
  IssuedDoc,
};

/* ────────────────────────────── Écran de connexion ────────────────────────────── */

function LoginGate({ password, onSuccess, onBackToSite }: { password: string; onSuccess: () => void; onBackToSite?: () => void }) {
  const [val, setVal] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (val === password) {
      try { sessionStorage.setItem(AUTH_KEY, "1"); } catch { /* ignore */ }
      onSuccess();
    } else {
      setErr("Mot de passe incorrect. Veuillez réessayer.");
      setVal("");
    }
  };

  return (
    <div className="es-root flex min-h-screen flex-col justify-between bg-[#1B2A4A] px-4 py-8 text-white">
      <FontStyles />
      <div />
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#9A7B2F]/40 bg-white p-6 text-slate-800 shadow-2xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div dangerouslySetInnerHTML={{ __html: sealSvg(84) }} />
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-[#9A7B2F]">Espace Secrétariat</p>
          <h1 className="es-serif mt-1 text-2xl font-bold text-[#1B2A4A]">{CHURCH}</h1>
          <p className="mt-1 text-xs text-slate-500">{PASTOR}</p>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <Field label="Mot de passe du secrétariat" required error={err}>
            <div className="relative">
              <input type={show ? "text" : "password"} value={val}
                onChange={(ev) => { setVal(ev.target.value); setErr(""); }}
                placeholder="Entrez le mot de passe" autoFocus required
                className={`${inputCls} pr-20`} />
              <button type="button" onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">
                {show ? "Masquer" : "Afficher"}
              </button>
            </div>
          </Field>
          <button type="submit" className={`${btnPrimary} w-full py-2.5`}>
            <Icon name="lock" size={16} />Accéder au tableau de bord
          </button>
          {onBackToSite && (
            <button type="button" onClick={onBackToSite} className={`${btnGhost} w-full py-2`}>
              Retour au site public
            </button>
          )}
        </form>
      </div>
      <p className="text-center text-xs text-slate-300">{SITE}</p>
    </div>
  );
}

/* ────────────────────────────── 1. Accueil (vue d'ensemble) ────────────────────────────── */

function DashboardView({
  projects, members, events, docs, sermons, announcements, go, notify,
}: {
  projects: Project[]; members: Member[]; events: EventItem[]; docs: IssuedDoc[];
  sermons: Sermon[]; announcements: Announcement[]; go: (s: SectionId) => void; notify: Notify;
}) {
  const today = todayISO();
  const activeProjects = projects.filter((p) => !p.archived && p.status === "En cours");
  const upcoming = useMemo(
    () => events.filter((e) => e.date >= today).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [events, today],
  );
  const nextEv = upcoming[0];

  const stats: { label: string; value: number; sub: string; icon: string; to: SectionId }[] = [
    { label: "Projets en cours", value: activeProjects.length, sub: `${projects.filter((p) => !p.archived).length} au total`, icon: "folder", to: "projets" },
    { label: "Membres inscrits", value: members.length, sub: `${members.filter((m) => m.baptismDate).length} baptisés`, icon: "users", to: "membres" },
    { label: "Événements à venir", value: upcoming.length, sub: nextEv ? `Prochain : ${fmtDate(nextEv.date)}` : "Aucun programmé", icon: "calendar", to: "agenda" },
    { label: "Documents émis", value: docs.length, sub: `${sermons.length} prédic. · ${announcements.length} annonces`, icon: "file", to: "documents" },
  ];

  const shortcuts: { label: string; hint: string; icon: string; to: SectionId }[] = [
    { label: "Rédiger un document officiel", hint: "Baptême, recommandation, attestation, invitation", icon: "file", to: "documents" },
    { label: "Ajouter ou mettre à jour un projet", hint: "Compassion HA0926, codes projets, objectifs et statistiques…", icon: "folder", to: "projets" },
    { label: "Inscrire un membre", hint: "Registre des membres et ministères", icon: "users", iconTo: "membres" } as any,
    { label: "Programmer un culte ou un événement", hint: "Calendrier de l'église", icon: "calendar", to: "agenda" },
    { label: "Newsletter & Messagerie (Brevo)", hint: "Gérer les abonnés et envoyer une lettre pastorale", icon: "mail", to: "newsletter" },
  ].map(s => ({ ...s, to: (s.to || (s as any).iconTo) as SectionId }));

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#1B2A4A] p-6 text-white shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: GOLD_LIGHT }}>Secrétariat paroissial</p>
        <h2 className="es-serif mt-1 text-2xl font-semibold sm:text-3xl">Bienvenue dans l'espace secrétariat</h2>
        <p className="mt-1 text-sm text-slate-200">{CHURCH} · {PASTOR}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {shortcuts.map((s) => (
            <button key={s.label} type="button" onClick={() => go(s.to)}
              className={`inline-flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/20 ${focusRing}`}>
              <Icon name={s.icon} size={15} />{s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const fileName = exportMembersToCsv(members, { delimiter: ";", includeMetadata: true });
              notify(`Registre complet (${members.length} membres) exporté vers ${fileName}.`);
            }}
            disabled={members.length === 0}
            className={`inline-flex items-center gap-2 rounded-lg border border-[#9A7B2F]/60 bg-[#9A7B2F]/25 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-[#9A7B2F]/40 disabled:opacity-50 ${focusRing}`}>
            <Icon name="download" size={15} />Exporter le registre (CSV)
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <button key={s.label} type="button" onClick={() => go(s.to)}
            className={`${cardCls} flex items-start justify-between p-5 text-left transition hover:border-[#9A7B2F] hover:shadow-md ${focusRing}`}>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="es-serif mt-2 text-3xl font-bold text-[#1B2A4A]">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500">{s.sub}</p>
            </div>
            <span className="rounded-lg bg-[#1B2A4A]/5 p-2.5 text-[#9A7B2F]"><Icon name={s.icon} size={22} /></span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${cardCls} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="es-serif text-lg font-semibold text-[#1B2A4A]">Prochains événements</h3>
            <button type="button" onClick={() => go("agenda")} className="text-xs font-semibold text-[#9A7B2F] hover:underline">
              Tout voir →
            </button>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">Aucun événement programmé.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcoming.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-800">{e.title}</p>
                    <p className="text-xs text-slate-500">
                      {fmtDate(e.date)}{e.time ? ` · ${e.time.replace(":", "h")}` : ""}{e.location ? ` · ${e.location}` : ""}
                    </p>
                  </div>
                  <Badge className={e.published ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}>
                    {e.published ? "Publié" : "Brouillon"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${cardCls} p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="es-serif text-lg font-semibold text-[#1B2A4A]">Derniers documents émis</h3>
            <button type="button" onClick={() => go("documents")} className="text-xs font-semibold text-[#9A7B2F] hover:underline">
              Générer un document →
            </button>
          </div>
          {docs.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">Aucun document enregistré pour le moment.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {docs.slice(0, 4).map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-800">{DOC_CONFIG[d.type].label} — {d.recipient}</p>
                    <p className="text-xs text-slate-500">{d.ref} · {fmtDate(d.issueDate)}</p>
                  </div>
                  <button type="button" onClick={() => printDoc(buildDoc(d.type, d.values, d.issueDate, d.ref))}
                    className={btnGhost} title="Imprimer ou enregistrer en PDF">
                    <Icon name="print" size={15} />Imprimer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── 2. Projets sociaux ────────────────────────────── */

const CATEGORIES = ["Parrainage d'enfants", "Éducation", "Santé", "Développement social", "Agriculture / Élevage", "Économie / Microcrédit", "Énergie", "Autre"];
const PARTNERS = ["Compassion International", "Église locale", "Autre"];
const STATUSES: Status[] = ["En cours", "Planifié", "En attente", "Terminé"];
const STATUS_STYLE: Record<Status, string> = {
  "En cours": "bg-emerald-50 text-emerald-800 ring-emerald-200",
  "Planifié": "bg-sky-50 text-sky-800 ring-sky-200",
  "En attente": "bg-amber-50 text-amber-800 ring-amber-200",
  "Terminé": "bg-slate-100 text-slate-700 ring-slate-200",
};
const PARTNER_STYLE: Record<string, string> = {
  "Compassion International": "bg-sky-50 text-sky-900 ring-sky-200",
  Compassion: "bg-sky-50 text-sky-900 ring-sky-200",
  "Église locale": "bg-[#1B2A4A]/10 text-[#1B2A4A] ring-[#1B2A4A]/20",
};
const PRESET_PROJECT_IMAGES = [
  { label: "Comité & CDEJ", path: "/images/comite.jpg" },
  { label: "Façade École", path: "/images/ecole_facade.jpg" },
  { label: "Sanctuaire Damé", path: "/images/dame_facade.jpg" },
  { label: "Cour & Communauté", path: "/images/cour_paysage.jpg" },
];

const emptyProject = (existingCount = 0): Omit<Project, "id"> => ({
  code: `PROJ-${new Date().getFullYear()}-${pad(existingCount + 1)}`,
  title: "",
  category: CATEGORIES[0],
  partner: "Compassion International",
  leader: PASTOR,
  description: "",
  objectives: [""],
  status: "En cours",
  date: todayISO(),
  image: "/images/comite.jpg",
  url: "",
  metrics: [{ label: "", value: "" }],
  published: true,
  archived: false,
});

function ProjectsView({ projects, setProjects, notify }: {
  projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>>; notify: Notify;
}) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Tous");
  const [showArchived, setShowArchived] = useState(false);
  const [view, setView] = useState<"cards" | "table">("cards");
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Omit<Project, "id">>(() => emptyProject(projects.length));
  const [err, setErr] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Project | null>(null);

  // État dédié pour l'édition directe du "Code du projet" par projet
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>({});
  const [savingCodeId, setSavingCodeId] = useState<string | null>(null);

  useEffect(() => {
    setCodeDrafts((prev) => {
      const next: Record<string, string> = {};
      for (const p of projects) {
        next[p.id] = prev[p.id] !== undefined ? prev[p.id] : (p.code || "COMP-HA0926");
      }
      return next;
    });
  }, [projects]);

  const validateProjectCode = (rawCode: string, currentId?: string): string | null => {
    const clean = rawCode.trim().toUpperCase();
    if (!clean) return "Le code du projet est obligatoire (ex. : COMP-HA0926).";
    if (!/^[A-Z0-9-_]{2,32}$/.test(clean)) {
      return "Format invalide : utilisez 2 à 32 caractères (lettres, chiffres, tirets), ex. COMP-HA0926.";
    }
    const duplicate = projects.find((p) => p.id !== currentId && (p.code || "").trim().toUpperCase() === clean);
    if (duplicate) {
      return `Ce code « ${clean} » est déjà attribué au projet « ${duplicate.title} ». Chaque projet doit avoir un code unique.`;
    }
    return null;
  };

  const handleSaveDirectCode = async (project: Project) => {
    const rawDraft = codeDrafts[project.id] ?? project.code ?? "";
    const cleanCode = rawDraft.trim().toUpperCase();
    const validationError = validateProjectCode(cleanCode, project.id);
    if (validationError) {
      notify(validationError, "error");
      return;
    }

    setSavingCodeId(project.id);
    try {
      const res = await apiService.updateProjectCode(project.id, cleanCode);
      if (!res.success && res.error) {
        notify(res.error, "error");
        return;
      }
      setProjects((list) =>
        list.map((item) => (item.id === project.id ? { ...item, code: cleanCode } : item))
      );
      setCodeDrafts((prev) => ({ ...prev, [project.id]: cleanCode }));
      notify(`Code du projet mis à jour et enregistré : ${cleanCode}`);
    } catch {
      notify("Erreur lors de l'enregistrement du code du projet.", "error");
    } finally {
      setSavingCodeId(null);
    }
  };

  const openNew = () => {
    setForm(emptyProject(projects.length));
    setErr({});
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (p: Project) => {
    setForm({
      code: p.code || "COMP-HA0926",
      title: p.title,
      category: p.category || CATEGORIES[0],
      partner: p.partner || "Compassion International",
      leader: p.leader || PASTOR,
      description: p.description || "",
      objectives: p.objectives && p.objectives.length > 0 ? [...p.objectives] : [""],
      status: p.status || "En cours",
      date: p.date || todayISO(),
      image: p.image || "/images/comite.jpg",
      url: p.url || "",
      metrics: p.metrics && p.metrics.length > 0 ? p.metrics.map((m) => ({ ...m })) : [{ label: "", value: "" }],
      published: p.published !== false,
      archived: Boolean(p.archived),
    });
    setErr({});
    setEditing(p);
    setCreating(true);
  };

  const handleImageFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      notify("L'image dépasse 2 Mo. Veuillez choisir une image plus légère.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((f) => ({ ...f, image: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const save = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    const codeErr = validateProjectCode(form.code, editing?.id);
    if (codeErr) e.code = codeErr;
    if (!form.title.trim()) e.title = "Le titre du projet est obligatoire.";
    if (!form.description.trim()) e.description = "La description du projet est obligatoire.";
    if (!form.partner.trim()) e.partner = "Le nom du partenaire est obligatoire.";
    if (!form.date.trim()) e.date = "La date du projet est obligatoire.";
    if (form.url.trim() && !isHttpUrl(form.url.trim())) e.url = "Lien invalide : commencez par https://";
    if (Object.keys(e).length) {
      setErr(e);
      return;
    }

    const cleanCode = form.code.trim().toUpperCase();
    const clean: Omit<Project, "id"> = {
      ...form,
      code: cleanCode,
      title: form.title.trim(),
      category: form.category.trim() || "Développement social",
      partner: form.partner.trim(),
      leader: form.leader.trim() || PASTOR,
      description: form.description.trim(),
      objectives: form.objectives.map((o) => o.trim()).filter(Boolean),
      date: form.date.trim() || todayISO(),
      image: form.image.trim() || "/images/comite.jpg",
      url: form.url.trim(),
      metrics: form.metrics
        .filter((m) => m.label.trim() || m.value.trim())
        .map((m) => ({ label: m.label.trim(), value: m.value.trim() })),
    };

    setSaving(true);
    try {
      if (editing) {
        const res = await apiService.updateSocialProject(editing.id, clean);
        if (!res.success && res.error) {
          setErr({ code: res.error });
          setSaving(false);
          return;
        }
        const updatedProject: Project = { id: editing.id, ...clean };
        setProjects((list) => list.map((p) => (p.id === editing.id ? updatedProject : p)));
        setCodeDrafts((prev) => ({ ...prev, [editing.id]: cleanCode }));
        notify(`Projet « ${clean.title} » (${cleanCode}) mis à jour dans la base de données.`);
      } else {
        const res = await apiService.createSocialProject(clean);
        if (!res.success && res.error) {
          setErr({ code: res.error });
          setSaving(false);
          return;
        }
        const newProj: Project = res.project || { id: uid(), ...clean };
        setProjects((list) => [newProj, ...list]);
        setCodeDrafts((prev) => ({ ...prev, [newProj.id]: newProj.code }));
        notify(`Nouveau projet « ${newProj.title} » (${newProj.code}) créé et enregistré.`);
      }
      setCreating(false);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (p: Project) => {
    const nextPublished = p.published === false ? true : false;
    await apiService.updateSocialProject(p.id, { published: nextPublished });
    setProjects((list) => list.map((x) => (x.id === p.id ? { ...x, published: nextPublished } : x)));
    notify(nextPublished ? `Projet « ${p.title} » publié sur le site public.` : `Projet « ${p.title} » dépublié (brouillon).`);
  };

  const toggleArchive = async (p: Project) => {
    const nextArchived = !p.archived;
    await apiService.updateSocialProject(p.id, { archived: nextArchived });
    setProjects((list) => list.map((x) => (x.id === p.id ? { ...x, archived: nextArchived } : x)));
    notify(p.archived ? "Projet restauré." : "Projet archivé.");
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    const target = toDelete;
    await apiService.deleteSocialProject(target.id);
    setProjects((l) => l.filter((x) => x.id !== target.id));
    setToDelete(null);
    notify(`Projet « ${target.title} » (${target.code}) supprimé de la base de données.`);
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return projects.filter((p) => {
      if (p.archived !== showArchived) return false;
      if (statusFilter !== "Tous" && p.status !== statusFilter) return false;
      if (!s) return true;
      return [p.code, p.title, p.category, p.partner, p.leader, p.description, ...(p.objectives || [])].some((x) =>
        String(x || "").toLowerCase().includes(s)
      );
    });
  }, [projects, q, statusFilter, showArchived]);

  const setMetric = (i: number, key: "label" | "value", val: string) =>
    setForm((f) => ({ ...f, metrics: f.metrics.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)) }));

  const setObjective = (i: number, val: string) =>
    setForm((f) => ({ ...f, objectives: f.objectives.map((o, idx) => (idx === i ? val : o)) }));

  return (
    <div className="space-y-6">
      <SectionHeader title="Projets sociaux" subtitle="Gérez les projets communautaires, le code du projet, les partenaires, objectifs et statistiques d'impact.">
        <button
          type="button"
          onClick={() => {
            const fileName = exportProjectsToCsv(filtered);
            notify(`Projets exportés en CSV (${filtered.length}) : ${fileName}`);
          }}
          disabled={filtered.length === 0}
          className={btnGhost}
        >
          <Icon name="download" size={16} />Exporter en CSV
        </button>
        <button type="button" onClick={openNew} className={btnPrimary}><Icon name="plus" size={16} />Nouveau projet</button>
      </SectionHeader>

      {/* SECTION DÉDIÉE : Code du projet */}
      <div className="rounded-2xl border-2 border-[#9A7B2F]/40 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1B2A4A] text-[#E3C878]">
              <Icon name="code" size={20} />
            </span>
            <div>
              <h3 className="es-serif text-lg font-semibold text-[#1B2A4A]">Code du projet</h3>
              <p className="text-xs text-slate-600">
                Chaque projet possède un code unique modifiable directement ci-dessous (ex. : <strong className="font-mono text-[#1B2A4A]">COMP-HA0926</strong>).
              </p>
            </div>
          </div>
          <Badge className="bg-[#1B2A4A]/10 text-[#1B2A4A] ring-[#1B2A4A]/20 self-start sm:self-auto">
            Accès réservé au Secrétariat
          </Badge>
        </div>

        {projects.filter((p) => !p.archived).length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">Aucun projet actif. Créez un projet pour définir son code officiel.</p>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {projects.filter((p) => !p.archived).map((p) => {
              const draftVal = codeDrafts[p.id] ?? p.code ?? "COMP-HA0926";
              const isModified = draftVal.trim().toUpperCase() !== (p.code || "").trim().toUpperCase();
              return (
                <div key={p.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1B2A4A]">{p.title}</p>
                    <p className="text-xs text-slate-500">
                      Code actuel : <span className="font-mono font-bold text-[#9A7B2F]">{p.code || "COMP-HA0926"}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={draftVal}
                      onChange={(e) => setCodeDrafts((prev) => ({ ...prev, [p.id]: e.target.value.toUpperCase() }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveDirectCode(p);
                        }
                      }}
                      aria-label={`Code du projet pour ${p.title}`}
                      placeholder="COMP-HA0926"
                      className={`${inputCls} w-40 font-mono text-xs font-bold uppercase tracking-wider text-[#1B2A4A]`}
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveDirectCode(p)}
                      disabled={savingCodeId === p.id || !draftVal.trim()}
                      className={isModified ? btnGold : btnPrimary}
                      title="Enregistrer le nouveau code du projet dans la base de données"
                    >
                      <Icon name="check" size={15} />
                      <span>{savingCodeId === p.id ? "..." : "Enregistrer"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Barre de recherche et filtres */}
      <div className={`${cardCls} flex flex-wrap items-center gap-3 p-4`}>
        <SearchBox value={q} onChange={setQ} placeholder="Rechercher par code (COMP-HA0926), titre, partenaire, objectif…" />
        <select value={statusFilter} onChange={(ev) => setStatusFilter(ev.target.value)}
          aria-label="Filtrer par statut" className={`${inputCls} w-auto`}>
          <option value="Tous">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="button" onClick={() => setShowArchived((a) => !a)}
          className={showArchived ? btnGold : btnGhost}>
          <Icon name="archive" size={16} />
          {showArchived ? "Voir les projets actifs" : `Archives (${projects.filter((p) => p.archived).length})`}
        </button>
        <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5" role="group" aria-label="Mode d'affichage">
          <button type="button" onClick={() => setView("cards")}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${view === "cards" ? "bg-white text-[#1B2A4A] shadow-sm" : "text-slate-600"}`}
            title="Vue en cartes"><Icon name="grid" size={15} /></button>
          <button type="button" onClick={() => setView("table")}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium ${view === "table" ? "bg-white text-[#1B2A4A] shadow-sm" : "text-slate-600"}`}
            title="Vue en tableau"><Icon name="list" size={15} /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={showArchived ? "Aucun projet archivé" : "Aucun projet trouvé"}
          hint="Ajoutez un projet social ou modifiez vos filtres de recherche.">
          {!showArchived && <button type="button" onClick={openNew} className={btnPrimary}><Icon name="plus" size={16} />Ajouter un projet</button>}
        </EmptyState>
      ) : view === "cards" ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {filtered.map((p) => (
            <div key={p.id} className={`${cardCls} flex flex-col justify-between overflow-hidden`}>
              {p.image && (
                <div className="relative h-44 w-full bg-slate-100 border-b border-slate-100">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/comite.jpg"; }}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#1B2A4A] px-2.5 py-1 font-mono text-xs font-bold uppercase text-[#E3C878] shadow-sm ring-1 ring-[#9A7B2F]/50">
                      <Icon name="code" size={13} />
                      {p.code || "COMP-HA0926"}
                    </span>
                    <Badge className={p.published !== false ? "bg-emerald-600 text-white ring-emerald-700" : "bg-slate-800/90 text-slate-200 ring-slate-700"}>
                      {p.published !== false ? "Publié sur le site" : "Brouillon (Non publié)"}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge className={STATUS_STYLE[p.status] || STATUS_STYLE["En cours"]}>{p.status}</Badge>
                      <Badge className={PARTNER_STYLE[p.partner] || "bg-slate-100 text-slate-700 ring-slate-200"}>{p.partner}</Badge>
                      <span className="text-xs text-slate-500">· {p.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => togglePublish(p)}
                        className={iconBtn}
                        title={p.published !== false ? "Dépublier du site public" : "Publier sur le site public"}
                        aria-label={p.published !== false ? `Dépublier ${p.title}` : `Publier ${p.title}`}
                      >
                        <Icon name={p.published !== false ? "eye" : "eyeOff"} size={16} />
                      </button>
                      <button type="button" onClick={() => openEdit(p)} className={iconBtn} title="Modifier le projet complet" aria-label={`Modifier ${p.title}`}>
                        <Icon name="edit" size={16} />
                      </button>
                      <button type="button" onClick={() => toggleArchive(p)} className={iconBtn}
                        title={p.archived ? "Restaurer" : "Archiver"} aria-label={p.archived ? `Restaurer ${p.title}` : `Archiver ${p.title}`}>
                        <Icon name={p.archived ? "restore" : "archive"} size={16} />
                      </button>
                      <button type="button" onClick={() => setToDelete(p)} className={`${iconBtn} hover:text-red-600`}
                        title="Supprimer" aria-label={`Supprimer ${p.title}`}>
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Détails principaux & Code du projet */}
                  <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="es-serif text-xl font-semibold text-[#1B2A4A]">{p.title}</h3>
                    <span className="rounded-md bg-[#1B2A4A]/5 px-2 py-0.5 font-mono text-xs font-semibold text-[#1B2A4A]">
                      Code : {p.code || "COMP-HA0926"}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    {p.leader && <span>Responsable : <strong className="text-slate-700">{p.leader}</strong></span>}
                    {p.date && <span>· Date : <strong className="text-slate-700">{fmtDate(p.date) !== "—" ? fmtDate(p.date) : p.date}</strong></span>}
                  </div>

                  {p.description && <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{p.description}</p>}

                  {/* Objectifs du projet */}
                  {p.objectives && p.objectives.length > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#1B2A4A]">
                        Objectifs ({p.objectives.length})
                      </p>
                      <ul className="mt-1.5 space-y-1 text-xs text-slate-600">
                        {p.objectives.map((obj, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="mt-0.5 text-[#9A7B2F]">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Statistiques / Indicateurs d'impact */}
                  {p.metrics && p.metrics.length > 0 && (
                    <dl className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 sm:grid-cols-4">
                      {p.metrics.map((m, i) => (
                        <div key={i}>
                          <dt className="text-[11px] text-slate-500">{m.label || "Indicateur"}</dt>
                          <dd className="es-serif text-base font-bold text-[#1B2A4A]">{m.value || "—"}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                {/* Pied de carte avec actions rapides */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1B2A4A] hover:bg-slate-50"
                    >
                      <Icon name="edit" size={14} />Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublish(p)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        p.published !== false
                          ? "border border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      <Icon name={p.published !== false ? "eyeOff" : "eye"} size={14} />
                      {p.published !== false ? "Dépublier" : "Publier"}
                    </button>
                  </div>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9A7B2F] hover:underline">
                      <Icon name="link" size={14} />Lien externe
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${cardCls} overflow-x-auto`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Code du projet</th>
                <th className="px-4 py-3">Projet</th>
                <th className="px-4 py-3">Partenaire</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Publication</th>
                <th className="px-4 py-3">Statistiques</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-[#1B2A4A]">{p.code || "COMP-HA0926"}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1B2A4A]">{p.title}</p>
                    <p className="text-xs text-slate-500">{p.category} · {p.leader || "—"}</p>
                  </td>
                  <td className="px-4 py-3"><Badge className={PARTNER_STYLE[p.partner] || "bg-slate-100 text-slate-700 ring-slate-200"}>{p.partner}</Badge></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{p.date || "—"}</td>
                  <td className="px-4 py-3"><Badge className={STATUS_STYLE[p.status] || STATUS_STYLE["En cours"]}>{p.status}</Badge></td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => togglePublish(p)}
                      className="cursor-pointer"
                      title="Cliquer pour publier / dépublier"
                    >
                      <Badge className={p.published !== false ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}>
                        {p.published !== false ? "Publié" : "Non publié"}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {p.metrics.map((m) => `${m.label}: ${m.value}`).join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button type="button" onClick={() => openEdit(p)} className={iconBtn} aria-label={`Modifier ${p.title}`}><Icon name="edit" size={16} /></button>
                      <button type="button" onClick={() => toggleArchive(p)} className={iconBtn} aria-label={p.archived ? "Restaurer" : "Archiver"}>
                        <Icon name={p.archived ? "restore" : "archive"} size={16} />
                      </button>
                      <button type="button" onClick={() => setToDelete(p)} className={`${iconBtn} hover:text-red-600`} aria-label={`Supprimer ${p.title}`}>
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {creating && (
        <Modal title={editing ? `Modifier le projet — ${editing.code || "COMP-HA0926"}` : "Nouveau projet social"} onClose={() => setCreating(false)} wide>
          <form onSubmit={save} className="space-y-5" noValidate>
            {/* Bloc Code du projet mis en évidence dans l'éditeur */}
            <div className="rounded-xl border-2 border-[#9A7B2F]/40 bg-[#1B2A4A]/5 p-4">
              <div className="grid gap-4 sm:grid-cols-2 sm:items-start">
                <Field
                  label="Code du projet"
                  required
                  hint="Code unique d'identification (ex. : COMP-HA0926). Lettres, chiffres et tirets."
                  error={err.code}
                >
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="COMP-HA0926"
                    className={`${inputCls} font-mono font-bold uppercase tracking-wider text-[#1B2A4A]`}
                  />
                </Field>
                <div className="flex flex-col justify-center pt-1 sm:pt-6">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#1B2A4A]">
                    <input
                      type="checkbox"
                      checked={form.published !== false}
                      onChange={(e) => setForm({ ...form, published: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-[#1B2A4A] focus:ring-[#9A7B2F]"
                    />
                    <span>Publier ce projet sur le site public</span>
                  </label>
                  <span className="mt-1 text-xs text-slate-500">
                    Décochez pour conserver ce projet en brouillon interne dans le secrétariat.
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Titre du projet" required error={err.title}>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ex. : Compassion HA0926" className={inputCls} />
                </Field>
              </div>

              <Field label="Partenaire" required error={err.partner}>
                <input
                  type="text"
                  list="sec-partner-suggestions"
                  value={form.partner}
                  onChange={(e) => setForm({ ...form, partner: e.target.value })}
                  placeholder="Ex. : Compassion International"
                  className={inputCls}
                />
                <datalist id="sec-partner-suggestions">
                  {PARTNERS.map((p) => <option key={p} value={p} />)}
                </datalist>
              </Field>

              <Field label="Catégorie">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Statut du projet">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className={inputCls}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>

              <Field label="Date de lancement / référence" required error={err.date}>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
              </Field>

              <Field label="Responsable du projet">
                <input type="text" value={form.leader} onChange={(e) => setForm({ ...form, leader: e.target.value })}
                  placeholder="Ex. : Sœur Marie-Carmelle Louis" className={inputCls} />
              </Field>

              <Field label="Lien externe (facultatif)" error={err.url}>
                <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://…" className={inputCls} />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Description complète" required error={err.description}>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Présentation détaillée du projet, bénéficiaires, déroulement…" className={inputCls} />
                </Field>
              </div>

              {/* Image du projet */}
              <div className="sm:col-span-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <Field label="Image du projet" hint="Saisissez une URL, choisissez une photo de l'église ou téléversez une image depuis votre appareil.">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="/images/comite.jpg ou https://..."
                      className={inputCls}
                    />
                    <label className={`${btnGhost} shrink-0 cursor-pointer`}>
                      <Icon name="upload" size={15} />
                      <span>Téléverser</span>
                      <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                    </label>
                  </div>
                </Field>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-slate-500">Images rapides :</span>
                  {PRESET_PROJECT_IMAGES.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, image: preset.path }))}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                        form.image === preset.path
                          ? "border-[#9A7B2F] bg-[#1B2A4A] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Objectifs du projet */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1B2A4A]">Objectifs du projet</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, objectives: [...f.objectives, ""] }))}
                  className="text-xs font-semibold text-[#9A7B2F] hover:underline"
                >
                  + Ajouter un objectif
                </button>
              </div>
              <div className="space-y-2">
                {form.objectives.map((obj, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => setObjective(i, e.target.value)}
                      placeholder={`Objectif ${i + 1} (ex. : Assurer le suivi scolaire et médical des enfants inscrits)`}
                      aria-label={`Objectif ${i + 1}`}
                      className={inputCls}
                    />
                    {form.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, objectives: f.objectives.filter((_, idx) => idx !== i) }))}
                        className={iconBtn}
                        aria-label="Retirer cet objectif"
                      >
                        <Icon name="x" size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques / Indicateurs d'impact */}
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1B2A4A]">Statistiques & Indicateurs d'impact</span>
                <button type="button" onClick={() => setForm((f) => ({ ...f, metrics: [...f.metrics, { label: "", value: "" }] }))}
                  className="text-xs font-semibold text-[#9A7B2F] hover:underline">+ Ajouter une statistique</button>
              </div>
              <div className="space-y-2">
                {form.metrics.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <input type="text" value={m.label} onChange={(e) => setMetric(i, "label", e.target.value)}
                      placeholder="Libellé (ex. : Enfants parrainés)" aria-label="Libellé de l'indicateur" className={inputCls} />
                    <input type="text" value={m.value} onChange={(e) => setMetric(i, "value", e.target.value)}
                      placeholder="Valeur (ex. : 250+)" aria-label="Valeur de l'indicateur" className={`${inputCls} max-w-[160px]`} />
                    {form.metrics.length > 1 && (
                      <button type="button" onClick={() => setForm((f) => ({ ...f, metrics: f.metrics.filter((_, idx) => idx !== i) }))}
                        className={iconBtn} aria-label="Retirer cet indicateur"><Icon name="x" size={16} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <FormActions onCancel={() => setCreating(false)} submitLabel={saving ? "Enregistrement..." : editing ? "Enregistrer les modifications" : "Créer le projet"} />
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog title="Supprimer ce projet ?"
          message={`Le projet « ${toDelete.title} » (Code : ${toDelete.code || "COMP-HA0926"}) sera définitivement supprimé du site public et de la base de données.`}
          confirmLabel="Supprimer définitivement"
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)} />
      )}
    </div>
  );
}

/* ────────────────────────────── 3. Générateur de documents officiels ────────────────────────────── */

function DocumentsView({ docs, setDocs, notify }: {
  docs: IssuedDoc[]; setDocs: React.Dispatch<React.SetStateAction<IssuedDoc[]>>; notify: Notify;
}) {
  const [type, setType] = useState<DocType>("bapteme");
  const [issueDate, setIssueDate] = useState<string>(todayISO);
  const [values, setValues] = useState<DocValues>(() => DOC_CONFIG.bapteme.defaults());
  const [customRef, setCustomRef] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<IssuedDoc | null>(null);

  const cfg = DOC_CONFIG[type];
  const autoRef = useMemo(() => {
    const year = (issueDate || todayISO()).slice(0, 4);
    const prefix = `DAME-${DOC_CODE[type]}-${year}-`;
    const maxN = docs
      .filter((d) => d.ref.startsWith(prefix))
      .reduce((acc, d) => Math.max(acc, parseInt(d.ref.slice(prefix.length), 10) || 0), 0);
    return makeRef(type, maxN + 1, issueDate);
  }, [docs, type, issueDate]);
  const ref = customRef.trim() || autoRef;
  const built = useMemo(() => buildDoc(type, values, issueDate, ref), [type, values, issueDate, ref]);
  const previewHtml = useMemo(() => printHtml(built), [built]);

  const changeType = (t: DocType) => {
    setType(t); setValues(DOC_CONFIG[t].defaults()); setCustomRef(""); setErr({});
  };
  const setVal = (k: string, v: string) => {
    setValues((prev) => ({ ...prev, [k]: v }));
    if (err[k]) setErr((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    for (const f of cfg.fields) if (f.required && !(values[f.key] || "").trim()) e[f.key] = "Ce champ est obligatoire.";
    setErr(e);
    if (Object.keys(e).length) { notify("Veuillez compléter les champs obligatoires.", "error"); return false; }
    return true;
  };

  const recordDoc = (): IssuedDoc => {
    const item: IssuedDoc = { id: uid(), ref, type, issueDate, recipient: recipientOf(type, values), values: { ...values } };
    setDocs((list) => [item, ...list.filter((d) => d.ref !== ref)]);
    return item;
  };

  const handlePrint = () => {
    if (!validate()) return;
    recordDoc();
    printDoc(built);
    notify("Document enregistré. Choisissez « Enregistrer en PDF » ou votre imprimante.");
  };

  const handleTxt = () => {
    if (!validate()) return;
    recordDoc();
    downloadFile(`${slug(cfg.label)}-${slug(recipientOf(type, values)) || ref}.txt`, textVersion(built), "text/plain;charset=utf-8");
    notify("Fichier texte (.txt) téléchargé.");
  };

  const loadIssued = (d: IssuedDoc) => {
    setType(d.type); setIssueDate(d.issueDate); setValues({ ...DOC_CONFIG[d.type].defaults(), ...d.values });
    setCustomRef(d.ref); setErr({});
    notify(`Document ${d.ref} chargé dans l'éditeur.`);
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Générateur de documents officiels"
        subtitle="Rédigez, prévisualisez et imprimez les documents du secrétariat avec l'en-tête et le sceau de l'église." />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Modèles de documents">
        {DOC_TYPES.map((t) => {
          const active = t === type;
          return (
            <button key={t} type="button" role="tab" aria-selected={active} onClick={() => changeType(t)}
              className={`rounded-xl border p-4 text-left transition ${focusRing} ${
                active ? "border-[#9A7B2F] bg-[#1B2A4A] text-white shadow-sm" : "border-slate-200 bg-white text-slate-800 hover:border-[#9A7B2F]"
              }`}>
              <p className="font-semibold">{DOC_CONFIG[t].label}</p>
              <p className={`mt-1 text-xs ${active ? "text-slate-200" : "text-slate-500"}`}>{DOC_CONFIG[t].hint}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className={`${cardCls} p-5 xl:col-span-5`}>
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="es-serif text-lg font-semibold text-[#1B2A4A]">{cfg.label}</h3>
            <button type="button" onClick={() => { setValues(cfg.defaults()); setCustomRef(""); setErr({}); }}
              className="text-xs font-medium text-slate-500 hover:text-[#1B2A4A]">Réinitialiser</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date d'émission">
              <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Numéro de référence" hint={`Automatique : ${autoRef}`}>
              <input type="text" value={customRef} onChange={(e) => setCustomRef(e.target.value)} placeholder={autoRef} className={inputCls} />
            </Field>

            {cfg.fields.map((f) => (
              <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                <Field label={f.label} required={f.required} error={err[f.key]}>
                  {f.type === "select" ? (
                    <select value={values[f.key] || ""} onChange={(e) => setVal(f.key, e.target.value)} className={inputCls}>
                      {(f.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea rows={3} value={values[f.key] || ""} onChange={(e) => setVal(f.key, e.target.value)}
                      placeholder={f.placeholder} className={inputCls} />
                  ) : (
                    <input type={f.type} value={values[f.key] || ""} onChange={(e) => setVal(f.key, e.target.value)}
                      placeholder={f.placeholder} className={inputCls} />
                  )}
                </Field>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
            <button type="button" onClick={handlePrint} className={btnPrimary}>
              <Icon name="print" size={16} />Imprimer / Enregistrer en PDF
            </button>
            <button type="button" onClick={handleTxt} className={btnGhost}>
              <Icon name="download" size={16} />Télécharger en .txt
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Astuce : dans la fenêtre d'impression, choisissez la destination <strong>« Enregistrer au format PDF »</strong> pour obtenir un fichier PDF officiel avec le sceau.
          </p>
        </div>

        <div className="xl:col-span-7">
          <div className={`${cardCls} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Aperçu du document (A4)</span>
              <span className="font-mono text-xs text-slate-500">{ref}</span>
            </div>
            <div className="bg-slate-200/70 p-3 sm:p-5">
              <iframe title="Aperçu du document officiel" srcDoc={previewHtml}
                className="mx-auto block h-[680px] w-full max-w-[760px] rounded-lg bg-white shadow-md" />
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardCls} p-5`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="es-serif text-lg font-semibold text-[#1B2A4A]">Historique des documents émis ({docs.length})</h3>
          {docs.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const fileName = exportDocsToCsv(docs);
                notify(`Historique des documents exporté en CSV : ${fileName}`);
              }}
              className={btnGhost}
            >
              <Icon name="download" size={15} />Exporter l'historique (CSV)
            </button>
          )}
        </div>
        {docs.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">Les documents imprimés ou téléchargés apparaîtront automatiquement ici.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
                <tr>
                  <th className="px-3 py-2.5">Référence</th>
                  <th className="px-3 py-2.5">Type</th>
                  <th className="px-3 py-2.5">Destinataire / Événement</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {docs.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70">
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-600">{d.ref}</td>
                    <td className="px-3 py-2.5 font-medium text-[#1B2A4A]">{DOC_CONFIG[d.type].label}</td>
                    <td className="px-3 py-2.5 text-slate-700">{d.recipient}</td>
                    <td className="px-3 py-2.5 text-slate-600">{fmtDate(d.issueDate)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <div className="inline-flex gap-1">
                        <button type="button" onClick={() => loadIssued(d)} className={iconBtn} title="Recharger dans l'éditeur" aria-label={`Recharger ${d.ref}`}>
                          <Icon name="edit" size={16} />
                        </button>
                        <button type="button" onClick={() => printDoc(buildDoc(d.type, d.values, d.issueDate, d.ref))}
                          className={iconBtn} title="Réimprimer" aria-label={`Réimprimer ${d.ref}`}>
                          <Icon name="print" size={16} />
                        </button>
                        <button type="button" onClick={() => setToDelete(d)} className={`${iconBtn} hover:text-red-600`}
                          title="Supprimer de l'historique" aria-label={`Supprimer ${d.ref}`}>
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toDelete && (
        <ConfirmDialog title="Supprimer ce document de l'historique ?"
          message={`Le document ${toDelete.ref} (${toDelete.recipient}) sera retiré de l'historique.`}
          confirmLabel="Supprimer"
          onConfirm={() => { setDocs((l) => l.filter((x) => x.id !== toDelete.id)); setToDelete(null); notify("Document retiré de l'historique."); }}
          onCancel={() => setToDelete(null)} />
      )}
    </div>
  );
}

/* ────────────────────────────── 4. Registre des membres ────────────────────────────── */

const MINISTRIES = ["Chorale", "Jeunesse", "Femmes", "Hommes", "École du dimanche", "Diaconat", "Intercession", "Accueil", "Assemblée générale"];
const emptyMember = (): Omit<Member, "id"> => ({ name: "", phone: "", ministry: MINISTRIES[0], baptismDate: "" });

function MembersView({ members, setMembers, notify }: {
  members: Member[]; setMembers: React.Dispatch<React.SetStateAction<Member[]>>; notify: Notify;
}) {
  const [q, setQ] = useState("");
  const [ministry, setMinistry] = useState("Tous");
  const [editing, setEditing] = useState<Member | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Member, "id">>(emptyMember);
  const [err, setErr] = useState("");
  const [toDelete, setToDelete] = useState<Member | null>(null);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvScope, setCsvScope] = useState<"filtered" | "all" | "baptized" | "unbaptized">("filtered");
  const [csvDelimiter, setCsvDelimiter] = useState<";" | ",">(";");
  const [csvIncludeMeta, setCsvIncludeMeta] = useState<boolean>(true);
  const csvFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImportCsvFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const imported = parseMembersCsv(text);
      if (imported.length === 0) {
        notify("Aucune ligne de membre valide détectée dans ce fichier CSV.", "error");
        return;
      }
      setMembers((prev) => {
        const existingNames = new Set(prev.map((m) => m.name.trim().toLowerCase()));
        const newItems: Member[] = [];
        for (const item of imported) {
          const key = item.name.trim().toLowerCase();
          if (!existingNames.has(key)) {
            existingNames.add(key);
            newItems.push({ id: uid(), ...item });
          }
        }
        notify(
          newItems.length > 0
            ? `${newItems.length} nouveau(x) membre(s) importé(s) depuis « ${file.name} » !`
            : `Tous les membres du fichier « ${file.name} » figurent déjà dans le registre.`,
        );
        return [...newItems, ...prev];
      });
      setCsvModalOpen(false);
    };
    reader.readAsText(file, "UTF-8");
    ev.target.value = "";
  };

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of members) map[m.ministry] = (map[m.ministry] || 0) + 1;
    return map;
  }, [members]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return members.filter((m) => {
      if (ministry !== "Tous" && m.ministry !== ministry) return false;
      if (!s) return true;
      return [m.name, m.phone, m.ministry].some((x) => x.toLowerCase().includes(s));
    });
  }, [members, q, ministry]);

  const openNew = () => { setForm(emptyMember()); setErr(""); setEditing(null); setOpen(true); };
  const openEdit = (m: Member) => {
    setForm({ name: m.name, phone: m.phone, ministry: m.ministry, baptismDate: m.baptismDate });
    setErr(""); setEditing(m); setOpen(true);
  };

  const save = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.name.trim()) { setErr("Le nom du membre est obligatoire."); return; }
    const clean = { ...form, name: form.name.trim(), phone: form.phone.trim() };
    if (editing) {
      setMembers((l) => l.map((m) => (m.id === editing.id ? { id: editing.id, ...clean } : m)));
      notify("Fiche du membre mise à jour.");
    } else {
      setMembers((l) => [{ id: uid(), ...clean }, ...l]);
      notify("Membre inscrit au registre.");
    }
    setOpen(false); setEditing(null);
  };

  const targetCsvMembers = useMemo(() => {
    if (csvScope === "all") return members;
    if (csvScope === "baptized") return members.filter((m) => Boolean(m.baptismDate));
    if (csvScope === "unbaptized") return members.filter((m) => !m.baptismDate);
    return filtered;
  }, [csvScope, members, filtered]);

  const previewCsvRows = useMemo(
    () => buildMembersCsvRows(targetCsvMembers.slice(0, 5), csvIncludeMeta),
    [targetCsvMembers, csvIncludeMeta],
  );

  const exportCsv = () => {
    const scopeSuffix = ministry !== "Tous" ? `-${slug(ministry)}` : "";
    const fileName = exportMembersToCsv(filtered, {
      delimiter: ";",
      includeMetadata: true,
      fileNamePrefix: `registre-membres-nazareen-dame${scopeSuffix}`,
    });
    notify(`Export CSV réussi : ${filtered.length} membre(s) sauvegardé(s) dans « ${fileName} » (compatible Excel).`);
  };

  const handleAdvancedCsvExport = () => {
    if (targetCsvMembers.length === 0) {
      notify("Aucun membre à exporter pour cette sélection.", "error");
      return;
    }
    const scopeLabel =
      csvScope === "all"
        ? "complet"
        : csvScope === "baptized"
          ? "baptises"
          : csvScope === "unbaptized"
            ? "non-baptises"
            : ministry !== "Tous"
              ? slug(ministry)
              : "selection";
    const fileName = exportMembersToCsv(targetCsvMembers, {
      delimiter: csvDelimiter,
      includeMetadata: csvIncludeMeta,
      fileNamePrefix: `registre-membres-${scopeLabel}-nazareen-dame`,
    });
    setCsvModalOpen(false);
    notify(
      `Sauvegarde CSV téléchargée (${targetCsvMembers.length} membre(s), séparateur « ${csvDelimiter} ») : ${fileName}`,
    );
  };

  const handleCopyForSpreadsheet = async () => {
    if (targetCsvMembers.length === 0) return;
    const rows = buildMembersCsvRows(targetCsvMembers, csvIncludeMeta);
    const tsv = rows.map((r) => r.join("\t")).join("\n");
    try {
      await navigator.clipboard.writeText(tsv);
      notify(`${targetCsvMembers.length} fiche(s) copiées ! Vous pouvez les coller directement (Ctrl+V) dans Excel ou Google Sheets.`);
    } catch {
      notify("Impossible de copier dans le presse-papiers sur cet appareil.", "error");
    }
  };

  return (
    <div>
      <SectionHeader title="Registre des membres" subtitle="Répertoire des frères et sœurs de l'assemblée et répartition par ministère.">
        <input
          ref={csvFileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleImportCsvFile}
          className="hidden"
          aria-label="Importer un fichier CSV de membres"
        />
        <button type="button" onClick={exportCsv} className={btnGold} disabled={filtered.length === 0}
          title="Télécharger immédiatement la liste affichée au format CSV (Excel / LibreOffice)">
          <Icon name="download" size={16} />Exporter en CSV ({filtered.length})
        </button>
        <button type="button" onClick={() => setCsvModalOpen(true)} className={btnGhost}
          title="Choisir le format de tableur (Excel / Google Sheets), importer un CSV ou prévisualiser">
          <Icon name="file" size={16} />Options tableur / CSV
        </button>
        <button type="button" onClick={openNew} className={btnPrimary}><Icon name="plus" size={16} />Inscrire un membre</button>
      </SectionHeader>

      <div className="mb-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => setMinistry("Tous")}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition ${ministry === "Tous" ? "bg-[#1B2A4A] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`}>
          Tous ({members.length})
        </button>
        {MINISTRIES.filter((k) => counts[k]).map((k) => (
          <button key={k} type="button" onClick={() => setMinistry(k)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${ministry === k ? "bg-[#9A7B2F] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"}`}>
            {k} ({counts[k]})
          </button>
        ))}
      </div>

      <div className={`${cardCls} mb-5 flex flex-wrap items-center gap-3 p-4`}>
        <SearchBox value={q} onChange={setQ} placeholder="Rechercher par nom, téléphone ou ministère…" />
        <select value={ministry} onChange={(e) => setMinistry(e.target.value)} aria-label="Filtrer par ministère" className={`${inputCls} w-auto`}>
          <option value="Tous">Tous les ministères</option>
          {MINISTRIES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun membre trouvé" hint="Inscrivez un nouveau membre ou modifiez votre recherche.">
          <button type="button" onClick={openNew} className={btnPrimary}><Icon name="plus" size={16} />Inscrire un membre</button>
        </EmptyState>
      ) : (
        <div className={`${cardCls} overflow-x-auto`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
              <tr>
                <th className="px-4 py-3">Nom complet</th>
                <th className="px-4 py-3">Téléphone</th>
                <th className="px-4 py-3">Ministère / Groupe</th>
                <th className="px-4 py-3">Date de baptême</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-[#1B2A4A]">{m.name}</td>
                  <td className="px-4 py-3 text-slate-700">{m.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-[#1B2A4A]/5 text-[#1B2A4A] ring-[#1B2A4A]/15">{m.ministry}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.baptismDate ? fmtDate(m.baptismDate) : <span className="text-xs text-slate-400">Non renseignée</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button type="button" onClick={() => openEdit(m)} className={iconBtn} aria-label={`Modifier ${m.name}`}><Icon name="edit" size={16} /></button>
                      <button type="button" onClick={() => setToDelete(m)} className={`${iconBtn} hover:text-red-600`} aria-label={`Supprimer ${m.name}`}><Icon name="trash" size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Modal title={editing ? "Modifier le membre" : "Inscrire un membre"} onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-4" noValidate>
            <Field label="Nom complet" required error={err}>
              <input type="text" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErr(""); }}
                placeholder="Prénom et nom" className={inputCls} />
            </Field>
            <Field label="Téléphone">
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+509 …" className={inputCls} />
            </Field>
            <Field label="Ministère / Groupe">
              <select value={form.ministry} onChange={(e) => setForm({ ...form, ministry: e.target.value })} className={inputCls}>
                {MINISTRIES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Date de baptême (si baptisé)">
              <input type="date" value={form.baptismDate} onChange={(e) => setForm({ ...form, baptismDate: e.target.value })} className={inputCls} />
            </Field>
            <FormActions onCancel={() => setOpen(false)} submitLabel={editing ? "Enregistrer" : "Inscrire"} />
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog title="Retirer ce membre du registre ?"
          message={`La fiche de « ${toDelete.name} » sera supprimée.`}
          confirmLabel="Supprimer"
          onConfirm={() => { setMembers((l) => l.filter((x) => x.id !== toDelete.id)); setToDelete(null); notify("Membre retiré du registre."); }}
          onCancel={() => setToDelete(null)} />
      )}

      {csvModalOpen && (
        <Modal title="Exporter le registre des membres en CSV (Tableur)" onClose={() => setCsvModalOpen(false)} wide>
          <div className="space-y-5">
            <p className="text-sm text-slate-600">
              Sauvegardez le registre des membres dans un fichier <strong>.CSV</strong> encodé en UTF-8 (avec prise en charge complète des accents français) pour l'ouvrir dans <strong>Microsoft Excel</strong>, <strong>LibreOffice Calc</strong> ou <strong>Google Sheets</strong>.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Membres à inclure dans l'exportation">
                <select
                  value={csvScope}
                  onChange={(e) => setCsvScope(e.target.value as typeof csvScope)}
                  className={inputCls}
                >
                  <option value="filtered">Sélection filtrée actuelle ({filtered.length} membre{filtered.length > 1 ? "s" : ""})</option>
                  <option value="all">Registre complet de l'église ({members.length} membre{members.length > 1 ? "s" : ""})</option>
                  <option value="baptized">Membres baptisés uniquement ({members.filter((m) => Boolean(m.baptismDate)).length})</option>
                  <option value="unbaptized">Membres sans date de baptême ({members.filter((m) => !m.baptismDate).length})</option>
                </select>
              </Field>

              <Field label="Format du séparateur (Tableur cible)">
                <select
                  value={csvDelimiter}
                  onChange={(e) => setCsvDelimiter(e.target.value as ";" | ",")}
                  className={inputCls}
                >
                  <option value=";">Point-virgule ( ; ) — Recommandé pour Excel & LibreOffice (FR)</option>
                  <option value=",">Virgule ( , ) — Standard pour Google Sheets & Numbers</option>
                </select>
              </Field>
            </div>

            <label className="flex items-center gap-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={csvIncludeMeta}
                onChange={(e) => setCsvIncludeMeta(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[#1B2A4A] focus:ring-[#9A7B2F]"
              />
              Inclure le nom de l'assemblée ({CHURCH}) et la date d'exportation ({fmtDate(todayISO())}) dans chaque ligne
            </label>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1B2A4A]">
                  Aperçu des colonnes du tableur ({targetCsvMembers.length} ligne{targetCsvMembers.length > 1 ? "s" : ""} à exporter)
                </span>
                <span className="font-mono text-xs text-slate-500">
                  Encodage : UTF-8 BOM · Séparateur : « {csvDelimiter} »
                </span>
              </div>

              {targetCsvMembers.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">Aucun membre ne correspond à cette sélection.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs tabular-nums">
                    <thead className="border-b border-slate-200 bg-slate-100 text-slate-700">
                      <tr>
                        {previewCsvRows[0]?.map((col, idx) => (
                          <th key={idx} className="whitespace-nowrap px-3 py-2 font-semibold">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewCsvRows.slice(1).map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cellVal, cIdx) => (
                            <td key={cIdx} className="whitespace-nowrap px-3 py-1.5 text-slate-600">{cellVal || "—"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {targetCsvMembers.length > 5 && (
                    <p className="border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500">
                      + {targetCsvMembers.length - 5} autre(s) membre(s) inclus dans le fichier téléchargé.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopyForSpreadsheet}
                  disabled={targetCsvMembers.length === 0}
                  className={btnGhost}
                >
                  <Icon name="file" size={16} />Copier pour Excel / Sheets
                </button>
                <button
                  type="button"
                  onClick={() => csvFileInputRef.current?.click()}
                  className={btnGhost}
                >
                  <Icon name="upload" size={16} />Importer un fichier .CSV
                </button>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setCsvModalOpen(false)} className={btnGhost}>
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={handleAdvancedCsvExport}
                  disabled={targetCsvMembers.length === 0}
                  className={btnPrimary}
                >
                  <Icon name="download" size={16} />Télécharger le fichier .CSV ({targetCsvMembers.length})
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ────────────────────────────── 5. Événements & Agenda ────────────────────────────── */

const EVENT_KINDS = ["Culte", "Réunion de prière", "Convention", "Événement communautaire", "Jeunesse", "Formation", "Autre"];
const emptyEvent = (): Omit<EventItem, "id"> => ({
  title: "", kind: EVENT_KINDS[0], date: todayISO(), time: "09:00", location: CHURCH, description: "", published: true,
});

function AgendaView({ events, setEvents, notify }: {
  events: EventItem[]; setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>; notify: Notify;
}) {
  const [tab, setTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [kind, setKind] = useState("Tous");
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<EventItem, "id">>(emptyEvent);
  const [err, setErr] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<EventItem | null>(null);
  const today = todayISO();

  const list = useMemo(() => {
    const filtered = events.filter((e) => {
      if (kind !== "Tous" && e.kind !== kind) return false;
      if (tab === "upcoming") return e.date >= today;
      if (tab === "past") return e.date < today;
      return true;
    });
    return filtered.sort((a, b) =>
      tab === "past" ? (b.date + b.time).localeCompare(a.date + a.time) : (a.date + a.time).localeCompare(b.date + b.time),
    );
  }, [events, tab, kind, today]);

  const openNew = () => { setForm(emptyEvent()); setErr({}); setEditing(null); setOpen(true); };
  const openEdit = (e: EventItem) => {
    setForm({ title: e.title, kind: e.kind, date: e.date, time: e.time, location: e.location, description: e.description, published: e.published });
    setErr({}); setEditing(e); setOpen(true);
  };

  const save = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Le titre est obligatoire.";
    if (!form.date) e.date = "La date est obligatoire.";
    if (Object.keys(e).length) { setErr(e); return; }
    const clean = { ...form, title: form.title.trim(), location: form.location.trim(), description: form.description.trim() };
    if (editing) {
      setEvents((l) => l.map((x) => (x.id === editing.id ? { id: editing.id, ...clean } : x)));
      notify("Événement mis à jour.");
    } else {
      setEvents((l) => [{ id: uid(), ...clean }, ...l]);
      notify("Événement ajouté à l'agenda.");
    }
    setOpen(false); setEditing(null);
  };

  const togglePub = (e: EventItem) => {
    setEvents((l) => l.map((x) => (x.id === e.id ? { ...x, published: !x.published } : x)));
    notify(e.published ? "Événement passé en brouillon." : "Événement publié.");
  };

  return (
    <div>
      <SectionHeader title="Événements & Agenda" subtitle="Cultes, réunions de prière, conventions et rencontres communautaires.">
        <button
          type="button"
          onClick={() => {
            const fileName = exportEventsToCsv(list);
            notify(`Agenda exporté en CSV (${list.length} événement(s)) : ${fileName}`);
          }}
          disabled={list.length === 0}
          className={btnGhost}
        >
          <Icon name="download" size={16} />Exporter l'agenda (CSV)
        </button>
        <button type="button" onClick={openNew} className={btnPrimary}><Icon name="plus" size={16} />Nouvel événement</button>
      </SectionHeader>

      <div className={`${cardCls} mb-5 flex flex-wrap items-center justify-between gap-3 p-4`}>
        <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5" role="tablist" aria-label="Période">
          {([
            ["upcoming", "À venir"],
            ["past", "Passés"],
            ["all", "Tous"],
          ] as const).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${tab === k ? "bg-[#1B2A4A] text-white" : "text-slate-600"}`}>
              {label}
            </button>
          ))}
        </div>
        <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Filtrer par type" className={`${inputCls} w-auto`}>
          <option value="Tous">Tous les types</option>
          {EVENT_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState title="Aucun événement dans cette vue" hint="Programmez un culte, une veillée de prière ou une convention.">
          <button type="button" onClick={openNew} className={btnPrimary}><Icon name="plus" size={16} />Ajouter un événement</button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {list.map((e) => {
            const d = new Date(e.date + "T12:00:00");
            const day = isNaN(d.getTime()) ? "—" : d.getDate();
            const month = isNaN(d.getTime()) ? "" : d.toLocaleDateString("fr-FR", { month: "short" });
            return (
              <div key={e.id} className={`${cardCls} flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center`}>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#1B2A4A] text-white">
                    <span className="es-serif text-xl font-bold leading-none">{day}</span>
                    <span className="mt-0.5 text-[10px] uppercase tracking-wider" style={{ color: GOLD_LIGHT }}>{month}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge className="bg-[#9A7B2F]/15 text-[#9A7B2F] ring-[#9A7B2F]/30">{e.kind}</Badge>
                      <Badge className={e.published ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}>
                        {e.published ? "Publié sur le site" : "Brouillon"}
                      </Badge>
                    </div>
                    <h3 className="es-serif mt-1 text-lg font-semibold text-[#1B2A4A]">{e.title}</h3>
                    <p className="text-xs text-slate-500">
                      {fmtDate(e.date)}{e.time ? ` à ${e.time.replace(":", "h")}` : ""}{e.location ? ` · ${e.location}` : ""}
                    </p>
                    {e.description && <p className="mt-1 text-sm text-slate-600">{e.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button type="button" onClick={() => togglePub(e)} className={btnGhost}
                    title={e.published ? "Retirer de la publication" : "Publier"}>
                    <Icon name={e.published ? "eyeOff" : "eye"} size={15} />
                    {e.published ? "Dépublier" : "Publier"}
                  </button>
                  <button type="button" onClick={() => openEdit(e)} className={iconBtn} aria-label={`Modifier ${e.title}`}><Icon name="edit" size={16} /></button>
                  <button type="button" onClick={() => setToDelete(e)} className={`${iconBtn} hover:text-red-600`} aria-label={`Supprimer ${e.title}`}><Icon name="trash" size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {open && (
        <Modal title={editing ? "Modifier l'événement" : "Nouvel événement"} onClose={() => setOpen(false)}>
          <form onSubmit={save} className="space-y-4" noValidate>
            <Field label="Titre de l'événement" required error={err.title}>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex. : Convention de réveil, Veillée de prière…" className={inputCls} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type">
                <select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className={inputCls}>
                  {EVENT_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Lieu">
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Date" required error={err.date}>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Heure">
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label="Description">
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Programme, invités, informations pratiques…" className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[#1B2A4A] focus:ring-[#9A7B2F]" />
              Publier sur le site de l'église
            </label>
            <FormActions onCancel={() => setOpen(false)} submitLabel={editing ? "Enregistrer" : "Programmer"} />
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog title="Supprimer cet événement ?"
          message={`L'événement « ${toDelete.title} » sera retiré de l'agenda.`}
          confirmLabel="Supprimer"
          onConfirm={() => { setEvents((l) => l.filter((x) => x.id !== toDelete.id)); setToDelete(null); notify("Événement supprimé."); }}
          onCancel={() => setToDelete(null)} />
      )}
    </div>
  );
}

/* ────────────────────────────── 6. Prédications & Médias ────────────────────────────── */

const emptySermon = (): Omit<Sermon, "id"> => ({ title: "", speaker: PASTOR, passage: "", date: todayISO(), audioUrl: "", fileName: "" });
const emptyAnn = (): Omit<Announcement, "id"> => ({ title: "", content: "", date: todayISO(), priority: "Normale", published: true });

function MediaView({
  sermons, setSermons, announcements, setAnnouncements, notify,
}: {
  sermons: Sermon[]; setSermons: React.Dispatch<React.SetStateAction<Sermon[]>>;
  announcements: Announcement[]; setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  notify: Notify;
}) {
  const [sub, setSub] = useState<"sermons" | "announcements">("sermons");

  // Prédications
  const [sOpen, setSOpen] = useState(false);
  const [sEdit, setSEdit] = useState<Sermon | null>(null);
  const [sForm, setSForm] = useState<Omit<Sermon, "id">>(emptySermon);
  const [sFile, setSFile] = useState<File | null>(null);
  const [sErr, setSErr] = useState<Record<string, string>>({});
  const [sDel, setSDel] = useState<Sermon | null>(null);

  // Annonces
  const [aOpen, setAOpen] = useState(false);
  const [aEdit, setAEdit] = useState<Announcement | null>(null);
  const [aForm, setAForm] = useState<Omit<Announcement, "id">>(emptyAnn);
  const [aErr, setAErr] = useState("");
  const [aDel, setADel] = useState<Announcement | null>(null);

  const openNewSermon = () => { setSForm(emptySermon()); setSFile(null); setSErr({}); setSEdit(null); setSOpen(true); };
  const openEditSermon = (s: Sermon) => {
    setSForm({ title: s.title, speaker: s.speaker, passage: s.passage, date: s.date, audioUrl: s.audioUrl, fileName: s.fileName });
    setSFile(null); setSErr({}); setSEdit(s); setSOpen(true);
  };

  const saveSermon = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!sForm.title.trim()) e.title = "Le titre est obligatoire.";
    if (sForm.audioUrl.trim() && !isAudioSource(sForm.audioUrl.trim())) e.audioUrl = "Lien invalide : commencez par https:// ou /";
    if (Object.keys(e).length) { setSErr(e); return; }
    const id = sEdit ? sEdit.id : uid();
    if (sFile) localAudioUrls[id] = URL.createObjectURL(sFile);
    const clean: Sermon = {
      id, title: sForm.title.trim(), speaker: sForm.speaker.trim() || PASTOR,
      passage: sForm.passage.trim(), date: sForm.date, audioUrl: sForm.audioUrl.trim(),
      fileName: sFile ? sFile.name : sForm.fileName,
    };
    setSermons((l) => (sEdit ? l.map((x) => (x.id === id ? clean : x)) : [clean, ...l]));
    notify(sEdit ? "Prédication mise à jour." : "Prédication enregistrée.");
    setSOpen(false); setSEdit(null);
  };

  const openNewAnn = () => { setAForm(emptyAnn()); setAErr(""); setAEdit(null); setAOpen(true); };
  const openEditAnn = (a: Announcement) => {
    setAForm({ title: a.title, content: a.content, date: a.date, priority: a.priority, published: a.published });
    setAErr(""); setAEdit(a); setAOpen(true);
  };

  const saveAnn = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!aForm.title.trim() || !aForm.content.trim()) { setAErr("Le titre et le texte de l'annonce sont obligatoires."); return; }
    const clean = { ...aForm, title: aForm.title.trim(), content: aForm.content.trim() };
    setAnnouncements((l) => (aEdit ? l.map((x) => (x.id === aEdit.id ? { id: aEdit.id, ...clean } : x)) : [{ id: uid(), ...clean }, ...l]));
    notify(aEdit ? "Annonce mise à jour." : "Annonce enregistrée.");
    setAOpen(false); setAEdit(null);
  };

  return (
    <div>
      <SectionHeader title="Prédications & Médias" subtitle="Messages audio du pasteur et annonces aux fidèles.">
        {sub === "sermons" ? (
          <button type="button" onClick={openNewSermon} className={btnPrimary}><Icon name="plus" size={16} />Ajouter une prédication</button>
        ) : (
          <button type="button" onClick={openNewAnn} className={btnPrimary}><Icon name="plus" size={16} />Nouvelle annonce</button>
        )}
      </SectionHeader>

      <div className="mb-5 inline-flex rounded-lg border border-slate-300 bg-white p-1" role="tablist">
        <button type="button" role="tab" aria-selected={sub === "sermons"} onClick={() => setSub("sermons")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${sub === "sermons" ? "bg-[#1B2A4A] text-white" : "text-slate-600"}`}>
          <Icon name="mic" size={16} />Prédications audio ({sermons.length})
        </button>
        <button type="button" role="tab" aria-selected={sub === "announcements"} onClick={() => setSub("announcements")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold ${sub === "announcements" ? "bg-[#1B2A4A] text-white" : "text-slate-600"}`}>
          <Icon name="megaphone" size={16} />Annonces & Nouvelles ({announcements.length})
        </button>
      </div>

      {sub === "sermons" ? (
        sermons.length === 0 ? (
          <EmptyState title="Aucune prédication enregistrée" hint="Ajoutez un message audio (lien MP3 ou fichier depuis cet appareil).">
            <button type="button" onClick={openNewSermon} className={btnPrimary}><Icon name="plus" size={16} />Ajouter une prédication</button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sermons.map((s) => {
              const src = localAudioUrls[s.id] || s.audioUrl;
              return (
                <div key={s.id} className={`${cardCls} flex flex-col justify-between p-5`}>
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold text-[#9A7B2F]">{fmtDate(s.date)}{s.passage ? ` · ${s.passage}` : ""}</p>
                        <h3 className="es-serif mt-1 text-xl font-semibold text-[#1B2A4A]">{s.title}</h3>
                        <p className="text-xs text-slate-500">Prédicateur : {s.speaker}</p>
                      </div>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => openEditSermon(s)} className={iconBtn} aria-label={`Modifier ${s.title}`}><Icon name="edit" size={16} /></button>
                        <button type="button" onClick={() => setSDel(s)} className={`${iconBtn} hover:text-red-600`} aria-label={`Supprimer ${s.title}`}><Icon name="trash" size={16} /></button>
                      </div>
                    </div>
                    {src ? (
                      <audio controls preload="metadata" src={src} className="mt-4 w-full">
                        Votre navigateur ne prend pas en charge la lecture audio.
                      </audio>
                    ) : (
                      <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        {s.fileName
                          ? `Fichier local « ${s.fileName} » (à recharger pour écoute dans cette session ou à remplacer par un lien permanent).`
                          : "Aucun fichier audio associé pour le moment."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : announcements.length === 0 ? (
        <EmptyState title="Aucune annonce" hint="Rédigez une annonce pour le culte ou pour le site de l'église.">
          <button type="button" onClick={openNewAnn} className={btnPrimary}><Icon name="plus" size={16} />Nouvelle annonce</button>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className={`${cardCls} flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-start`}>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className={a.priority === "Importante" ? "bg-amber-50 text-amber-900 ring-amber-300" : "bg-slate-100 text-slate-700 ring-slate-200"}>
                    {a.priority}
                  </Badge>
                  <Badge className={a.published ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-slate-100 text-slate-600 ring-slate-200"}>
                    {a.published ? "Publiée" : "Brouillon"}
                  </Badge>
                  <span className="text-xs text-slate-500">· {fmtDate(a.date)}</span>
                </div>
                <h3 className="es-serif mt-2 text-lg font-semibold text-[#1B2A4A]">{a.title}</h3>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{a.content}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button"
                  onClick={() => setAnnouncements((l) => l.map((x) => (x.id === a.id ? { ...x, published: !x.published } : x)))}
                  className={btnGhost}>
                  <Icon name={a.published ? "eyeOff" : "eye"} size={15} />{a.published ? "Dépublier" : "Publier"}
                </button>
                <button type="button" onClick={() => openEditAnn(a)} className={iconBtn} aria-label={`Modifier ${a.title}`}><Icon name="edit" size={16} /></button>
                <button type="button" onClick={() => setADel(a)} className={`${iconBtn} hover:text-red-600`} aria-label={`Supprimer ${a.title}`}><Icon name="trash" size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sOpen && (
        <Modal title={sEdit ? "Modifier la prédication" : "Ajouter une prédication"} onClose={() => setSOpen(false)}>
          <form onSubmit={saveSermon} className="space-y-4" noValidate>
            <Field label="Titre du message" required error={sErr.title}>
              <input type="text" value={sForm.title} onChange={(e) => setSForm({ ...sForm, title: e.target.value })}
                placeholder="Ex. : La foi qui agit" className={inputCls} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prédicateur">
                <input type="text" value={sForm.speaker} onChange={(e) => setSForm({ ...sForm, speaker: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Date">
                <input type="date" value={sForm.date} onChange={(e) => setSForm({ ...sForm, date: e.target.value })} className={inputCls} />
              </Field>
            </div>
            <Field label="Passage biblique">
              <input type="text" value={sForm.passage} onChange={(e) => setSForm({ ...sForm, passage: e.target.value })}
                placeholder="Ex. : Jean 3:16, Romains 8:1-11…" className={inputCls} />
            </Field>
            <Field label="Lien vers le fichier audio (MP3, etc.)" error={sErr.audioUrl}
              hint="Recommandé pour une écoute permanente sur le site.">
              <input type="url" value={sForm.audioUrl} onChange={(e) => setSForm({ ...sForm, audioUrl: e.target.value })}
                placeholder="https://…/predication.mp3" className={inputCls} />
            </Field>
            <Field label="Ou choisir un fichier audio sur cet appareil"
              hint="Lecture immédiate pendant cette session (non stocké dans le navigateur pour ménager l'espace).">
              <input type="file" accept="audio/*" onChange={(e) => setSFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-[#1B2A4A] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#24385f]" />
            </Field>
            <FormActions onCancel={() => setSOpen(false)} submitLabel={sEdit ? "Enregistrer" : "Ajouter"} />
          </form>
        </Modal>
      )}

      {aOpen && (
        <Modal title={aEdit ? "Modifier l'annonce" : "Nouvelle annonce"} onClose={() => setAOpen(false)}>
          <form onSubmit={saveAnn} className="space-y-4" noValidate>
            {aErr && <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700" role="alert">{aErr}</p>}
            <Field label="Titre" required>
              <input type="text" value={aForm.title} onChange={(e) => setAForm({ ...aForm, title: e.target.value })} className={inputCls} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <input type="date" value={aForm.date} onChange={(e) => setAForm({ ...aForm, date: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Priorité">
                <select value={aForm.priority} onChange={(e) => setAForm({ ...aForm, priority: e.target.value as Announcement["priority"] })} className={inputCls}>
                  <option value="Normale">Normale</option>
                  <option value="Importante">Importante</option>
                </select>
              </Field>
            </div>
            <Field label="Contenu de l'annonce" required>
              <textarea rows={4} value={aForm.content} onChange={(e) => setAForm({ ...aForm, content: e.target.value })} className={inputCls} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={aForm.published} onChange={(e) => setAForm({ ...aForm, published: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[#1B2A4A] focus:ring-[#9A7B2F]" />
              Publier immédiatement
            </label>
            <FormActions onCancel={() => setAOpen(false)} submitLabel={aEdit ? "Enregistrer" : "Publier"} />
          </form>
        </Modal>
      )}

      {sDel && (
        <ConfirmDialog title="Supprimer cette prédication ?" message={`« ${sDel.title} » sera supprimée.`} confirmLabel="Supprimer"
          onConfirm={() => { setSermons((l) => l.filter((x) => x.id !== sDel.id)); setSDel(null); notify("Prédication supprimée."); }}
          onCancel={() => setSDel(null)} />
      )}
      {aDel && (
        <ConfirmDialog title="Supprimer cette annonce ?" message={`« ${aDel.title} » sera supprimée.`} confirmLabel="Supprimer"
          onConfirm={() => { setAnnouncements((l) => l.filter((x) => x.id !== aDel.id)); setADel(null); notify("Annonce supprimée."); }}
          onCancel={() => setADel(null)} />
      )}
    </div>
  );
}

/* ────────────────────────────── Composant principal ────────────────────────────── */

const NAV: { id: SectionId; label: string; icon: string }[] = [
  { id: "accueil", label: "Vue d'ensemble", icon: "dashboard" },
  { id: "projets", label: "Projets sociaux", icon: "folder" },
  { id: "documents", label: "Documents officiels", icon: "file" },
  { id: "membres", label: "Registre des membres", icon: "users" },
  { id: "agenda", label: "Événements & Agenda", icon: "calendar" },
  { id: "medias", label: "Prédications & Médias", icon: "mic" },
  { id: "newsletter", label: "Newsletter & Brevo", icon: "mail" },
];

export interface EspaceSecretariatProps {
  /** Mot de passe d'accès côté navigateur (par défaut : "Nazareen2026"). */
  password?: string;
  /** Permet de revenir à la vue publique du site. */
  onBackToSite?: () => void;
}

export default function EspaceSecretariatComplete({ password = DEFAULT_PASSWORD, onBackToSite }: EspaceSecretariatProps) {
  const [authed, setAuthed] = useState<boolean>(() => {
    try { return sessionStorage.getItem(AUTH_KEY) === "1"; } catch { return false; }
  });
  const [section, setSection] = useState<SectionId>("accueil");
  const [drawer, setDrawer] = useState(false);

  const [projects, setProjects] = useStored<Project[]>("end_sec_projects", seedProjects);
  const [members, setMembers] = useStored<Member[]>("end_sec_members", seedMembers);
  const [events, setEvents] = useStored<EventItem[]>("end_sec_events", seedEvents);
  const [sermons, setSermons] = useStored<Sermon[]>("end_sec_sermons", seedSermons);
  const [announcements, setAnnouncements] = useStored<Announcement[]>("end_sec_announcements", seedAnnouncements);
  const [docs, setDocs] = useStored<IssuedDoc[]>("end_sec_docs", seedDocs);

  const [toast, setToast] = useState<{ msg: string; kind: "ok" | "error" } | null>(null);
  const toastTimer = useRef<number | null>(null);
  const notify: Notify = useCallback((msg, kind = "ok") => {
    setToast({ msg, kind });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  if (!authed) return <LoginGate password={password} onSuccess={() => setAuthed(true)} onBackToSite={onBackToSite} />;

  const go = (s: SectionId) => { setSection(s); setDrawer(false); };
  const logout = () => {
    try { sessionStorage.removeItem(AUTH_KEY); } catch { /* ignore */ }
    setAuthed(false);
  };

  const SidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#1B2A4A] text-white">
      <div>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="shrink-0" dangerouslySetInnerHTML={{ __html: sealSvg(46) }} />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: GOLD_LIGHT }}>Secrétariat</p>
            <p className="es-serif truncate text-base font-semibold leading-tight">{CHURCH}</p>
          </div>
        </div>
        <nav className="space-y-1 p-3" aria-label="Menu du secrétariat">
          {NAV.map((n) => {
            const active = section === n.id;
            return (
              <button key={n.id} type="button" onClick={() => go(n.id)}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition ${focusRing} ${
                  active ? "bg-[#9A7B2F] text-white shadow-sm" : "text-slate-200 hover:bg-white/10 hover:text-white"
                }`}>
                <Icon name={n.icon} size={18} />
                <span>{n.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/10 p-4 text-xs text-slate-300">
        <p className="font-semibold text-white">{PASTOR}</p>
        <p className="mt-0.5 truncate text-slate-400">{SITE}</p>
        {onBackToSite && (
          <button type="button" onClick={onBackToSite}
            className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#9A7B2F]/50 bg-[#9A7B2F]/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#9A7B2F]/30 ${focusRing}`}>
            <Icon name="eye" size={15} />Voir le site public
          </button>
        )}
        <button type="button" onClick={logout}
          className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15 ${focusRing}`}>
          <Icon name="logout" size={15} />Verrouiller la session
        </button>
      </div>
    </div>
  );

  return (
    <div className="es-root min-h-screen bg-slate-100 text-slate-800 lg:flex">
      <FontStyles />

      {/* Barre latérale (ordinateur) */}
      <aside className="hidden w-68 shrink-0 lg:block">{SidebarContent}</aside>

      {/* Tiroir mobile */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="w-72 max-w-[82vw]">{SidebarContent}</div>
          <div className="flex-1 bg-black/50" onClick={() => setDrawer(false)} />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* En-tête */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDrawer(true)} className={`${iconBtn} lg:hidden`} aria-label="Ouvrir le menu">
              <Icon name="menu" size={22} />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2F]">Espace Secrétariat</p>
              <h1 className="es-serif text-lg font-semibold text-[#1B2A4A] sm:text-xl">
                {NAV.find((n) => n.id === section)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-500 sm:inline">Aujourd'hui : {fmtDate(todayISO())}</span>
            {onBackToSite && (
              <button type="button" onClick={onBackToSite} className={btnGhost} title="Retour au site public">
                <Icon name="eye" size={15} />
                <span className="hidden sm:inline">Site public</span>
              </button>
            )}
            <button type="button" onClick={() => go("documents")} className={btnGold}>
              <Icon name="file" size={15} />
              <span className="hidden sm:inline">Nouveau document</span>
            </button>
          </div>
        </header>

        {/* Contenu */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          {section === "accueil" && (
            <DashboardView projects={projects} members={members} events={events}
              docs={docs} sermons={sermons} announcements={announcements} go={go} notify={notify} />
          )}
          {section === "projets" && <ProjectsView projects={projects} setProjects={setProjects} notify={notify} />}
          {section === "documents" && <DocumentsView docs={docs} setDocs={setDocs} notify={notify} />}
          {section === "membres" && <MembersView members={members} setMembers={setMembers} notify={notify} />}
          {section === "agenda" && <AgendaView events={events} setEvents={setEvents} notify={notify} />}
          {section === "medias" && (
            <MediaView sermons={sermons} setSermons={setSermons}
              announcements={announcements} setAnnouncements={setAnnouncements} notify={notify} />
          )}
          {section === "newsletter" && <NewsletterManager notify={notify} />}
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-3 text-center text-xs text-slate-500">
          {CHURCH} · {PASTOR} · {SITE}
        </footer>
      </div>

      {toast && (
        <div role="status" aria-live="polite"
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${
            toast.kind === "error" ? "bg-red-700" : "bg-[#1B2A4A]"
          }`}>
          <span className="h-2 w-2 rounded-full" style={{ background: toast.kind === "error" ? "#fca5a5" : GOLD_LIGHT }} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}
