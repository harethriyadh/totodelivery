const fetch = require('node-fetch'); // or dynamic import or native fetch
fetch('http://127.0.0.1:3001/api/products/69ab6241087f444aa0af25da', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YWI2MjNlMDg3ZjQ0NGFhMGFmMjVjNiIsInJvbGUiOiJtYXJrZXRfb3duZXIiLCJpYXQiOjE3NzI4NTA2NjUsImV4cCI6MTc3MjkzNzA2NX0.R9473G3UwWgOFDn7MTzzFuUhs4Hk-rrc7-2C5cWRkBU',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
      name: 'Test Put',
      category: { id: 'fresh_veg', label_ar: 'test', parent_id: 'root' },
      pricing: { price: 1000, cost_price: 500 },
      inventory: { stock_quantity: 10, unit_type: 'kg' }
  })
}).then(res => res.json()).then(console.log).catch(console.error);
