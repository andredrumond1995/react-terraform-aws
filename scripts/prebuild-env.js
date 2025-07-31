require('dotenv').config({ path: '.env.production' });
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log('.env with API_URL:', apiUrl); 