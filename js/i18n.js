<script type="module">
// Lightweight i18n for static pages (NL/EN/DE examples)
const DEFAULT_LANG = localStorage.getItem('lang') || navigator.language?.slice(0,2) || 'nl';
export let lang = ['nl','en','de'].includes(DEFAULT_LANG) ? DEFAULT_LANG : 'nl';

export const t = (key) => translations[lang]?.[key] ?? translations['nl'][key] ?? key;

export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.placeholder !== undefined && el.tagName === 'INPUT') {
      el.placeholder = val;
    } else if (el.tagName === 'TITLE') {
      el.textContent = val;
      document.title = val;
    } else {
      el.innerHTML = val;
    }
  });
}

export function setLanguage(newLang) {
  lang = newLang;
  localStorage.setItem('lang', newLang);
  applyTranslations();
}

export function renderLanguageSwitcher(container) {
  container.innerHTML = `
    <select id="langSel" class="border rounded px-2 py-1 text-sm">
      <option value="nl">Nederlands</option>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>`;
  const sel = container.querySelector('#langSel');
  sel.value = lang;
  sel.addEventListener('change', e => setLanguage(e.target.value));
}

export const translations = {
  nl: {
    app_title: "Multisport-Manager",
    nav_home: "Home",
    nav_manager: "Manager",
    nav_admin: "Admin",
    nav_standings: "Klassement",
    nav_schedule: "Schema",
    nav_events: "Onderdelen",
    nav_athletes: "Atleten",
    nav_logout: "Uitloggen",
    // Pages
    schedule_title: "Schema",
    events_title: "Onderdelen per editie",
    athletes_title: "Atleten",
    simulations_title: "Simulaties",
    reset_title: "Wachtwoord resetten",
    update_title: "Nieuw wachtwoord instellen",
    // Common
    choose_edition: "Kies editie",
    load: "Laden",
    search: "Zoeken",
    filter: "Filter",
    // Schedule
    day: "Dag", event: "Event", round: "Ronde", seq: "Volgorde",
    // Events
    sport: "Sport", discipline: "Discipline", gender: "Gender",
    // Athletes
    name: "Naam", manager: "Manager", country: "Land",
  },
  en: {
    app_title: "Multisport Manager",
    nav_home: "Home",
    nav_manager: "Manager",
    nav_admin: "Admin",
    nav_standings: "Standings",
    nav_schedule: "Schedule",
    nav_events: "Events",
    nav_athletes: "Athletes",
    nav_logout: "Logout",
    schedule_title: "Schedule",
    events_title: "Events by Edition",
    athletes_title: "Athletes",
    simulations_title: "Simulations",
    reset_title: "Reset password",
    update_title: "Set new password",
    choose_edition: "Choose edition",
    load: "Load",
    search: "Search",
    filter: "Filter",
    day: "Day", event: "Event", round: "Round", seq: "Order",
    sport: "Sport", discipline: "Discipline", gender: "Gender",
    name: "Name", manager: "Manager", country: "Country",
  },
  de: {
    app_title: "Multisport-Manager",
    nav_home: "Start",
    nav_manager: "Manager",
    nav_admin: "Admin",
    nav_standings: "Tabelle",
    nav_schedule: "Zeitplan",
    nav_events: "Wettbewerbe",
    nav_athletes: "Athleten",
    nav_logout: "Abmelden",
    schedule_title: "Zeitplan",
    events_title: "Wettbewerbe je Ausgabe",
    athletes_title: "Athleten",
    simulations_title: "Simulationen",
    reset_title: "Passwort zurücksetzen",
    update_title: "Neues Passwort festlegen",
    choose_edition: "Ausgabe wählen",
    load: "Laden",
    search: "Suchen",
    filter: "Filtern",
    day: "Tag", event: "Event", round: "Runde", seq: "Reihenfolge",
    sport: "Sport", discipline: "Disziplin", gender: "Geschlecht",
    name: "Name", manager: "Manager", country: "Land",
  }
};

// Auto-apply on load
document.addEventListener('DOMContentLoaded', () => applyTranslations());
</script>
