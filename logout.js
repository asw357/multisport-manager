<!doctype html><html lang="nl"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Uitloggen</title>
<script src="https://cdn.tailwindcss.com"></script>
</head><body class="bg-slate-50">
<main class="max-w-md mx-auto p-6"><h1 class="text-xl font-bold mb-4">Uitloggen…</h1></main>
<script type="module">
import { getClient } from './config.js';
const supabase = await getClient();
await supabase.auth.signOut();
location.href = 'index.html';
</script></body></html>
