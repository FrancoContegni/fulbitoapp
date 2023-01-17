
const mongoose = require('mongoose');
const axios = require("axios")
import { verifySignature } from "@upstash/qstash/nextjs";



const connectionString = `mongodb+srv://fotocopiero:A9xAsXwPH2RDLmlW@cluster0.6tfzzs5.mongodb.net/leagues?retryWrites=true&w=majority`

mongoose.connect(connectionString).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error(err);
});



const options = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
    params: { league: '39', season: '2020', team: '33' },
    headers: {
        'X-RapidAPI-Key': '64e1a0803emsh90496dace2b1354p1de268jsn1bb15e616fca',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
    }
};

const dataSchema = new mongoose.Schema({
    team: String,
    form: String,
    logo: String,
    name: String

});

const DataModel = mongoose.model('england', dataSchema);

// Hacer la llamada a la API aquí
async function handler() {
    try {
        const response = await axios.request(options);
        // Crear un nuevo documento en la base de datos utilizando el modelo de Mongoose
        const data = new DataModel({
            team: response.data.parameters.team,
            form: response.data.form,
            logo: response.data.response.team.logo,
            name: response.data.response.team.name
        });
        data.save(function (error) {
            if (error) {
                console.log(error);
            } else {
                console.log("Documento guardado exitosamente");
            }
        });
    } catch (error) {
        console.error(error);
    }
}

export default verifySignature(handler);

export const config = {
    api: {
      bodyParser: false,
    },
  };