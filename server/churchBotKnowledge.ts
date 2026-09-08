/**
 * Knowledge Base and Assistant Logic for Église du Nazaréen de Damé
 */

export interface AssistantAnswer {
  reply: string;
  source: 'gemini' | 'knowledge_base';
  suggestions?: string[];
}

export const CHURCH_SYSTEM_PROMPT = `
Vous êtes le Guide & Assistant Virtuel officiel de l'Église du Nazaréen de Damé (Haïti).
Votre ton est chaleureux, bienveillant, respectueux, pastoral et encourageant (dans la tradition chrétienne protestante évangélique wesleyenne).

INFORMATIONS CLÉS SUR LE MINISTÈRE :
- Nom officiel : Église du Nazaréen de Damé
- Devise : « Sainteté à l’Éternel »
- Date de fondation : 23 décembre 1979 par le missionnaire Saurel ALCINÉ
- Dénomination : Église du Nazaréen internationale, District Bas Nord-Ouest d'Haïti
- Pasteur Principal : Pasteur Bequel CHERELUS (en fonction depuis 2003)
- Président du Conseil d'Église : Césaire FAUBLAS
- Membres : 500 à 700 membres actifs
- Localisation : Rue Cimetière, 3ème Section Rurale Damé, Commune de Môle-Saint-Nicolas, Département du Nord-Ouest, Haïti
- Contact : Téléphone (+509 48596089 / +509 38048227), Email (eglisedunazareendedame@gmail.com)

HORAIRES DES CULTES & RÉUNIONS :
- Dimanche 08h00 - 11h30 : Grand Culte d'Adoration, Célébration, Sainte Cène et Prédication
- Dimanche 16h00 - 17h30 : École du Dimanche pour tous (classes bibliques par tranche d'âge)
- Mercredi 18h00 - 19h30 : Étude Biblique Approfondie et doctrine
- Vendredi 18h00 - 19h45 : Réunion de Prière & Intercession communautaire
- Samedi 15h00 - 17h00 : Rassemblement de la Jeunesse (JNI) et répétitions de chorales

LES MINISTÈRES & DÉPARTEMENTS :
1. JNI (Jeunesse Nazaréenne Internationale) : Formation spirituelle, camps bibliques, leadership des jeunes
2. MNI (Missions Nazaréennes Internationales) : Évangélisation, soutien aux missionnaires et actions humanitaires
3. CDEJ HA-168 : Centre de Développement de l'Enfant et des Jeunes, partenariat stratégique avec Compassion International parrainant plus de 250 enfants (soutien nutritionnel, médical, scolaire et spirituel)
4. Chorales : Chœur d'Hommes, Flambeau de la Sainteté, Écho Céleste, Groupe de Louange
5. Ministère Féminin & Hommes Nazaréens

PÔLE ÉDUCATIF :
1. École Fondamentale Nazareth (fondée en 1985) : Enseignement fondamental complet de la 1ère à la 9ème Année Fondamentale (AF), section jeux éducatifs et plateforme de préparation aux examens officiels d'État (MENFP).
2. École Professionnelle EPND (fondée en 2022) : Formations professionnelles pratiques en Couture, Maçonnerie, Musique instrumentale et Anglais pratique.

SOUTIEN, PRIÈRES & DONS :
- Tout fidèle peut soumettre une demande de prière ou une demande de document d'état ecclésiastique (baptême, mariage, adhésion) directement sur le site.
- Les dons et dîmes peuvent être transmis par MonCash (+509 48596089) ou virement.

CONSIGNES DE RÉPONSE :
- Répondez avec précision, concision et politesse en français (ou en créole haïtien si l'utilisateur s'adresse en créole).
- Ajoutez des encouragements bibliques appropriés si la question concerne la foi ou la prière.
- Si une question dépasse vos connaissances, invitez cordialement la personne à contacter le secrétariat au +509 48596089 ou à eglisedunazareendedame@gmail.com.
`;

