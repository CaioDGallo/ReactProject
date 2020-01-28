const axios = require('axios')
const Dev = require('../models/Dev')
const ArrayUtils = require('../utils/ArrayUtils')

//Index, Show, Store, Update and Destroy

module.exports = {
    async index(request, response){
        const devs = await Dev.find()

        return response.json(devs);
    },

    async store(request, response){
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username })

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

            const { name = login, avatar_url, bio } = apiResponse.data
    
            const techsArray = ArrayUtils(techs)
    
            const location = {
                type: "Point",
                coordinates: [longitude, latitude]
            }
    
            dev = await Dev.create({
                github_username, 
                name,
                avatar_url,
                bio, 
                techs: techsArray,
                location
            })
        }

        return response.json(dev);
    },

    async update(request, response){
        //TODO implement this method
    },

    async delete(request, response){
        const { github_username } = request.body

        const deleted = await Dev.deleteOne({
            github_username
        })

        let message = "Unable to delete dev"

        if(deleted.deletedCount > 0){
            message = "Dev successfully deleted"
        }

        return response.json({ message: message})
    },
}