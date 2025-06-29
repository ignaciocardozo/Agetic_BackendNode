export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir sin origen (Thunder Client, curl, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = ['http://localhost:5432'];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};