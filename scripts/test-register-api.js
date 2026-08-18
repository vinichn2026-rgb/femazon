const { prisma } = require('../src/lib/prisma');

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

const client = prisma;

async function run() {
  const results = [];
  for (const test of tests) {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(test.body),
    });
    const data = await res.json().catch(() => null);
    results.push({ name: test.name, status: res.status, body: data });
  }

  console.log(JSON.stringify(results, null, 2));

  const users = await client.user.findMany({
    where: { email: { in: ['test.user1@example.com', 'test.user8@example.com'] } },
    select: { id: true, name: true, email: true, phone: true, role: true, password: true },
  });

  console.log('users', JSON.stringify(users, null, 2));
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
