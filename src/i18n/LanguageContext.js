// Contexte de langue pour l'application
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from './translations';

const LANGUAGE_KEY = '@app_language';
const DEFAULT_LANGUAGE = 'fr';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la langue sauvegardée au démarrage
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && translations[savedLanguage]) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la langue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (newLanguage) => {
    if (translations[newLanguage]) {
      try {
        await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
        setLanguageState(newLanguage);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la langue:', error);
      }
    }
  };

  // Fonction pour obtenir une traduction
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback vers le français si la clé n'existe pas
        let fallback = translations[DEFAULT_LANGUAGE];
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk];
          } else {
            return key; // Retourner la clé si aucune traduction trouvée
          }
        }
        return fallback;
      }
    }
    
    return value;
  };

  // Vérifier si la langue est RTL (Right-to-Left)
  const isRTL = language === 'ar';

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
    isLoading,
    availableLanguages: Object.keys(translations),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
