import mongoose from 'mongoose'


const EnglandSchema = new mongoose.Schema({
    team: {String
    },
    logo: {String
    },
    name: {String
    },

})

export default mongoose.models.England || mongoose.model('England', EnglandSchema)