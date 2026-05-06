export function extractCompany({ participants, organizer_email }) {
  // Step 1: try organizer_email first
  if (organizer_email) {
    const domain = organizer_email.split('@')[1];
    if (domain && domain !== 'leadgrow.ai') {
      return { domain, company_name: domain.split('.')[0] };
    }
  }
  // Step 2: scan participants string array for embedded @ addresses
  for (const name of participants) {
    if (typeof name === 'string' && name.includes('@')) {
      const domain = name.split('@')[1];
      if (domain && domain !== 'leadgrow.ai') {
        return { domain, company_name: domain.split('.')[0] };
      }
    }
  }
  return null;
}

if (import.meta.main) {
  const raw = process.argv[2];
  if (!raw) {
    console.error('Usage: bun scripts/extract-company.js \'{"participants":["..."],"organizer_email":"..."}\'');
    process.exit(1);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error('Invalid JSON input');
    process.exit(1);
  }
  console.log(JSON.stringify(extractCompany(parsed)));
}
