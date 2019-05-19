const users = []

//adduser
const addUser = ({ id, username, room }) => {
    // clean Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: "username and name are required"
        }
    }
    // chech for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'username is in use'
        }
    }
    const user = { id, username, room }
    users.push(user)
    return { user }
}


//removeuser
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

//getuser
const getUser = (id) => {
    return users.find((uservalue) => uservalue.id === id)
}

//getusersinroom

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}