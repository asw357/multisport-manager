<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <title>Uitloggen...</title>
</head>
<body>
  <p>Je wordt uitgelogd...</p>
  <script type="module">
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    const supabase = createClient(
      'https://yqbejgnhmizkeuxxpbbb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxYmVqZ25obWl6a2V1eHhwYmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1Nzg2NDksImV4cCI6MjA3MDE1NDY0OX0.L_v6XgPh7F6KrWKlu72f6jbL_QTU-hdMQa0lA-QFryM'
    );

    await supabase.auth.signOut();
    localStorage.removeItem('user');
    location.href = 'index.html';
  </script>
</body>
</html>
