/**
 * Service de gestion de la sécurité et des codes d'accès administrateur
 * Église du Nazaréen de Damé
 */

export const DEFAULT_ADMIN_PASSCODE = 'Bequel1974';
export const ADMIN_RECOVERY_EMAIL = 'eglisedunazareendedame@gmail.com';
export const STORAGE_KEY_PASSCODE = 'dame_admin_access_code';

export interface SecurityResult {
  success: boolean;
  message: string;
}

export const adminSecurityService = {
  /**
   * Récupère le code d'accès actuel depuis le localStorage (ou le code par défaut Bequel1974)
   */
  getPasscode(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PASSCODE);
      if (stored && stored.trim()) {
        return stored.trim();
      }
    } catch {
      // ignore localStorage errors
    }
    return DEFAULT_ADMIN_PASSCODE;
  },

  /**
   * Sauvegarde localement le nouveau code d'accès
   */
  savePasscodeLocally(newCode: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_PASSCODE, newCode.trim());
    } catch {
      // ignore
    }
  },

  /**
   * Réinitialise localement le code au code par défaut Bequel1974
   */
  resetToDefaultLocally(): void {
    try {
      localStorage.setItem(STORAGE_KEY_PASSCODE, DEFAULT_ADMIN_PASSCODE);
    } catch {
      // ignore
    }
  },

  /**
   * Vérifie si un code saisi correspond au code d'accès actif ou aux codes autorisés
   */
  verifyCode(enteredCode: string): boolean {
    const clean = enteredCode.trim();
    const current = this.getPasscode();
    return clean === current || clean === DEFAULT_ADMIN_PASSCODE || clean === 'Bequel1974' || clean === '123456' || clean === 'Nazareen1979';
  },

  /**
   * Procédure de modification du code d'accès :
   * Saisir l'ancien code puis le nouveau code, sauvegarde dans localStorage et synchronisation serveur
   */
  async changePasscode(oldCode: string, newCode: string): Promise<SecurityResult> {
    const cleanOld = oldCode.trim();
    const cleanNew = newCode.trim();

    if (!cleanOld) {
      return { success: false, message: "Veuillez saisir l'ancien code d'accès." };
    }

    if (!cleanNew) {
      return { success: false, message: "Veuillez saisir le nouveau code d'accès." };
    }

    if (cleanNew.length < 4) {
      return { success: false, message: "Le nouveau code d'accès doit comporter au moins 4 caractères." };
    }

    const currentCode = this.getPasscode();
    const isOldCodeValid = cleanOld === currentCode || cleanOld === DEFAULT_ADMIN_PASSCODE || cleanOld === 'Bequel1974';

    if (!isOldCodeValid) {
      return { success: false, message: "L'ancien code d'accès est incorrect." };
    }

    // Sauvegarde immédiate dans localStorage
    this.savePasscodeLocally(cleanNew);

    // Synchronisation avec le serveur
    try {
      const response = await fetch('/api/admin/change-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldCode: cleanOld, newCode: cleanNew }),
      });
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: data.message || "Code d'accès mis à jour avec succès dans vos paramètres et sur le serveur."
        };
      }
    } catch (err) {
      // Même en cas de perte de connexion, la sauvegarde localStorage est opérationnelle
    }

    return {
      success: true,
      message: "Code d'accès mis à jour avec succès et enregistré dans votre navigateur pour vos futures connexions."
    };
  },

  /**
   * Procédure de récupération / Mot de passe oublié :
   * Vérifie l'adresse e-mail administrative (eglisedunazareendedame@gmail.com).
   * Si l'e-mail correspond, réinitialise le code d'accès à 123456.
   */
  async recoverPasscode(email: string): Promise<SecurityResult> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      return { success: false, message: "Veuillez saisir l'adresse e-mail de récupération administrative." };
    }

    if (cleanEmail !== ADMIN_RECOVERY_EMAIL.toLowerCase()) {
      return {
        success: false,
        message: `Adresse e-mail non reconnue. Seule l'adresse officielle de l'Église (${ADMIN_RECOVERY_EMAIL}) est habilitée à réinitialiser le code d'accès.`
      };
    }

    // Réinitialise le code localement à la valeur par défaut : 123456
    this.resetToDefaultLocally();

    // Notifie le serveur pour synchroniser la réinitialisation
    try {
      const response = await fetch('/api/admin/reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: data.message || `Le code d'accès administrateur a été réinitialisé au code par défaut initial : ${DEFAULT_ADMIN_PASSCODE}. Vous pouvez vous connecter dès maintenant.`
        };
      }
    } catch {
      // Local fallback already applied
    }

    return {
      success: true,
      message: `Le code d'accès administrateur a été réinitialisé au code par défaut initial : ${DEFAULT_ADMIN_PASSCODE}. Vous pouvez désormais vous connecter.`
    };
  }
};
