import { supabase } from "./supabaseClient.js";

/** Huidige user (of null) */
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

/** Ben je ingelogd met het “owner” admin e‑mailadres? */
export async function isOwnerAdminEmail() {
  const user = await getUser();
  const em = user?.email?.toLowerCase() || "";
  return em === "wilcoboesveld12@hotmail.com";
}

/** Verplicht ingelogd; anders redirect */
export async function requireAuth(redirect = "inloggen.html") {
  const user = await getUser();
  if (!user) window.location.href = redirect;
  return user;
}

/** Profiel ophalen – eerst RPC proberen, anders directe SELECT (fallback) */
export async function getMyProfile() {
  // 1) Probeer RPC
  try {
    const { data, error } = await supabase.rpc("get_my_profile");
    if (!error && Array.isArray(data) && data[0]) return data[0];
  } catch (_) {}

  // 2) Fallback zonder RPC
  try {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) return null;

    const { data: profRows } = await supabase
      .from("profiles")
      .select("id, manager_name, country_id, mp, is_admin, initialized")
      .eq("id", uid)
      .limit(1);

    const prof = profRows?.[0];
    if (!prof) return null;

    let country_name = null;
    if (prof.country_id) {
      const { data: cRows } = await supabase
        .from("countries")
        .select("name")
        .eq("id", prof.country_id)
        .limit(1);
      country_name = cRows?.[0]?.name ?? null;
    }

    return {
      id: prof.id,
      manager_name: prof.manager_name,
      email: userData.user.email ?? null,
      country_id: prof.country_id,
      country_name,
      mp: prof.mp,
      is_admin: prof.is_admin,
      initialized: prof.initialized,
    };
  } catch (_) {
    return null;
  }
}

/** Nav render + admin-link tonen als owner email OF profiel admin */
export function navRender(el) {
  el.innerHTML = `
    <header class="nav">
      <a href="index.html" class="logo">Multisport-Manager</a>
      <nav>
        <a href="index.html">Home</a>
        <a href="manager.html">Manager</a>
        <a href="training.html">Training</a>
        <a href="scouten.html">Scout</a>
        <a href="admin.html" id="adminLink" style="display:none">Admin</a>
        <a href="uitloggen.html">Uitloggen</a>
        <a href="inloggen.html" id="loginLink" style="display:none">Inloggen</a>
        <a href="inschrijven.html" id="signupLink" style="display:none">Inschrijven</a>
      </nav>
    </header>
  `;
  refreshNav();
}

export async function refreshNav() {
  const adminLink = document.getElementById("adminLink");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");

  const user = await getUser();

  if (!user) {
    if (adminLink) adminLink.style.display = "none";
    if (loginLink) loginLink.style.display = "inline-block";
    if (signupLink) signupLink.style.display = "inline-block";
    return;
  }

  if (loginLink) loginLink.style.display = "none";
  if (signupLink) signupLink.style.display = "none";

  // Admin-link zichtbaar als owner email of profiel admin
  const owner = await isOwnerAdminEmail();
  let profIsAdmin = false;
  try {
    const prof = await getMyProfile();
    profIsAdmin = !!prof?.is_admin;
  } catch (_) {}

  if (adminLink) adminLink.style.display = (owner || profIsAdmin) ? "inline-block" : "none";
}
