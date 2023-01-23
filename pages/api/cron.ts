import mongoose from 'mongoose';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";

const URI_MONGO = process.env.URI_MONGO as string; 
console.log("pass",URI_MONGO);

const QSTASH_CURRENT_SIGNING_KEY = process.env.QSTASH_CURRENT_SIGNING_KEY as string;
const QSTASH_NEXT_SIGNING_KEY = process.env.QSTASH_NEXT_SIGNING_KEY as string;

mongoose.connect(URI_MONGO).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error(err);
});

const teamSchema = new mongoose.Schema({
    team: String,
    form: String,
    logo: String,
    name: String
});

const Team = mongoose.model("Team", teamSchema);
export const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {

        const equipo = '30'
const año = '2022'
const liga = '39'
        const result = await axios({
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
            headers: {
                'X-RapidAPI-Key': '64e1a0803emsh90496dace2b1354p1de268jsn1bb15e616fca',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            },
            params: {
                league: liga,
                season: año,
                team: equipo
            }
        });

        const team = new Team({
            team: result.data.parameters.team,
            form: result.data.form,
            logo: result.data.response.team.logo,
            name: result.data.response.team.name
        });
        await team.save();

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
