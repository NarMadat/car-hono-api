import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';


const app = new Hono();

app.use('*', cors({
  origin: '*', 
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'], 
}));



let cars = [
  {
    id: 1,
    name: 'Opel Zafira',
    regNum: '00XX000',
    type: 'Թեթև մարդատար',
    model: 'Sedan',
    color: 'Շամպայն մետալիկ (բեժ)',
    year: 1999,
    vin: '7843298347928374982374',
    image: '/cars/opel.svg',
    isWanted: false,
  },
  {
    id: 2,
    name: 'Toyota Corolla',
    regNum: '01AA111',
    type: 'Թեթև մարդատար',
    model: 'Hatchback',
    color: 'Շամպայն մետալիկ (բեժ)',
    year: 2015,
    vin: '1234567890123456789012',
    image: '/cars/opel.svg',
    isWanted: false,
  },
];

const users = [
  {
    id: 1,
    name: 'Արամ',
    surname: 'Հովհաննիսյան',
    birthYear: 1992,
    pass: '1234567890',
  },
  {
    id: 2,
    name: 'Անահիտ',
    surname: 'Մարտիրոսյան',
    birthYear: 1992,
    pass: '0987654321',
  },
];


app.get('/api/v1/vehicles', (c) => {
  return c.json(cars);
});

app.get('/api/v1/vehicles/:id/eligibility', (c) => {
  const vehicleId = parseInt(c.req.param('id'), 10);
  const vehicle = cars.find((car) => car.id === vehicleId);

  if (!vehicle) {
    return c.json({ message: 'Vehicle not found' }, 404);
  }

  if (vehicle.isWanted) {
    return c.json({
      eligible: false,
      message: `Vehicle "${vehicle.name}" with registration number "${vehicle.regNum}" is in the wanted list and cannot be transferred.`,
    }, 400);
  }

  return c.json({
    eligible: true,
    message: `Vehicle "${vehicle.name}" is eligible for ownership transfer.`,
  });
});

app.get('/api/v1/users/:pass', (c) => {
  const userPass = c.req.param('pass');
  const user = users.find((u) => u.pass === userPass);

  if (user) {
    return c.json({
      name: user.name,
      surname: user.surname,
      birthYear: user.birthYear,
    });
  } else {
    return c.json({ message: 'User not found' }, 404);
  }
});

app.get('/docs/*', swaggerUI({ url: '/swagger.json' }));
app.get('/swagger.json', (c) => {
  return c.json(require('./swagger.json'));
});

export default app;
