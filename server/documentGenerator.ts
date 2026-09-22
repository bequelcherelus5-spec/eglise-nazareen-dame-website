import { GoogleGenAI } from '@google/genai';
import { EcclesiasticalDocumentType, GeneratedDocumentData } from '../src/types';

export interface DocumentGenerationRequest {
  documentType: EcclesiasticalDocumentType;
  recipientName: string;
  recipientRole?: string;
  parishionerDetails?: string;
  issueDate?: string;
  place?: string;
  additionalNotes?: string;
  baptismDate?: string;
  recommendingPastor?: string;
  destinationChurch?: string;
  eventDate?: string;
}

const DOCUMENT_TITLES: Record<EcclesiasticalDocumentType, string> = {
  recommandation: 'LETTRE DE RECOMMANDATION PASTORALE',
  bapteme: 'CERTIFICAT OFFICIEL DE BAPTÊME CHRÉTIEN',
  membre: 'ATTESTATION OFFICIELLE DE MEMBRE ET DE COMMUNION',
  invitation: 'LETTRE D’INVITATION OFFICIELLE / MINISTÈRE DE LA PAROLE',
  benevolat: 'ATTESTATION DE DÉVOUEMENT & SERVICE BÉNÉVOLE'
};

const BIBLICAL_VERSES: Record<EcclesiasticalDocumentType, string> = {
  recommandation: '« Je vous recommande Phœbé, notre sœur, qui est diaconesse de l’Église de Cenchrées, afin que vous la receviez dans le Seigneur d’une manière digne des saints... » — Romains 16:1-2',
  bapteme: '« Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit... » — Matthieu 28:19',
  membre: '« Car nous avons tous été baptisés dans un seul Esprit, pour former un seul corps, soit Juifs, soit Grecs, soit esclaves, soit libres... » — 1 Corinthiens 12:13',
  invitation: '« Qu’ils sont beaux sur les montagnes, les pieds de celui qui apporte de bonnes nouvelles, qui publie la paix... » — Ésaïe 52:7',
  benevolat: '« Chacun de vous a reçu un don particulier : mettez-le au service des autres, comme de bons dispensateurs des diverses grâces de Dieu. » — 1 Pierre 4:10'
};

