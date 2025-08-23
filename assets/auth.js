import { supabase } from "./supabaseClient.js";

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

// Probeer je admin te bootstrappen; fout = ok (we loggen alleen een waarschuwing)
export async function ensureAdminBootstrap() {
  try {
    const { error } = await supabase.rpc("ensure_admin_for_owner");
    if (error) console.warn("ensure_admin_for_owner RPC error:", error);
  } catch (e) {
    console.warn("ensure_admin_for_owner runtime error:", e?.message || e);
  }
}

export async function requireAuth(redirect = "inloggen.html") {
  const user = await getUser();
  if (!user) window.location.href = redirect;
  return user;
}

// --- Fallback-profielophaal: eerst RPC, anders tabellen direct --- //
export async function getMyProfile() {
  // 1) probeer RPC (mooi inclusief landnaam/e-mail)
  try {
    const { data, error } = await supabase.rpc("get_my_profile");
    if (!error && Array.isArray(data) && data[0]) return data[0];
    if (error) console.warn("get_my_profile RPC error:", error);
  } catch (e) {
    console.warn("get_my_profile RPC runtime error:", e?.message || e);
  }

  // 2) Fallback zonder RPC: lees eigen profiel + landnaam + e-mail
  try {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) return null;

    // Profiel (RLS staat toe: id = auth.uid())
    const { data: profRows, error: profErr } = await supabase
      .from("profiles")
      .select("id, manager_name, country_id, mp, is_admin, initialized")
      .eq("id", uid)
      .limit(1);

    if (profErr) throw profErr;
    const prof = profRows?.[0];
    if (!prof) return null;

    // E-mail via auth API
    const email = userData.user.email ?? null;

    // Landnaam ophalen uit countries
    let country_name = null;
    if (prof.country_id) {
      const { data: cRows, error: cErr } = await supabase
        .from("countries")
        .select("name")
        .eq("id", prof.country_id)
        .limit(1);
      if (!cErr) country_name = cRows?.[0]?.name ?? null;
    }

    return {
      id: prof.id,
      manager_name: prof.manager_name,
      email,
      country_id: prof.country_id,
      country_name,
      mp: prof.mp,
      is_admin: prof.is_admin,
      initialized: prof.initialized,
    };
  } catch (e) {
    console.error("Fallback getMyProfile failed:", e?.message || e);
    return null;
  }
}

export async function requireAdmin(redirect = "index.html") {
  await ensureAdminBootstrap();      // eerst admin proberen te forceren
  await requireAuth();               // zeker weten ingelogd
  const prof = await getMyProfile(); // profiel ophalen (RPC of fallback)
  if (!prof?.is_admin) window.location.href = redirect;
  return { prof };
}

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
  const user = await getUser();
  const adminLink = document.getElementById("adminLink");
  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");

  if (!user) {
    if (adminLink) adminLink.style.display = "none";
    if (loginLink) loginLink.style.display = "inline-block";
    if (signupLink) signupLink.style.display = "inline-block";
    return;
  }

  // Zodra iemand ingelogd is: bootstrap en profiel ophalen
  await ensureAdminBootstrap();

  if (loginLink) loginLink.style.display = "none";
  if (signupLink) signupLink.style.display = "none";

  const prof = await getMyProfile();
  if (adminLink) adminLink.style.display = prof?.is_admin ? "inline-block" : "none";
}
