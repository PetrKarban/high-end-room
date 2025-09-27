// Deklarace globálů, které přidává Decap CMS (načte je skript z unpkg)
declare const CMS: any;

declare global {
  interface Window {
    // ruční init Decapu
    CMS_MANUAL_INIT?: boolean;

    // Decap CMS UI API dostupné na window
    CMS?: any;
  }
}

export {};

