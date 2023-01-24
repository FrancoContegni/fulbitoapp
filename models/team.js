import mongoose from 'mongoose'


const EnglandSchema = new mongoose.Schema({
    team: {String
    },
    logo: {String
    },
    name: {String
    },

})

const TeamSchema = new mongoose.Schema({
    team: {String
    },
    logo: {String
    },
    name: {String
    },

})



export default mongoose.models.Team || mongoose.model('Team', TeamSchema)