const mongoose = require('mongoose');
const axios = require("axios");

const URI_MONGO = "mongodb+srv://fotocopiero:A9xAsXwPH2RDLmlW@cluster0.6tfzzs5.mongodb.net/leagues?retryWrites=true&w=majority"

process.env.QSTASH_CURRENT_SIGNING_KEY = "sig_5uZH86gYxAk8KXVDVkpVsj9KgdJ2";
process.env.QSTASH_NEXT_SIGNING_KEY = "sig_5Xyzim7UERfyEoUzA39feZCDEkko";



mongoose.connect(URI_MONGO).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error(err);
});



    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: { id: '923276'},
        headers: {
            'X-RapidAPI-Key': '64e1a0803emsh90496dace2b1354p1de268jsn1bb15e616fca',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
        }
    };

     const liveSchema = new mongoose.Schema({
        time: String,
        status: String,
        league: String,
        logo: String,
        home: String,
        away: String,
        id: String
    });


const Live = mongoose.model('Live', liveSchema);





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
    });