export async function generateEcclesiasticalDocument(
  req: DocumentGenerationRequest,
  geminiClient: GoogleGenAI | null
): Promise<GeneratedDocumentData> {
  const docType = req.documentType || 'recommandation';
  const recipientName = req.recipientName.trim();
  const issueDate = req.issueDate || new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const place = req.place || 'Damé, Môle-Saint-Nicolas (Haïti)';
  const pastorName = 'Pasteur Bequel CHERELUS';
  const churchName = 'Église du Nazaréen de Damé';
  const referenceNumber = `END-${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
  const title = DOCUMENT_TITLES[docType] || 'DOCUMENT OFFICIEL DE L’ÉGLISE';
  const biblicalVerse = BIBLICAL_VERSES[docType];

  // Tentative de génération via Gemini 3.8 Flash si disponible
  if (geminiClient) {
    try {
      const prompt = `Rédige le corps textuel officiel d'un document ecclésiastique pour l'Église du Nazaréen de Damé (Haïti).
District : District Bas Nord-Ouest d'Haïti
Devise sacrée de l'Église : « Sainteté à l'Éternel »
Pasteur Principal : Pasteur Bequel CHERELUS
Type de document : ${title}
Destinataire / Bénéficiaire : ${recipientName}
Rôle ou qualité : ${req.recipientRole || 'Fidèle et serviteur de Dieu'}
Détails ecclésiastiques : ${req.parishionerDetails || 'Membre actif, pieux et exemplaire'}
Date d'émission : ${issueDate}
Lieu : ${place}
Notes ou précisions pastorales : ${req.additionalNotes || 'Néant'}
${req.baptismDate ? `Date de baptême : ${req.baptismDate}` : ''}
${req.destinationChurch ? `Église ou autorité réceptrice : ${req.destinationChurch}` : ''}
${req.eventDate ? `Date de l'événement ou culte : ${req.eventDate}` : ''}

Consignes impératives :
1. Style solennel, chaleureux, profondément chrétien et fidèle à la théologie wesleyenne/nazaréenne de la sanctification.
2. Formuler 3 à 4 paragraphes complets bien ordonnés et élégants.
3. Ne pas ajouter de titres Markdown superflus (pas de # ou ##), uniquement le corps de texte rédigé avec des sauts de ligne entre paragraphes.
4. Reste bienveillant, officiel et directement utilisable pour une impression administrative formelle.`;

      const response = await geminiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Tu es le Secrétaire Général et Rédacteur Théologique de l’Église du Nazaréen de Damé en Haïti. Tu rédiges avec une éloquence spirituelle, clarté administrative et respect chrétien.',
          temperature: 0.5
        }
      });

      const generatedText = response.text?.trim();
      if (generatedText && generatedText.length > 80) {
        return {
          documentType: docType,
          title,
          recipientName,
          recipientRole: req.recipientRole || 'Membre régulier',
          parishionerDetails: req.parishionerDetails,
          churchName,
          pastorName,
          issueDate,
          place,
          bodyContent: generatedText,
          biblicalVerse,
          referenceNumber
        };
      }
    } catch (err) {
      console.warn('Gemini doc generation error, falling back to ecclesiastical templates:', err);
    }
  }

  // Fallback théologique garanti de très haute qualité
  let bodyContent = '';

  switch (docType) {
    case 'recommandation':
      bodyContent = `Au nom de notre Seigneur et Sauveur Jésus-Christ, que la grâce, la paix et la bénédiction divine vous soient multipliées.

Par la présente lettre officielle, le Corps Pastoral et le Conseil d’Administration de l’Église du Nazaréen de Damé (District Bas Nord-Ouest d'Haïti) ont le privilège fraternel de vous recommander chaleureusement notre frère/sœur en Christ, ${recipientName}${req.recipientRole ? `, qui sert fidèlement au sein de notre communauté en qualité de ${req.recipientRole}` : ''}.

Durant toutes ses années de communion fraternelle parmi nous, ${recipientName} a constamment manifesté une foi vivante, une conduite morale irréprochable et un profond attachement aux Saintes Écritures, marchant fidèlement selon la devise sacrée de notre assemblée : « Sainteté à l’Éternel ». Sa loyauté envers l’œuvre de Dieu et son dévouement envers ses frères et sœurs ont été une source continuelle d’édification pour notre assemblée locale.

Nous sollicitons de votre bienveillance fraternelle de bien vouloir ${req.destinationChurch ? `l’accueillir au sein de ${req.destinationChurch}` : 'l’accueillir avec amour chrétien'}, lui accorder toute l’assistance spirituelle et matérielle requise, et lui offrir un cadre propice à l’épanouissement de ses dons spirituels. Nous prions que le Tout-Puissant couronne sa mission et ses projets de succès durables.`;
      break;

    case 'bapteme':
      bodyContent = `« Il y a un seul Seigneur, une seule foi, un seul baptême, un seul Dieu et Père de tous... » (Éphésiens 4:5-6).

Le Conseil Pastoral de l'Église du Nazaréen de Damé atteste et certifie solennellement que ${recipientName} a publiquement confessé Jésus-Christ comme son Sauveur personnel et Seigneur souverain, et a reçu le Saint Baptême par immersion d'eau ${req.baptismDate ? `le ${req.baptismDate}` : 'selon l’ordonnance biblique et la discipline de l’Église du Nazaréen'}.

Ce baptême a été administré en présence de la communauté des croyants, au nom du Père, du Fils et du Saint-Esprit, consacrant son entrée dans le corps de Christ et son engagement solennel à mener une vie sainte, persévérante et obéissante à la Parole de Dieu.

En foi de quoi, ce présent certificat officiel est délivré à l’intéressé(e) pour servir et valoir ce que de droit devant Dieu, les hommes et les autorités ecclésiales.`;
      break;

    case 'membre':
      bodyContent = `Le Secrétariat Paroissial et le Conseil de l’Église du Nazaréen de Damé certifient par la présente que :

${recipientName} est membre régulier, actif et en pleine communion fraternelle au sein de notre assemblée locale située à la Rue Cimetière, 3ème section rurale de Damé, Commune de Môle-Saint-Nicolas, Département du Nord-Ouest d’Haïti.

Régulièrement inscrit(e) sur le registre paroissial sous le matricule officiel ${referenceNumber}, il/elle participe assidûment aux saints cultes, à l'École du Dimanche et aux activités de service communautaire. Sa vie témoigne de la puissance transformatrice de l’Évangile et de son obéissance aux préceptes nazaréens de sainteté et de charité chrétienne.

La présente attestation lui est accordée sur sa demande pour les démarches administratives, spirituelles ou académiques nécessaires.`;
      break;

    case 'invitation':
      bodyContent = `Que la grâce et la miséricorde de notre Dieu Créateur reposent abondamment sur vous et sur l'ensemble de votre ministère.

Le Pasteur Principal Bequel CHERELUS, les officiers et l’ensemble de la congrégation de l’Église du Nazaréen de Damé ont l’honneur insigne de vous adresser cette invitation fraternelle et solennelle, vous conviant à venir partager la sainte Parole de Dieu parmi nous ${req.eventDate ? `à l'occasion du grand rassemblement prévu le ${req.eventDate}` : 'lors de nos prochains services d’édification et de réveil'}.

Notre assemblée locale, rassemblant plusieurs centaines de croyants désireux de s'abreuver aux sources pures de la vérité divine, sera immensément fortifiée par le message d'espérance, de conversion et de sanctification que l'Esprit de Dieu déposera sur votre cœur.

Dans l’attente joyeuse de vous recevoir avec les honneurs fraternels dus aux serviteurs du Très-Haut dans notre sanctuaire de Damé, veuillez agréer, serviteur de Dieu, l'expression de nos prières continuelles et de notre communion en Christ.`;
      break;

    case 'benevolat':
    default:
      bodyContent = `L’Église du Nazaréen de Damé tient à honorer et à saluer avec une profonde gratitude chrétienne le dévouement désintéressé et l'engagement remarquable de ${recipientName}.

En tant que bénévole et serviteur zélé au sein de nos ministères paroissiaux, ${recipientName} a consacré sans réserve son temps, son énergie et ses compétences au service de ses semblables, contribuant avec excellence aux programmes d'éducation, de secours communautaire et d'encadrement de la jeunesse.

Cette attestation de service bénévole et de dévouement chrétien lui est délivrée en témoignage d'estime, d'affection fraternelle et de reconnaissance officielle pour ses nobles accomplissements au sein de notre collectivité.`;
      break;
  }

  return {
    documentType: docType,
    title,
    recipientName,
    recipientRole: req.recipientRole || 'Membre de l’Église',
    parishionerDetails: req.parishionerDetails,
    churchName,
    pastorName,
    issueDate,
    place,
    bodyContent,
    biblicalVerse,
    referenceNumber
  };
}
