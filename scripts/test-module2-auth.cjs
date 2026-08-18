const crypto = require('crypto');
const Database = require('better-sqlite3');

const baseUrl = 'http://127.0.0.1:3000';

const cookieJar = {};
function saveCookies(setCookie) {
  if (!setCookie) return;
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  cookies.forEach((cookie) => {
    const [pair, ...attrs] = cookie.split(';').map((part) => part.trim());
    const [name, value] = pair.split('=');
    if (!name) return;
    if (value === '') {
      delete cookieJar[name];
    } else {
      cookieJar[name] = value;
    }
  });
}

function getCookieHeader() {
  return Object.entries(cookieJar)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

async function request(path, { method = 'GET', body, headers = {}, followRedirect = false } = {}) {
  const opts = {
    method,
    headers: {
      ...headers,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(Object.keys(cookieJar).length ? { Cookie: getCookieHeader() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: followRedirect ? 'follow' : 'manual',
  };
  const res = await fetch(`${baseUrl}${path}`, opts);
  saveCookies(res.headers.get('set-cookie'));
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), body: data };
}

function createExpiredSessionToken(secret) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: 'expired-user',
    name: 'Expired User',
    email: 'expired@example.com',
    role: 'CUSTOMER',
    iat: now - 86400,
    exp: now - 1,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(encoded);
  const signature = Buffer.from(hmac.digest()).toString('base64url');
  return `${encoded}.${signature}`;
}

async function createUser(email, password, role) {
  const registerBody = {
    name: `${role.toLowerCase()} user`,
    email,
    phone: '9876543210',
    password,
    confirmPassword: password,
  };
  const res = await request('/api/auth/register', { method: 'POST', body: registerBody });
  return res;
}

function ensureUserRole(email, role) {
  const db = new Database('dev.db');
  const user = db.prepare('SELECT id, email, role FROM User WHERE email = ?').get(email);
  if (!user) throw new Error(`User ${email} not found in DB`);
  if (user.role !== role) {
    db.prepare('UPDATE User SET role = ? WHERE email = ?').run(role, email);
  }
  db.close();
}

async function run() {
  const results = [];
  const errors = [];

  // Ensure fresh data
  const db = new Database('dev.db');
  db.prepare('DELETE FROM User WHERE email LIKE ?').run('test.%');
  db.close();

  // CUSTOMER registration
  results.push({ step: 'Register CUSTOMER', result: await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Test Customer',
      email: 'test.customer@example.com',
      phone: '9876543211',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
  }) });

  // vendor and admin accounts created as customers then promoted in DB
  results.push({ step: 'Register VENDOR candidate', result: await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Test Vendor',
      email: 'test.vendor@example.com',
      phone: '9876543212',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
  }) });
  ensureUserRole('test.vendor@example.com', 'VENDOR');

  results.push({ step: 'Register ADMIN candidate', result: await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Test Admin',
      email: 'test.admin@example.com',
      phone: '9876543213',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
  }) });
  ensureUserRole('test.admin@example.com', 'ADMIN');

  // Security tests
  results.push({ step: 'Invalid email on login', result: await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'bad-email', password: 'P@ssword1' },
  }) });

  results.push({ step: 'Incorrect password', result: await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'test.customer@example.com', password: 'wrongpass' },
  }) });

  results.push({ step: 'Empty credentials', result: await request('/api/auth/login', {
    method: 'POST',
    body: { email: '', password: '' },
  }) });

  results.push({ step: 'Duplicate registration', result: await request('/api/auth/register', {
    method: 'POST',
    body: {
      name: 'Test Customer',
      email: 'test.customer@example.com',
      phone: '9876543211',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
  }) });

  // Customer flow
  cookieJar['femazon_session'] = undefined;
  results.push({ step: 'Login CUSTOMER', result: await request('/api/auth/login', { method: 'POST', body: { email: 'test.customer@example.com', password: 'P@ssword1' } }) });
  results.push({ step: 'Access /profile as CUSTOMER', result: await request('/profile') });
  results.push({ step: 'Access /cart as CUSTOMER', result: await request('/cart') });
  results.push({ step: 'Access /bookings as CUSTOMER', result: await request('/bookings') });
  results.push({ step: 'Access /vendor/dashboard as CUSTOMER', result: await request('/vendor/dashboard') });
  results.push({ step: 'Access /admin/dashboard as CUSTOMER', result: await request('/admin/dashboard') });

  results.push({ step: 'Logout CUSTOMER', result: await request('/api/auth/logout') });
  results.push({ step: 'Access /profile after logout', result: await request('/profile') });

  // Vendor flow
  Object.keys(cookieJar).forEach((k) => delete cookieJar[k]);
  results.push({ step: 'Login VENDOR', result: await request('/api/auth/login', { method: 'POST', body: { email: 'test.vendor@example.com', password: 'P@ssword1' } }) });
  results.push({ step: 'Access /vendor/dashboard as VENDOR', result: await request('/vendor/dashboard') });
  results.push({ step: 'Access /vendor/products as VENDOR', result: await request('/vendor/products') });
  results.push({ step: 'Access /vendor/services as VENDOR', result: await request('/vendor/services') });
  results.push({ step: 'Access /vendor/bookings as VENDOR', result: await request('/vendor/bookings') });
  results.push({ step: 'Access /admin/dashboard as VENDOR', result: await request('/admin/dashboard') });

  // Admin flow
  Object.keys(cookieJar).forEach((k) => delete cookieJar[k]);
  results.push({ step: 'Login ADMIN', result: await request('/api/auth/login', { method: 'POST', body: { email: 'test.admin@example.com', password: 'P@ssword1' } }) });
  results.push({ step: 'Access /admin/dashboard as ADMIN', result: await request('/admin/dashboard') });
  results.push({ step: 'Access /admin/users as ADMIN', result: await request('/admin/users') });
  results.push({ step: 'Access /admin/vendors as ADMIN', result: await request('/admin/vendors') });
  results.push({ step: 'Access /admin/products as ADMIN', result: await request('/admin/products') });
  results.push({ step: 'Access /admin/services as ADMIN', result: await request('/admin/services') });
  results.push({ step: 'Access /admin/bookings as ADMIN', result: await request('/admin/bookings') });

  // Session expiration simulation
  const secret = process.env.SESSION_SECRET || 'dev-secret';
  const expiredToken = createExpiredSessionToken(secret);
  cookieJar['femazon_session'] = expiredToken;
  results.push({ step: 'Expired session access /profile', result: await request('/profile') });

  // Password hash verification
  const db2 = new Database('dev.db');
  const customer = db2.prepare('SELECT password FROM User WHERE email = ?').get('test.customer@example.com');
  const vendor = db2.prepare('SELECT password FROM User WHERE email = ?').get('test.vendor@example.com');
  const admin = db2.prepare('SELECT password FROM User WHERE email = ?').get('test.admin@example.com');
  db2.close();
  results.push({ step: 'Password hash CUSTOMER', hash: customer.password });
  results.push({ step: 'Password hash VENDOR', hash: vendor.password });
  results.push({ step: 'Password hash ADMIN', hash: admin.password });

  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
