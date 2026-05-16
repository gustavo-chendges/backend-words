const User = require('../model/User.js')

async function findUser(field, value){
    const user = await User.findOne({[field]: value}).exec()

    return user
}

async function checkDuplicate(field, value){
    const duplicate = await User.findOne({[field]: value}).lean().exec()

    return duplicate
}

async function createUser(email, username, hashedPassword){

    const userObject = {email, username, "password": hashedPassword}

    const user = await User.create(userObject)

    return user
}

async function updateUserService(){

}

async function deleteUserService(userId){
    const deletedUser = await User.findByIdAndDelete(userId).select('-password').lean()

    return deletedUser
}

function saveUserField(user, field, value){
    user[`${field}`] = value

    return user
}

async function saveUser(user){
    await user.save()

    return user
}

module.exports = {
    findUser,
    checkDuplicate,
    createUser,
    updateUserService,
    deleteUserService,
    saveUserField,
    saveUser
}