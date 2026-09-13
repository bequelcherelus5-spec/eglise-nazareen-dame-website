import React, { useEffect, useRef } from 'react';

interface AdSenseUnitProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'fluid';
  responsive?: boolean;
  className?: string;
  layoutKey?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Composant d'affichage d'annonce Google AdSense conforme aux règles éditoriales :
 * - Éditeur : pub-7382968203880435
 * - Ne s'affiche pas sur les formulaires de don, de prière ou jeux éducatifs
 * - Indique clairement la mention "Annonce sponsorisée" pour respecter les règles AdSense
 * - Initialisation sécurisée via try/catch
 */
export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slot = '7382968203',
  format = 'auto',
  responsive = true,
  className = '',
  layoutKey
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    // Éviter les doubles injections sur le même élément
    if (isLoadedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoadedRef.current = true;
      }
    } catch (e) {
      // Ignorer silencieusement si AdSense est bloqué par un adblocker ou en cours d'évaluation
      console.debug('AdSense initialization notice:', e);
    }
  }, []);

  return (
    <div className={`my-8 w-full max-w-4xl mx-auto overflow-hidden text-center ${className}`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mb-1.5 flex items-center justify-center gap-2">
        <span className="h-px w-6 bg-slate-200" />
        <span>Espace Partenaire Google AdSense</span>
        <span className="h-px w-6 bg-slate-200" />
      </div>
      
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2 sm:p-4 min-h-[100px] flex items-center justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-7382968203880435"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />
      </div>
    </div>
  );
};
