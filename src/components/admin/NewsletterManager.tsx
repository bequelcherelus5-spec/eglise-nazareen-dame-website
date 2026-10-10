/**
 * NewsletterManager.tsx
 * Gestionnaire de la Newsletter & Campagnes E-mail (Brevo API v3)
 * Église du Nazaréen de Damé — www.eglisedunazareendedame.org
 *
 * SÉCURITÉ :
 * - Aucune clé API n'est stockée ni lue côté navigateur.
 * - Toutes les opérations passent par les routes serveur `/api/newsletter/*` qui lisent `BREVO_API_KEY`
 *   exclusivement depuis les variables d'environnement serveur.
 */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiService, NewsletterCampaign, NewsletterSubscriber } from "../../services/apiService";
import {
  Badge,
  btnGhost,
  btnGold,
  btnPrimary,
  cardCls,
  CHURCH,
  ConfirmDialog,
  downloadFile,
  EmptyState,
  Field,
  fmtDate,
  GOLD_LIGHT,
  Icon,
  iconBtn,
  inputCls,
  Modal,
  Notify,
  PASTOR,
  SearchBox,
  SectionHeader,
  todayISO,
} from "./secretariatCore";

interface NewsletterManagerProps {
  notify: Notify;
}

const EMAIL_TEMPLATES: { label: string; title: string; subject: string; content: string }[] = [
  {
    label: "Programme des cultes de la semaine",
    title: "Programme Hebdomadaire des Cultes",
    subject: "Programme des cultes et réunions — Église du Nazaréen de Damé",
    content: `Que la paix et la grâce de notre Seigneur Jésus-Christ vous soient multipliées !

Nous avons la joie de vous partager le programme des cultes et rencontres de cette semaine à l'Église du Nazaréen de Damé :

• Dimanche (08h00 - 11h30) : Grand Culte d'Adoration & Célébration
• Mercredi (18h00 - 19h30) : Étude Biblique Approfondie
• Vendredi (18h00 - 19h45) : Réunion de Prière & Intercession
• Samedi (15h00 - 17h00) : Rencontre de la Jeunesse (JNI) & Répétition de la Chorale

Nous vous attendons nombreux dans la maison de l'Éternel !`,
  },
  {
    label: "Lettre pastorale mensuelle",
    title: "Lettre Pastorale Mensuelle",
    subject: "Message pastoral & Nouvelles de l'assemblée — Église du Nazaréen de Damé",
    content: `Bien-aimés dans le Seigneur,

« Voici, oh ! qu'il est agréable, qu'il est doux pour des frères de demeurer ensemble ! » (Psaume 133:1)

Tout au long de ce mois, le Seigneur a manifesté Sa fidélité au sein de notre assemblée à Damé, tant dans nos cultes d'adoration que dans nos œuvres sociales (Projet Solaire Communautaire, CDEJ et École Nazareth).

Demeurons fermes dans la prière, l'amour fraternel et la sanctification. Que l'Éternel bénisse abondamment vos familles !`,
  },
  {
    label: "Invitation à une convention / événement",
    title: "Invitation Spéciale — Convention de Réveil",
    subject: "Invitation spéciale : Convention de réveil spirituel à l'Église du Nazaréen de Damé",
    content: `Chers frères, sœurs et amis de l'Église du Nazaréen de Damé,

Vous êtes chaleureusement invités à participer à nos soirées spéciales de réveil spirituel, de louange et d'intercession qui se tiendront dans notre sanctuaire principal à Damé.

Invitez vos proches, vos voisins et vos amis à venir entendre la Parole vivante de Dieu !`,
  },
];

