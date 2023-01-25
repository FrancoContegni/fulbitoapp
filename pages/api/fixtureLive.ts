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
                id: '923276'
            },
        });


        const live = new Live({
            time:  result.data.fixture.timestamp,
            status:  result.data.fixture.status.long,
            league:  result.data.fixture.league.name,
            logo:  result.data.fixture.league.logo,
            home:  result.data.fixture.teams.home.name,
            away:  result.data.fixture.teams.away.name,
            score:  result.data.fixture.goals,
            id:  result.data.fixture.fixture.id
        });
        
        await live.save();
               

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