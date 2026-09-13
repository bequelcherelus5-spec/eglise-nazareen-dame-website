import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Maximize2, 
  Compass, 
  ExternalLink, 
  Church, 
  Info,
  RotateCcw
} from 'lucide-react';

// Coordonnées géographiques précises de Damé (3ème Section de Môle-Saint-Nicolas, Nord-Ouest, Haïti)
export const DAME_CHURCH_COORDS = {
  lat: 19.8052,
  lng: -73.3854,
  zoom: 15,
  name: "Église du Nazaréen de Damé",
  address: "Rue Cimetière, 3ème Section Damé, Commune de Môle-Saint-Nicolas, Département du Nord-Ouest, Haïti"
};

// Coordonnées de la commune de Môle-Saint-Nicolas pour le recul cartographique
const MOLE_ST_NICOLAS_COORDS = {
  lat: 19.8040,
  lng: -73.3760,
  zoom: 12
};

export const ChurchLeafletMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [activeLayer, setActiveLayer] = useState<'osm' | 'topo'>('osm');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Si une instance existe déjà, la nettoyer
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // 1. Initialisation de la carte Leaflet
    const map = L.map(mapContainerRef.current, {
      center: [DAME_CHURCH_COORDS.lat, DAME_CHURCH_COORDS.lng],
      zoom: DAME_CHURCH_COORDS.zoom,
      zoomControl: false, // On ajoute un contrôle personnalisé plus esthétique
      attributionControl: true
    });

    // 2. Tuiles de base OpenStreetMap
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
    });
    osmLayer.addTo(map);

    // 3. Contrôle de zoom en haut à droite
    L.control.zoom({ position: 'topright' }).addTo(map);

    // 4. Création d'une épingle personnalisée (DivIcon SVG) pour éviter tout bug d'icône PNG Leaflet
    const customChurchIcon = L.divIcon({
      className: 'custom-church-leaflet-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background: linear-gradient(135deg, #0F2C59 0%, #081B36 100%); border: 2.5px solid #D4AF37; border-radius: 9999px; padding: 7px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/>
              <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
              <path d="M18 22V5l-6-3-6 3v17"/>
              <path d="M12 7v5"/>
              <path d="M10 9h4"/>
            </svg>
          </div>
          <div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 9px solid #D4AF37; margin-top: -1px;"></div>
          <div style="width: 10px; height: 4px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1px); margin-top: 2px;"></div>
        </div>
      `,
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -48]
    });

    // 5. Création du marqueur
    const marker = L.marker([DAME_CHURCH_COORDS.lat, DAME_CHURCH_COORDS.lng], {
      icon: customChurchIcon,
      title: DAME_CHURCH_COORDS.name
    }).addTo(map);

    // 6. Contenu du Popup interactif
    const popupContent = `
      <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; min-width: 230px; padding: 4px 2px;">
        <div style="display: inline-block; background-color: #0F2C59; color: #D4AF37; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 9999px; margin-bottom: 6px;">
          Sanctuaire Officiel
        </div>
        <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #0F2C59; line-height: 1.3;">
          Église du Nazaréen de Damé
        </h4>
        <p style="margin: 4px 0 8px 0; font-size: 11px; color: #475569; line-height: 1.4;">
          Rue Cimetière, 3ème Section Damé<br/>
          Commune de Môle-Saint-Nicolas (Haïti)
        </p>
        <div style="background-color: #f8fafc; border-left: 3px solid #D4AF37; padding: 5px 8px; font-size: 10px; color: #334155; margin-bottom: 8px;">
          <strong>Cultes :</strong> Dimanche 08h00 &amp; Mercredi 17h00<br/>
          <strong>Écoles :</strong> Nazareth &amp; EPND
        </div>
        <a 
          href="https://www.google.com/maps/search/?api=1&query=${DAME_CHURCH_COORDS.lat},${DAME_CHURCH_COORDS.lng}" 
          target="_blank" 
          rel="noopener noreferrer"
          style="display: inline-flex; align-items: center; justify-content: center; width: 100%; gap: 6px; background-color: #0F2C59; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 10px; border-radius: 8px; text-decoration: none; text-align: center;"
        >
          Ouvrir dans Google Maps (GPS)
        </a>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 300 });

    // Ouvrir le popup après un court délai pour guider le visiteur
    setTimeout(() => {
      marker.openPopup();
    }, 600);

    mapInstanceRef.current = map;
    markerRef.current = marker;
    setMapReady(true);

    // Ajuster la taille en cas de redimensionnement de conteneur
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Action: Recentrer sur le sanctuaire à Damé
  const handleRecenterDame = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(
      [DAME_CHURCH_COORDS.lat, DAME_CHURCH_COORDS.lng],
      DAME_CHURCH_COORDS.zoom,
      { animate: true }
    );
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  };

  // Action: Vue panoramique de la commune de Môle-Saint-Nicolas
  const handleViewMole = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(
      [MOLE_ST_NICOLAS_COORDS.lat, MOLE_ST_NICOLAS_COORDS.lng],
      MOLE_ST_NICOLAS_COORDS.zoom,
      { animate: true }
    );
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${DAME_CHURCH_COORDS.lat},${DAME_CHURCH_COORDS.lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${DAME_CHURCH_COORDS.lat}&mlon=${DAME_CHURCH_COORDS.lng}#map=15/${DAME_CHURCH_COORDS.lat}/${DAME_CHURCH_COORDS.lng}`;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-lg">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#081B36] via-[#0F2C59] to-[#173B75] text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Compass className="h-5 w-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                Carte Interactive Leaflet
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h4 className="text-sm sm:text-base font-bold font-display text-white">
              Localisation Précise : Damé, Môle-Saint-Nicolas
            </h4>
          </div>
        </div>

        {/* Boutons d'action rapide */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecenterDame}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/15 transition-all"
            title="Recentrer sur l'Église de Damé"
          >
            <Church className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span className="hidden sm:inline">Sanctuaire</span>
          </button>

          <button
            type="button"
            onClick={handleViewMole}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/15 transition-all"
            title="Vue d'ensemble Môle-Saint-Nicolas"
          >
            <RotateCcw className="h-3.5 w-3.5 text-sky-300" />
            <span className="hidden sm:inline">Commune</span>
          </button>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-[#D4AF37] hover:bg-[#B38E22] text-[#0F2C59] px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
          >
            <span>Itinéraire</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Conteneur Leaflet */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-100">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-10" 
          id="church-interactive-leaflet-map"
        />

        {/* Badge flottant des coordonnées géographiques */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
          <div className="rounded-xl bg-[#081B36]/85 backdrop-blur-md px-3 py-1.5 text-[11px] text-white border border-white/20 shadow-md flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
            <span>GPS : <strong>19.8052° N, 73.3854° W</strong></span>
          </div>
        </div>
      </div>

      {/* Panneau informatif inférieur */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 max-w-xl">
          <MapPin className="h-4 w-4 text-[#0F2C59] shrink-0" />
          <span>
            <strong>Adresse :</strong> Rue Cimetière, 3ème Section Damé, Commune de Môle-Saint-Nicolas, Nord-Ouest, Haïti.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={osmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-[#0F2C59] hover:underline inline-flex items-center gap-1 font-medium"
          >
            <span>Ouvrir sur OpenStreetMap</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
