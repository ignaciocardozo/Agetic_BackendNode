import express from 'express';
// import userRoutes from './routes/usersRoutes.js';
// import rolUserRoutes from './routes/rolUserRoutes.js';
import { corsOptions } from './db/cors.js';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors(corsOptions))
// app.use('/auth/users', userRoutes);
// app.use('/auth/users', rolUserRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto: ${port}`);	
});