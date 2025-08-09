<!DOCTYPE html>
<html lang="nl">
<head>
  <mta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Uitloggen</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-slate-50 grid place-items-center">
  <div class="bg-white rounded-2xl shadow p-6">
    <div class="font-semibold">Bezig met uitloggen…</div>
  </div>
  <script type="module">
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    const supabase = createClient(
      'https://yqbejgnhmizkeuxxpbbb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmVqZ25obWl6a2V1eHhwYmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1Nzg2NDksImV4cCI6MjA3MDE1NDY0OX0.L_v6XgPh7F6KrWKlu72f6jbL_QTU-hdMQa0lA-QFryM'
    );
    await supabase.auth.signOut();
    location.href = 'index.html';
  </script>
</body>
</html>
