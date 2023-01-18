const mongoose = require('mongoose');
const axios = require("axios");
const verifySignature = require("@upstash/qstash/nextjs").verifySignature;

const URI_MONGO = "mongodb+srv://fotocopiero:A9xAsXwPH2RDLmlW@cluster0.6tfzzs5.mongodb.net/leagues?retryWrites=true&w=majority"

process.env.QSTASH_CURRENT_SIGNING_KEY = "sig_5uZH86gYxAk8KXVDVkpVsj9KgdJ2";
process.env.QSTASH_NEXT_SIGNING_KEY = "sig_5Xyzim7UERfyEoUzA39feZCDEkko";
verifySignature(handler);



mongoose.connect(URI_MONGO).then(() => {
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
     console.log('options');
    const dataSchema = new mongoose.Schema({
        team: String,
        form: String,
        logo: String,
        name: String
    
    });
    console.log('dataschema');
    const DataModel = mongoose.model('england', dataSchema);

console.log('datamodel');

    async function handler(req, res) {
        console.log("If this is printed, the signature has already been verified");
    // Hacer la llamada a la API aquí
    axios.request(options).then(function (response) {
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
    }).catch(function (error) {
        console.error(error);
    });
    res.status(200).end();
}

module.exports = verifySignature(handler);

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

