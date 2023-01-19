import mongoose from 'mongoose';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";

const URI_MONGO = "mongodb+srv://fotocopiero:A9xAsXwPH2RDLmlW@cluster0.6tfzzs5.mongodb.net/leagues?retryWrites=true&w=majority"

process.env.QSTASH_CURRENT_SIGNING_KEY = "sig_5uZH86gYxAk8KXVDVkpVsj9KgdJ2";
process.env.QSTASH_NEXT_SIGNING_KEY = "sig_5Xyzim7UERfyEoUzA39feZCDEkko";

mongoose.connect(URI_MONGO).then(() => {
    console.log('Database connected');
    start()
}).catch(err => {
    console.error(err);
});

console.log('Estado de la conexión:', mongoose.connection.readyState);

const teamSchema = new mongoose.Schema({
    league: Number,
    season: Number,
    team: Number,
    data: {}
});

const Team = mongoose.model("Team", teamSchema);
console.log('llega hasta acá?');
console.log('Estado de la conexión nueva:', mongoose.connection.readyState);
let handler: any;
const start = () => {
    const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
        console.log("If this is printed, the signature has already been verified");
        try {
            const result = await axios({
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
                headers: {
                    'X-RapidAPI-Key': '64e1a0803emsh90496dace2b1354p1de268jsn1bb15e616fca',
                    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
                },
                params: {
                    league: '39',
                    season: '2020',
                    team: '33'
                }
            });
    
            const team = new Team({ league: 39, season: 2020, team: 33, data: result.data });
            await team.save();
    
            res.send("OK");
    
        } catch (err) {
            res.status(500).send(err);
        } finally {
            res.end();
        }
    }
    console.log('despues de todo');
}
export default verifySignature(handler);
export const config = {
    api: {
        bodyParser: false,
    },
};

