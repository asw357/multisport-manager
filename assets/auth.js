<script type="module">
import { supabase } from "./supabaseClient.js";

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

export async function requireAuth(redirect = "inloggen.html") {
  const user = await getUser();
  if (!user) window.location.href = redirect;
  return user;
}

export async function getMyProfile() {
  try {
    const { data, error } = await supabase.rpc("get_my_profile");
    if (error) throw error;
    return data?.[0] ?? null;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function requireAdmin(redirect = "index.html") {
  const user = await requireAuth();
  const prof = await getMyProfile();
  if (!prof?.is_admin) window.location.href = redirect;
  return { user, prof };
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
  if (loginLink) loginLink.style.display = "none";
  if (signupLink) signupLink.style.display = "none";

  const prof = await getMyProfile();
  if (adminLink) adminLink.style.display = prof?.is_admin ? "inline-block" : "none";
}
</script>