export function getLocalAssistantReply(userQuestion: string): AssistantAnswer {
  const q = userQuestion.toLowerCase().trim();

  // Horaires des cultes
  if (q.includes('heure') || q.includes('horaire') || q.includes('culte') || q.includes('dimanche') || q.includes('service') || q.includes('reunion') || q.includes('rassemblement')) {
    return {
      reply: `Voici les horaires des cultes et activités spirituelles à l'Église du Nazaréen de Damé :

• **Dimanche (08h00 - 11h30)** : Culte d'Adoration & Célébration (Louange, Sainte Cène, Prédication de la Parole).
• **Dimanche (16h00 - 17h30)** : École du Dimanche pour tous (classes d'édification par tranche d'âge).
• **Mercredi (18h00 - 19h30)** : Étude Biblique approfondie et affermissement doctrinal.
• **Vendredi (18h00 - 19h45)** : Soirée de Prière, Intercession et combat spirituel.
• **Samedi (15h00 - 17h00)** : Rassemblement de la Jeunesse (JNI) et répétition des chorales.

Vous êtes chaleureusement invité à vous joindre à nous ! « Je suis dans la joie quand on me dit : Allons à la maison de l'Éternel ! » (Psaume 122:1).`,
      source: 'knowledge_base',
      suggestions: ['Où se trouve l’Église ?', 'Qui est le Pasteur ?', 'Parlez-moi des ministères']
    };
  }

  // Pasteur & Dirigeants
  if (q.includes('pasteur') || q.includes('bequel') || q.includes('cherelus') || q.includes('dirigeant') || q.includes('leader') || q.includes('conseil') || q.includes('faublas')) {
    return {
      reply: `Le pasteur principal de l'Église du Nazaréen de Damé est le **Pasteur Bequel CHERELUS**, en fonction depuis **2003**.

Sous sa conduite pastorale, l'assemblée s'est développée pour rassembler entre **500 et 700 membres actifs**, avec un ancrage spirituel fort et des réalisations sociales majeures :
• Création du partenariat **CDEJ HA-168 avec Compassion International**
• Fondation de l'**École Professionnelle EPND en 2022**
• Consolidation de l'**École Fondamentale Nazareth**
• Programme d'autonomisation économique (élevage caprin en partenariat avec la Fondation Digicel)

Le Conseil d'Église est présidé par **M. Césaire FAUBLAS**, qui veille avec l'équipe pastorale à la bonne marche de la communauté.`,
      source: 'knowledge_base',
      suggestions: ['Quels sont les cultes ?', 'Parlez-moi de l’École EPND', 'Contacter le secrétariat']
    };
  }

  // Histoire & Origines
  if (q.includes('histoire') || q.includes('fondateur') || q.includes('saurel') || q.includes('alcine') || q.includes('origine') || q.includes('creation') || q.includes('1979') || q.includes('date')) {
    return {
      reply: `L'Église du Nazaréen de Damé a été fondée le **23 décembre 1979** par le missionnaire pionnier **Saurel ALCINÉ**.

Elle est la première œuvre évangélique établie dans la 3ème Section Rurale de Damé (Commune de Môle-Saint-Nicolas).
• **1979** : Première assemblée sous une simple tonnelle de foi.
• **1985** : Création de l'École Fondamentale Nazareth.
• **2003** : Arrivée du Pasteur Bequel CHERELUS et développement communautaire.
• **2019** : Implantation du CDEJ HA-168 (Compassion International).
• **2022** : Inauguration de l'École Professionnelle EPND.

La devise immuable de notre église est : **« Sainteté à l’Éternel »** !`,
      source: 'knowledge_base',
      suggestions: ['Quels sont les ministères ?', 'École Nazareth', 'Horaires des cultes']
    };
  }

  // Ministères & Départements (JNI, MNI, CDEJ, Chorales)
  if (q.includes('ministere') || q.includes('jni') || q.includes('jeunesse') || q.includes('mni') || q.includes('cdej') || q.includes('compassion') || q.includes('chorale') || q.includes('femme') || q.includes('homme')) {
    return {
      reply: `L'Église du Nazaréen de Damé anime plusieurs ministères dynamiques :

1. **JNI (Jeunesse Nazaréenne Internationale)** : Rassemblement des jeunes le samedi à 15h00 pour la louange, l'étude biblique et des activités sportives et récréatives.
2. **CDEJ HA-168 (Centre de Développement de l'Enfant et des Jeunes)** : En partenariat avec Compassion International, encadre plus de **250 enfants parrainés** (santé, scolarité, nutrition, formation biblique).
3. **MNI (Missions Nazaréennes Internationales)** : Mobilise l'assemblée pour l'évangélisation locale et le soutien aux missionnaires à travers le monde.
4. **Département Musical & Chorales** : Le Chœur d'Hommes, le groupe Flambeau de la Sainteté et la chorale Écho Céleste.
5. **Ministères Féminin & Masculin** : Encadrement des couples, soutien aux veuves et renforcement de la vie familiale.`,
      source: 'knowledge_base',
      suggestions: ['Comment s’inscrire à la JNI ?', 'École Nazareth & EPND', 'Faire un don ou dîme']
    };
  }

  // Éducation : École Fondamentale Nazareth & EPND & Jeux éducatifs & Examens
  if (q.includes('ecole') || q.includes('nazareth') || q.includes('epnd') || q.includes('formation') || q.includes('fondamentale') || q.includes('examen') || q.includes('jeu') || q.includes('couture') || q.includes('maconnerie') || q.includes('musique') || q.includes('anglais')) {
    return {
      reply: `Le pôle éducatif de l'Église du Nazaréen de Damé repose sur deux piliers majeurs :

1. **École Fondamentale Nazareth (fondée en 1985)** :
• Accueille les élèves de la **1ère à la 9ème Année Fondamentale (AF)**.
• Nouveau : Section **Jeux Éducatifs interactifs** par classe (Maths, Français, Sciences, Histoire d'Haïti).
• Nouveau : **Plateforme de Préparation aux Examens d'État (MENFP)** avec simulateurs d'examens blancs, fiches de révision et corrigés détaillés.

2. **École Professionnelle Nazaréen de Damé (EPND - 2022)** :
• **Couture & Stylisme** (12 mois)
• **Maçonnerie & Génie Civil pratique** (12 mois)
• **Musique & Instruments** (Guitare, Clavier, Harmonie - 6 mois)
• **Anglais Professionnel & Communication** (9 mois)

Vous pouvez explorer la section « Éducation » sur le site pour essayer les jeux éducatifs ou postuler à une formation EPND !`,
      source: 'knowledge_base',
      suggestions: ['Accéder aux jeux éducatifs', 'Préparer l’examen de 9ème AF', 'Postuler à l’EPND']
    };
  }

  // Localisation, Adresse & Contact
  if (q.includes('adresse') || q.includes('ou') || q.includes('trouver') || q.includes('localisation') || q.includes('contact') || q.includes('telephone') || q.includes('email') || q.includes('situ')) {
    return {
      reply: `Voici comment nous localiser et nous joindre :

📍 **Adresse physique :**
Rue Cimetière, 3ème Section Rurale Damé
Commune de Môle-Saint-Nicolas, Département du Nord-Ouest, République d'Haïti.

📞 **Téléphone :** +509 48596089 / +509 38048227
✉️ **Email officiel :** eglisedunazareendedame@gmail.com
🌐 **Site Web :** www.eglisedunazareendedame.org

Le secrétariat paroissial est ouvert du lundi au vendredi de 8h00 à 16h00.`,
      source: 'knowledge_base',
      suggestions: ['Quels sont les cultes ?', 'Demander une prière', 'Faire un don']
    };
  }

  // Prière & Intercession
  if (q.includes('priere') || q.includes('intercession') || q.includes('demande') || q.includes('malade') || q.includes('combat') || q.includes('souci') || q.includes('benediction')) {
    return {
      reply: `Nous croyons fermement en la puissance de la prière exaucée au nom de Jésus-Christ !

« Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. » (Philippiens 4:6)

Vous pouvez :
1. Déposer votre sujet de prière sur la page **« Demande de Prière »** de ce site (texte ou message vocal).
2. Nous rejoindre le **vendredi soir de 18h00 à 19h45** pour le service de prière et d'intercession à l'église.
3. Notre cellule pastorale prie quotidiennement pour chaque requête déposée en toute confidentialité.

Que la paix et la grâce du Seigneur reposent sur vous !`,
      source: 'knowledge_base',
      suggestions: ['Déposer une prière', 'Horaires des cultes', 'Contacter le Pasteur']
    };
  }

  // Dons, Offrandes & MonCash
  if (q.includes('don') || q.includes('offrande') || q.includes('dime') || q.includes('moncash') || q.includes('zelle') || q.includes('soutenir') || q.includes('contribuer')) {
    return {
      reply: `Votre générosité soutient activement l'évangélisation, l'encadrement des enfants du CDEJ, l'École Nazareth et les travaux communautaires de Damé.

Options de contribution sécurisées :
• **MonCash (Haïti) :** +509 48596089 (Titulaire : Secrétariat Paroissial Damé)
• **Zelle & Virements internationaux :** Disponibles via le bouton « Faire un Don » sur la plateforme ou en contactant le secrétariat : \`eglisedunazareendedame@gmail.com\`

« Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie. » (2 Corinthiens 9:7). Que le Seigneur vous bénisse abondamment !`,
      source: 'knowledge_base',
      suggestions: ['Projets sociaux soutenus', 'École Nazareth', 'Horaires des cultes']
    };
  }

  // Salutations et politesse
  if (q.includes('bonjour') || q.includes('bonsoir') || q.includes('salut') || q.includes('sak pase') || q.includes('halo') || q.includes('hello') || q.includes('merci') || q.includes('amen')) {
    return {
      reply: `La paix et la grâce du Seigneur Jésus-Christ soient avec vous ! Soyez le bienvenu sur la plateforme de l'Église du Nazaréen de Damé.

Je suis votre assistant virtuel paroissial. Comment puis-je vous renseigner aujourd'hui ?
• Connaître les horaires des cultes et activités
• Découvrir l'histoire de l'Église et le Pasteur Bequel CHERELUS
• Découvrir l'École Fondamentale Nazareth, les jeux éducatifs et la préparation aux examens
• En savoir plus sur l'École Professionnelle EPND et les ministères
• Soumettre une requête de prière ou contacter le secrétariat`,
      source: 'knowledge_base',
      suggestions: ['Horaires des cultes', 'École Nazareth & Jeux', 'Histoire de l’Église', 'Contacter le secrétariat']
    };
  }

  // Réponse par défaut chaleureuse et guidée
  return {
    reply: `Merci pour votre message. En tant qu'assistant de l'Église du Nazaréen de Damé (« Sainteté à l'Éternel »), je suis à votre disposition pour vous renseigner sur la paroisse, notre pasteur Bequel CHERELUS, les cultes d'adoration, l'école Nazareth (1ère à 9ème AF avec jeux éducatifs et préparation aux examens), l'école technique EPND, la jeunesse JNI et le centre d'enfants CDEJ.

Pour une assistance personnalisée directe, vous pouvez également appeler notre secrétariat paroissial au **+509 48596089** ou écrire à **eglisedunazareendedame@gmail.com**.`,
    source: 'knowledge_base',
    suggestions: ['Horaires des cultes', 'École Nazareth & Examens', 'Qui est le Pasteur ?', 'Demande de prière']
  };
}
