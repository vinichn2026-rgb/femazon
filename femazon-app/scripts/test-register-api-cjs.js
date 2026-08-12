const Database = require('better-sqlite3');

const tests = [
  {
    name: 'Valid registration',
    body: {
      name: 'Test User',
      email: 'test.user1@example.com',
      phone: '9876543210',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
    expectStatus: 201,
  },
  {
    name: 'Empty name',
    body: {
      name: '',
      email: 'test.user2@example.com',
      phone: '9876543210',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
    expectStatus: 400,
  },
  {
    name: 'Empty email',
    body: {
      name: 'Test User',
      email: '',
      phone: '9876543210',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
    expectStatus: 400,
  },
  {
    name: 'Invalid email',
    body: {
      name: 'Test User',
      email: 'invalid-email',
      phone: '9876543210',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
    expectStatus: 400,
  },
  {
    name: 'Empty phone',
    body: {
      name: 'Test User',
      email: 'test.user3@example.com',
      phone: '',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
    expectStatus: 400,
  },
  {
    name: 'Invalid phone',
    body: {
      name: 'Test User',
      email: 'test.user4@example.com',
      phone: '12345',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
    expectStatus: 400,
  },
  {
    name: 'Empty password',
    body: {
      name: 'Test User',
      email: 'test.user5@example.com',
      phone: '9876543210',
      password: '',
      confirmPassword: '',
    },
    expectStatus: 400,
  },
  {
    name: 'Weak password',
    body: {
      name: 'Test User',
      email: 'test.user6@example.com',
      phone: '9876543210',
      password: 'password',
      confirmPassword: 'password',
    },
    expectStatus: 400,
  },
  {
    name: 'Password mismatch',
    body: {
      name: 'Test User',
      email: 'test.user7@example.com',
      phone: '9876543210',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword2',
    },
    expectStatus: 400,
  },
  {
    name: 'Existing email',
    body: {
      name: 'Test User',
      email: 'test.user1@example.com',
      phone: '9876543210',
      password: 'P@ssword1',
      confirmPassword: 'P@ssword1',
    },
    expectStatus: 409,
  },
  {
    name: 'Successful second user registration',
    body: {
      name: 'Second User',
      email: 'test.user8@example.com',
      phone: '9876543211',
      password: 'P@ssword2',
      confirmPassword: 'P@ssword2',
    },
    expectStatus: 201,
  },
];

async function runTests() {
  const results = [];
  for (const test of tests) {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test.body),
    });
    let body = null;
    try {
      body = await res.json();
    } catch (e) {
      body = await res.text();
    }
    results.push({ name: test.name, status: res.status, body });
  }

  console.log('RESULTS');
  console.log(JSON.stringify(results, null, 2));

  const db = new Database('dev.db', { readonly: true });
  const rows = db.prepare('SELECT id, name, email, phone, role, password FROM User WHERE email IN (?, ?)').all(
    'test.user1@example.com',
    'test.user8@example.com'
  );
  db.close();

  console.log('DB USERS');
  console.log(JSON.stringify(rows, null, 2));
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
