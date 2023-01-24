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
    time: String,
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


        const fixtures = result.data.response.map(fixture => {
            return new Fixture({
                id: fixture.id,
                time: fixture.timestamp,
                status: fixture.status,
                league: fixture.league.name,
                logo: fixture.league.logo,
                home: fixture.teams.home.name,
                away: fixture.teams.away.name
            });
        });
        
        for (const f of fixtures) {
            await Fixture.updateMany({ id: f.id }, f, { upsert: true });
        }

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