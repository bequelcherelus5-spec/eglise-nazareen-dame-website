import logoImg from '../assets/images/regenerated_image_1788797095916.jpg';
import comiteHeicImg from '../assets/images/regenerated_image_1788672235113.heic';
import comiteJpgImg from '../assets/images/regenerated_image_1788672235113.jpg';
import ecoleFacadeImg from '../assets/images/regenerated_image_1788672240292.jpg';
import courPaysageImg from '../assets/images/regenerated_image_1788694516488.png';
import courPaysageFallbackImg from '../assets/images/cour_paysage.jpg';

export interface ChurchRealImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  location: string;
  badge: string;
  candidates?: string[];
}

export const CHURCH_ASSETS = {
  logo: {
    id: 'church-official-logo',
    src: logoImg,
    alt: "Sceau et Logo officiel de l'Église du Nazaréen de Damé - Sainteté à l'Éternel",
    title: "Sceau Officiel de l'Église du Nazaréen de Damé",
    caption: "Emblème historique avec la colombe de l'Esprit Saint, les Saintes Écritures et la devise sacrée : « Sainteté à l'Éternel ».",
    location: "Damé, Môle-Saint-Nicolas, Haïti",
    badge: "Identité Officielle",
    candidates: ['/images/logo.png', '/images/logo.jpg', '/images/logo.svg', '/images/unnamed.jpg'],
  },
  comite: {
    id: 'church-committee-direction',
    src: comiteJpgImg,
    alt: "Direction de l'École Nazareth de Fond Damé et Comité de l'Église du Nazaréen de Damé",
    title: "Direction de l'École Nazareth & Comité de l'Église",
    caption: "Le corps pastoral, la direction académique et les membres dévoués du comité de l'Église du Nazaréen de Damé réunis devant l'établissement.",
    location: "Fond Damé, Rue Cimetière",
    badge: "Leadership & Éducation",
    candidates: [comiteHeicImg, '/images/comite.jpg', '/images/20260802_114944.jpg', '/images/comite.png'],
  },
  ecoleFacade: {
    id: 'ecole-nazareth-facade',
    src: ecoleFacadeImg,
    alt: "Façade de l'École Nazareth de Fond Damé",
    title: "École Nazareth de Fond Damé",
    caption: "Bâtiment scolaire accueillant les enfants du préscolaire à la 9ème année fondamentale. Devise : « Préparer l'enfant à devenir un adulte responsable et équilibré car l'éducation est l'arme la plus puissante qu'on puisse utiliser pour sauver le monde ».",
    location: "Rue Cimetière, 3ème Section Damé, Môle-Saint-Nicolas",
    badge: "Complexe Éducatif",
    candidates: ['/images/ecole_facade.jpg', '/images/ecole_facade.png', '/images/Snapchat-723350182.jpg'],
  },
  courPaysage: {
    id: 'cour-paysage-dame',
    src: courPaysageImg,
    alt: "Paysage de la cour et enceinte de l'Église et École à Fond Damé",
    title: "La Cour & l'Enceinte Communautaire",
    caption: "L'espace extérieur, la cour paysagère, la végétation et le cadre paisible où grandit notre jeunesse et se rassemblent les croyants.",
    location: "Fond Damé, Haïti",
    badge: "Cadre de Vie & Foi",
    candidates: ['/images/cour_paysage.png', '/images/cour_paysage.jpg', courPaysageFallbackImg, '/images/Snapchat-1846211928.jpg'],
  },
} as const;
