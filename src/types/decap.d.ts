// Deklarace globálů, které přidává Decap CMS (načte je skript z unpkg)
declare const CMS: any;

declare global {
  interface Window {
    CMS_MANUAL_INIT?: boolean;
  }
}
export {};
