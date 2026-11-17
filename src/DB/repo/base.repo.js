export default (model) => {
    return {
        findOne: async ({ filter, projection, options, populate }) => {
            let data = await model.findOne(filter, projection, options).populate(populate || undefined)
            return data
        },

        findById: async ({ id, projection, options, populate }) => {
            let data = await model.findById(id, projection, options).populate(populate || undefined)
            return data
        },

        findOneAndUpdate: async ({ filter, update, options, populate }) => {
            let data = await model.findOneAndUpdate(filter, update, { returnDocument: "after", ...options }).populate(populate || undefined)
            return data
        },

        findByIdAndUpdate: async ({ id, update, options, populate }) => {
            let data = await model.findByIdAndUpdate(id, update, { returnDocument: "after", ...options }).populate(populate || undefined)
            return data
        },

        updateOne: async ({ filter, update, options }) => {
            return await model.updateOne(filter, update, options)
        },

        updateMany: async ({ filter, update, options }) => {
            return await model.updateMany(filter, update, options)
        },

        findOneAndDelete: async ({ filter, options, populate }) => {
            let data = await model.findOneAndDelete(filter, options).populate(populate || undefined)
            return data
        },

        findByIdAndDelete: async ({ id, options, populate }) => {
            let data = await model.findByIdAndDelete(id, options).populate(populate || undefined)
            return data
        },

        deleteOne: async ({ filter, options }) => {
            return await model.deleteOne(filter, options)
        },

        deleteMany: async ({ filter, options }) => {
            return await model.deleteMany(filter, options)
        },

        create: async ({ data }) => {
            return await model.create(data)
        },

        insertMany: async ({ data, options }) => {
            return await model.insertMany(data, options)
        },

        find: async ({ filter, projection, options, populate }) => {
            let data = await model.find(filter, projection, options).populate(populate || undefined)
            return data
        },

        countDocuments: async ({ filter }) => {
            return await model.countDocuments(filter)
        },

        pagination: async ({}) => {
            
        },
    }
}