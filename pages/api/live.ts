import mongoose from 'mongoose';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";

const URI_MONGO = "mongodb+srv://fotocopiero:A9xAsXwPH2RDLmlW@cluster0.6tfzzs5.mongodb.net/leagues?retryWrites=true&w=majority"

process.env.QSTASH_CURRENT_SIGNING_KEY = "sig_5uZH86gYxAk8KXVDVkpVsj9KgdJ2";
process.env.QSTASH_NEXT_SIGNING_KEY = "sig_5Xyzim7UERfyEoUzA39feZCDEkko";

mongoose.connect(URI_MONGO).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error(err);
});

const fixtureSchema = new mongoose.Schema({
    id: String,
    time: Number,
    status: String,
    league: String,
    logo: String,
    home: String,
    away: String
});

const Fixture = mongoose.model('Fixture', fixtureSchema);



export const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {

 
        const result = await axios({
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            headers: {
                'X-RapidAPI-Key': '64e1a0803emsh90496dace2b1354p1de268jsn1bb15e616fca',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            },
            params: {
                date: '2023-01-24'
            }
        });


        const fixture = new Fixture({
            id: result.data.response.fixture.id,
            time: result.data.response.fixture.timestamp,
            status: result.data.response.fixture.status.long,
            league: result.data.response.league.id,
            logo: result.data.response.league.logo,
            home: result.data.response.teams.home.name,
            away: result.data.response.teams.away.name
        });
        
        await fixture.save();
        
        res.send("OK");
    } catch (err) {
        res.status(500).send(err);
    } finally {
        res.end();
    }
}

export default verifySignature(handler);

export const config = {
    api: {
        bodyParser: false,
    },
};