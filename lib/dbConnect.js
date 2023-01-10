import mongoose from 'mongoose'
import redis from 'redis';

const client = redis.createClient({
    host: 'localhost',
    port: 6379
  });
  

const URI_MONGO = process.env.URI_MONGO

const conectarDB = async () => {
    try {
      // Intentar recuperar la conexión de la caché
      const cachedDb = client.get('db');
      if (cachedDb) {
        console.log('Recuperando conexión a la base de datos de la caché');
        mongoose.connection = cachedDb;
        return;
      }
  
      // Conectar a la base de datos si no está en caché
      await mongoose.connect(URI_MONGO);
      console.log('Conectado a la base de datos');
  
      // Almacenar la conexión en la caché
      client.set('db', mongoose.connection);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
export default conectarDB;
