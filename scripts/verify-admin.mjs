const res = await fetch('https://karsa.work/api/admin-analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'fajar.mreza@gmail.com' }),
});
const j = await res.json();
console.log('status', res.status);
console.log('supabaseConfigured', j.supabaseConfigured);
console.log('supabase', j.supabase);
console.log('today', j.today);
