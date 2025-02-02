document.getElementById('tenantForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.dateOfEntry = new Date(data.dateOfEntry).toISOString();
  
    const response = await fetch('/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      return alert('Failed to add tenant');
    }
    
    event.target.reset();
    alert('Tenant added successfully');
    loadTenants();
  });
  
  async function loadTenants() {
    const response = await fetch('/tenants');
    const tenants = await response.json();
    const tenantList = document.getElementById('tenantList');
    tenantList.innerHTML = '';
    tenants.forEach(tenant => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${tenant.name}</strong> - ${tenant.houseNumber}`;
      tenantList.appendChild(div);
    });
  }
  
  loadTenants();
  