export default function NewsletterManager({ notify }: NewsletterManagerProps) {
  const [activeTab, setActiveTab] = useState<"subscribers" | "campaigns">("subscribers");
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string>("");

  // Brevo server status
  const [brevoStatus, setBrevoStatus] = useState<{
    configured: boolean;
    provider: string;
    senderEmail: string;
    senderName: string;
  }>({
    configured: false,
    provider: "Brevo API v3",
    senderEmail: "eglisedunazareendedame@gmail.com",
    senderName: CHURCH,
  });

  // Subscribers state
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Unsubscribed">("All");
  const [addSubModalOpen, setAddSubModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubEmail, setNewSubEmail] = useState("");
  const [newSubPhone, setNewSubPhone] = useState("");
  const [newSubError, setNewSubError] = useState("");
  const [submittingSubscriber, setSubmittingSubscriber] = useState(false);
  const [subToDelete, setSubToDelete] = useState<NewsletterSubscriber | null>(null);

  // Campaigns & Email composer state
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [campTitle, setCampTitle] = useState("");
  const [campSubject, setCampSubject] = useState("");
  const [campContent, setCampContent] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [sendError, setSendError] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setApiError("");
    try {
      const [statusData, subsData, campsData] = await Promise.all([
        apiService.getNewsletterStatus(),
        apiService.getNewsletterSubscribers(),
        apiService.getNewsletterCampaigns(),
      ]);
      setBrevoStatus(statusData);
      setSubscribers(subsData);
      setCampaigns(campsData);
    } catch (err: any) {
      setApiError(err?.message || "Impossible de charger les données de la newsletter.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const activeSubscribersCount = useMemo(
    () => subscribers.filter((s) => s.status === "Active").length,
    [subscribers],
  );

  const filteredSubscribers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return subscribers.filter((s) => {
      if (statusFilter !== "All" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q))
      );
    });
  }, [subscribers, searchQuery, statusFilter]);

  /* ────────────────── Actions Abonnés ────────────────── */

  const handleCreateSubscriber = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setNewSubError("");

    const cleanEmail = newSubEmail.trim().toLowerCase();
    const cleanName = newSubName.trim() || "Membre de l'Assemblée";
    const cleanPhone = newSubPhone.trim() || undefined;

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setNewSubError("Veuillez saisir une adresse e-mail valide (ex. : fidèle@exemple.com).");
      return;
    }

    setSubmittingSubscriber(true);
    try {
      const result = await apiService.subscribeNewsletter(cleanName, cleanEmail, cleanPhone);
      if (!result.success) {
        setNewSubError(result.error || "Erreur lors de l'enregistrement de l'abonné.");
        notify(result.error || "Erreur lors de l'ajout de l'abonné.", "error");
        return;
      }

      const updatedSubs = await apiService.getNewsletterSubscribers();
      setSubscribers(updatedSubs);
      setNewSubName("");
      setNewSubEmail("");
      setNewSubPhone("");
      setAddSubModalOpen(false);
      notify(
        result.alreadyActive
          ? `L'adresse ${cleanEmail} est déjà inscrite et active.`
          : `Abonné « ${cleanName} » (${cleanEmail}) inscrit avec succès${result.brevoSynced ? " et synchronisé avec Brevo" : ""} !`,
      );
    } catch (err: any) {
      const msg = err?.message || "Erreur lors de la création de l'abonné.";
      setNewSubError(msg);
      notify(msg, "error");
    } finally {
      setSubmittingSubscriber(false);
    }
  };

  const handleToggleSubscriberStatus = async (sub: NewsletterSubscriber) => {
    const nextStatus: "Active" | "Unsubscribed" = sub.status === "Active" ? "Unsubscribed" : "Active";
    const ok = await apiService.updateSubscriberStatus(sub.id, nextStatus);
    if (!ok) {
      notify("Erreur lors de la mise à jour du statut de l'abonné.", "error");
      return;
    }
    setSubscribers((prev) =>
      prev.map((item) => (item.id === sub.id ? { ...item, status: nextStatus } : item)),
    );
    notify(
      nextStatus === "Active"
        ? `L'abonné ${sub.email} a été réactivé.`
        : `L'abonné ${sub.email} a été désabonné.`,
    );
  };

  const handleDeleteSubscriber = async () => {
    if (!subToDelete) return;
    const target = subToDelete;
    const ok = await apiService.deleteSubscriber(target.id);
    setSubToDelete(null);
    if (!ok) {
      notify("Erreur lors de la suppression de l'abonné.", "error");
      return;
    }
    setSubscribers((prev) => prev.filter((item) => item.id !== target.id));
    notify(`Abonné « ${target.email} » supprimé de la liste.`);
  };

  const handleExportSubscribersCsv = () => {
    if (filteredSubscribers.length === 0) {
      notify("Aucun abonné à exporter.", "error");
      return;
    }
    const cell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const headers = ["N°", "Nom complet", "Adresse E-mail", "Téléphone", "Statut", "Date d'inscription"];
    const rows = filteredSubscribers.map((s, idx) => [
      String(idx + 1),
      s.name || "—",
      s.email,
      s.phone || "—",
      s.status === "Active" ? "Actif" : "Désabonné",
      fmtDate(s.subscribedAt.slice(0, 10)),
    ]);
    const csv = "\uFEFF" + [headers, ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
    const fileName = `abonnes-newsletter-nazareen-dame-${todayISO()}.csv`;
    downloadFile(fileName, csv, "text/csv;charset=utf-8");
    notify(`Export CSV téléchargé (${filteredSubscribers.length} abonné(s)) : ${fileName}`);
  };

  /* ────────────────── Actions Campagnes & Envoi E-mail ────────────────── */

  const applyTemplate = (tpl: (typeof EMAIL_TEMPLATES)[number]) => {
    setCampTitle(tpl.title);
    setCampSubject(tpl.subject);
    setCampContent(tpl.content);
    setSendError("");
    notify(`Modèle « ${tpl.label} » chargé dans l'éditeur.`);
  };

  const handleDispatchCampaign = async (mode: "Draft" | "Test" | "SendAll") => {
    setSendError("");
    const cleanSubject = campSubject.trim();
    const cleanTitle = campTitle.trim() || cleanSubject;
    const cleanContent = campContent.trim();
    const cleanTestEmail = testEmail.trim().toLowerCase();

    if (!cleanSubject || !cleanContent) {
      setSendError("L'objet de l'e-mail et le contenu du message sont obligatoires.");
      notify("Veuillez renseigner l'objet et le contenu de la newsletter.", "error");
      return;
    }

    if (mode === "Test") {
      if (!cleanTestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanTestEmail)) {
        setSendError("Veuillez saisir une adresse e-mail de test valide.");
        notify("Adresse e-mail de test invalide.", "error");
        return;
      }
    }

    if (mode === "SendAll" && activeSubscribersCount === 0) {
      setSendError("Aucun abonné actif. Inscrivez ou activez au moins un abonné avant l'envoi.");
      notify("Aucun abonné actif dans la liste.", "error");
      return;
    }

    setSendingEmail(true);
    try {
      const activeRecipients = subscribers
        .filter((s) => s.status === "Active")
        .map((s) => ({ email: s.email, name: s.name }));

      const result = await apiService.createNewsletterCampaign({
        title: cleanTitle,
        subject: cleanSubject,
        content: cleanContent,
        targetAudience:
          mode === "Test"
            ? `Test (${cleanTestEmail})`
            : `Abonnés actifs (${activeSubscribersCount})`,
        status: mode === "Draft" ? "Draft" : "Sent",
        testEmail: mode === "Test" ? cleanTestEmail : undefined,
        recipients: activeRecipients,
      });

      if (!result.success) {
        const errMsg = result.error || "Échec lors du traitement de la campagne newsletter.";
        setSendError(errMsg);
        notify(errMsg, "error");
        return;
      }

      if (result.campaign) {
        setCampaigns((prev) => [result.campaign!, ...prev]);
      } else {
        const refreshed = await apiService.getNewsletterCampaigns();
        setCampaigns(refreshed);
      }

      if (mode === "Draft") {
        notify("Brouillon de la newsletter enregistré avec succès.");
      } else if (mode === "Test") {
        notify(result.message || `E-mail de test envoyé à ${cleanTestEmail}.`);
      } else {
        setCampTitle("");
        setCampSubject("");
        setCampContent("");
        notify(
          result.message ||
            `Newsletter envoyée avec succès à ${result.sentCount || activeSubscribersCount} abonné(s) !`,
        );
      }
    } catch (err: any) {
      const msg = err?.message || "Erreur inattendue lors de l'envoi de la newsletter.";
      setSendError(msg);
      notify(msg, "error");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Newsletter & Messagerie (Brevo)"
        subtitle="Gérez les abonnés à la lettre pastorale et envoyez les annonces de l'église par e-mail."
      >
        <button type="button" onClick={handleExportSubscribersCsv} className={btnGhost} disabled={filteredSubscribers.length === 0}>
          <Icon name="download" size={16} />Exporter les abonnés (CSV)
        </button>
        <button
          type="button"
          onClick={() => {
            setNewSubError("");
            setAddSubModalOpen(true);
          }}
          className={btnGold}
        >
          <Icon name="plus" size={16} />Ajouter un abonné
        </button>
        <button
          type="button"
          onClick={() => setActiveTab(activeTab === "subscribers" ? "campaigns" : "subscribers")}
          className={btnPrimary}
        >
          <Icon name={activeTab === "subscribers" ? "send" : "users"} size={16} />
          {activeTab === "subscribers" ? "Composer une newsletter" : `Voir les abonnés (${subscribers.length})`}
        </button>
      </SectionHeader>

      {/* Bandeau d'état Brevo & statistiques rapides */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className={`${cardCls} border-t-4 border-t-[#1B2A4A] p-4`}>
          <p className="text-xs font-medium text-slate-500">Abonnés actifs</p>
          <p className="es-serif mt-1 text-3xl font-bold text-[#1B2A4A]">{activeSubscribersCount}</p>
          <p className="mt-1 text-xs text-slate-500">Sur {subscribers.length} inscrit(s) au total</p>
        </div>
        <div className={`${cardCls} border-t-4 border-t-[#9A7B2F] p-4`}>
          <p className="text-xs font-medium text-slate-500">Campagnes & Envois</p>
          <p className="es-serif mt-1 text-3xl font-bold text-[#1B2A4A]">
            {campaigns.filter((c) => c.status === "Sent").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {campaigns.filter((c) => c.status === "Draft").length} brouillon(s) enregistré(s)
          </p>
        </div>
        <div className={`${cardCls} border-t-4 border-t-[#1B2A4A] p-4`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Service d'expédition</p>
            <Badge
              className={
                brevoStatus.configured
                  ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                  : "bg-amber-50 text-amber-900 ring-amber-300"
              }
            >
              {brevoStatus.configured ? "Brevo API Connectée" : "Mode Local / Prêt"}
            </Badge>
          </div>
          <p className="es-serif mt-1 truncate text-base font-semibold text-[#1B2A4A]">
            {brevoStatus.senderName}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">
            Expéditeur : {brevoStatus.senderEmail}
          </p>
        </div>
      </div>

      {apiError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <p className="font-semibold">Erreur de communication avec l'API Newsletter :</p>
          <p className="mt-0.5">{apiError}</p>
        </div>
      )}

      {/* Onglets Abonnés / Campagnes */}
      <div className="mb-5 inline-flex rounded-lg border border-slate-300 bg-white p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "subscribers"}
          onClick={() => setActiveTab("subscribers")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
            activeTab === "subscribers" ? "bg-[#1B2A4A] text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Icon name="users" size={16} />
          Liste des abonnés ({subscribers.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "campaigns"}
          onClick={() => setActiveTab("campaigns")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
            activeTab === "campaigns" ? "bg-[#1B2A4A] text-white" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Icon name="send" size={16} />
          Envoyer une Newsletter & Historique ({campaigns.length})
        </button>
      </div>

      {activeTab === "subscribers" ? (
        <div>
          <div className={`${cardCls} mb-5 flex flex-wrap items-center justify-between gap-3 p-4`}>
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un abonné par nom, e-mail ou téléphone…"
            />
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  ["All", `Tous (${subscribers.length})`],
                  ["Active", `Actifs (${activeSubscribersCount})`],
                  ["Unsubscribed", `Désabonnés (${subscribers.length - activeSubscribersCount})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    statusFilter === key
                      ? "bg-[#1B2A4A] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className={`${cardCls} p-8 text-center text-sm text-slate-500`}>
              Chargement des abonnés de la newsletter…
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <EmptyState
              title="Aucun abonné trouvé"
              hint="Ajoutez un abonné manuellement ou modifiez vos critères de recherche."
            >
              <button type="button" onClick={() => setAddSubModalOpen(true)} className={btnPrimary}>
                <Icon name="plus" size={16} />Ajouter un abonné
              </button>
            </EmptyState>
          ) : (
            <div className={`${cardCls} overflow-x-auto`}>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-600">
                  <tr>
                    <th className="px-4 py-3">Nom complet</th>
                    <th className="px-4 py-3">Adresse E-mail</th>
                    <th className="px-4 py-3">Téléphone</th>
                    <th className="px-4 py-3">Date d'inscription</th>
                    <th className="px-4 py-3">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-medium text-[#1B2A4A]">{sub.name || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{sub.email}</td>
                      <td className="px-4 py-3 text-slate-600">{sub.phone || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(sub.subscribedAt.slice(0, 10))}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            sub.status === "Active"
                              ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                              : "bg-slate-100 text-slate-600 ring-slate-200"
                          }
                        >
                          {sub.status === "Active" ? "Actif" : "Désabonné"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleSubscriberStatus(sub)}
                            className={btnGhost}
                            title={sub.status === "Active" ? "Désabonner cet inscrit" : "Réactiver cet inscrit"}
                          >
                            {sub.status === "Active" ? "Désabonner" : "Réactiver"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setSubToDelete(sub)}
                            className={`${iconBtn} hover:text-red-600`}
                            aria-label={`Supprimer ${sub.email}`}
                          >
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
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Éditeur de campagne e-mail */}
          <div className={`${cardCls} p-5 lg:col-span-7`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="es-serif text-xl font-semibold text-[#1B2A4A]">
                  Composer & Envoyer une Newsletter
                </h3>
                <p className="text-xs text-slate-500">
                  Expédition sécurisée aux {activeSubscribersCount} abonné(s) actif(s) via `/api/newsletter/send`.
                </p>
              </div>
            </div>

            {/* Modèles rapides */}
            <div className="mb-4">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#9A7B2F]">
                Modèles rapides de l'église :
              </span>
              <div className="flex flex-wrap gap-2">
                {EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    type="button"
                    onClick={() => applyTemplate(tpl)}
                    className="rounded-lg border border-[#9A7B2F]/30 bg-[#9A7B2F]/10 px-3 py-1.5 text-xs font-semibold text-[#1B2A4A] transition hover:bg-[#9A7B2F]/20"
                  >
                    + {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {sendError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700" role="alert">
                {sendError}
              </div>
            )}

            <div className="space-y-4">
              <Field label="Titre de la campagne" hint="Nom interne pour l'historique du secrétariat.">
                <input
                  type="text"
                  value={campTitle}
                  onChange={(e) => {
                    setCampTitle(e.target.value);
                    setSendError("");
                  }}
                  placeholder="Ex. : Lettre Pastorale — Octobre 2026"
                  className={inputCls}
                />
              </Field>

              <Field label="Objet de l'e-mail" required>
                <input
                  type="text"
                  value={campSubject}
                  onChange={(e) => {
                    setCampSubject(e.target.value);
                    setSendError("");
                  }}
                  placeholder="Ex. : Nouvelles de l'Église du Nazaréen de Damé & Horaires des cultes"
                  className={inputCls}
                />
              </Field>

              <Field label="Contenu du message" required hint="Séparez vos paragraphes par une ligne vide.">
                <textarea
                  rows={8}
                  value={campContent}
                  onChange={(e) => {
                    setCampContent(e.target.value);
                    setSendError("");
                  }}
                  placeholder="Rédigez ici le message pastoral ou les annonces aux fidèles…"
                  className={inputCls}
                />
              </Field>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <Field
                  label="Envoi de test (facultatif)"
                  hint="Saisissez une adresse e-mail pour tester le rendu avant d'envoyer à tous les abonnés."
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="email"
                      value={testEmail}
                      onChange={(e) => {
                        setTestEmail(e.target.value);
                        setSendError("");
                      }}
                      placeholder="exemple@domaine.com"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      disabled={sendingEmail}
                      onClick={() => handleDispatchCampaign("Test")}
                      className={`${btnGhost} shrink-0`}
                    >
                      <Icon name="mail" size={16} />
                      Envoyer un test
                    </button>
                  </div>
                </Field>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  disabled={sendingEmail}
                  onClick={() => handleDispatchCampaign("Draft")}
                  className={btnGhost}
                >
                  <Icon name="file" size={16} />
                  Enregistrer en brouillon
                </button>
                <button
                  type="button"
                  disabled={sendingEmail || activeSubscribersCount === 0}
                  onClick={() => handleDispatchCampaign("SendAll")}
                  className={btnPrimary}
                >
                  <Icon name="send" size={16} />
                  {sendingEmail
                    ? "Envoi en cours…"
                    : `Envoyer aux ${activeSubscribersCount} abonné(s) actif(s)`}
                </button>
              </div>
            </div>
          </div>

          {/* Aperçu en direct & Historique des campagnes */}
          <div className="space-y-6 lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#1B2A4A] px-5 py-4 text-center text-white" style={{ borderBottom: "3px solid #9A7B2F" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD_LIGHT }}>
                  Aperçu de l'e-mail · Sainteté à l’Éternel
                </p>
                <p className="es-serif mt-0.5 text-lg font-bold">{CHURCH}</p>
                <p className="text-[11px] text-slate-300">{PASTOR}</p>
              </div>
              <div className="p-5 text-sm text-slate-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9A7B2F]">
                  Objet : {campSubject.trim() || "—"}
                </p>
                <h4 className="es-serif mt-1 text-lg font-semibold text-[#1B2A4A]">
                  {campTitle.trim() || campSubject.trim() || "Titre de votre lettre pastorale"}
                </h4>
                <div className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700">
                  {campContent.trim() ||
                    "Le texte de votre message apparaîtra ici avec la mise en page officielle Bleu Marine (#1B2A4A) et Or (#9A7B2F) de l'Église du Nazaréen de Damé."}
                </div>
              </div>
            </div>

            <div className={`${cardCls} p-5`}>
              <h3 className="es-serif mb-3 text-lg font-semibold text-[#1B2A4A]">
                Historique des campagnes ({campaigns.length})
              </h3>
              {campaigns.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-500">
                  Aucune campagne enregistrée pour le moment.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100 text-sm">
                  {campaigns.slice(0, 8).map((c) => (
                    <li key={c.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge
                              className={
                                c.status === "Sent"
                                  ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                                  : "bg-amber-50 text-amber-900 ring-amber-300"
                              }
                            >
                              {c.status === "Sent" ? "Envoyée" : "Brouillon"}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {fmtDate((c.sentAt || c.createdAt).slice(0, 10))}
                            </span>
                          </div>
                          <p className="mt-1 truncate font-semibold text-[#1B2A4A]">{c.title}</p>
                          <p className="truncate text-xs text-slate-500">Objet : {c.subject}</p>
                          <p className="text-[11px] text-slate-400">Destinataires : {c.targetAudience}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCampTitle(c.title);
                            setCampSubject(c.subject);
                            setCampContent(c.content);
                            notify(`Campagne « ${c.title} » rechargée dans l'éditeur.`);
                          }}
                          className={btnGhost}
                        >
                          Réutiliser
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout d'un abonné */}
      {addSubModalOpen && (
        <Modal title="Inscrire un abonné à la Newsletter" onClose={() => setAddSubModalOpen(false)}>
          <form onSubmit={handleCreateSubscriber} className="space-y-4" noValidate>
            {newSubError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700" role="alert">
                {newSubError}
              </div>
            )}
            <Field label="Nom complet">
              <input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="Ex. : Frère Jean-Baptiste Pierre"
                className={inputCls}
              />
            </Field>
            <Field label="Adresse e-mail" required>
              <input
                type="email"
                required
                value={newSubEmail}
                onChange={(e) => {
                  setNewSubEmail(e.target.value);
                  setNewSubError("");
                }}
                placeholder="fidele@exemple.com"
                className={inputCls}
              />
            </Field>
            <Field label="Téléphone (facultatif)">
              <input
                type="tel"
                value={newSubPhone}
                onChange={(e) => setNewSubPhone(e.target.value)}
                placeholder="+509 …"
                className={inputCls}
              />
            </Field>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
              <button type="button" className={btnGhost} onClick={() => setAddSubModalOpen(false)}>
                Annuler
              </button>
              <button type="submit" disabled={submittingSubscriber} className={btnPrimary}>
                <Icon name="check" size={16} />
                {submittingSubscriber ? "Enregistrement…" : "Inscrire l'abonné"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {subToDelete && (
        <ConfirmDialog
          title="Retirer cet abonné de la newsletter ?"
          message={`L'adresse « ${subToDelete.email} » (${subToDelete.name}) ne recevra plus les envois de la paroisse.`}
          confirmLabel="Supprimer"
          onConfirm={handleDeleteSubscriber}
          onCancel={() => setSubToDelete(null)}
        />
      )}
    </div>
  );
}
