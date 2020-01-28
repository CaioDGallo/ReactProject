const Dev = require('../models/Dev')
const ArrayUtils = require('../utils/ArrayUtils')

module.exports = {
    async index(request, response){
        //Search for devs in a 10km radius
        // and filter by tech stack

        const { latitude, longitude, techs } = request.query

        const techsArray = ArrayUtils(techs)

        const devs = await Dev.find({
            techs: {
                $in: techsArray,
            },
            location: {
                $near:{
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 10000,
                }   
            }
        })

        return response.json({ devs });
    }
}