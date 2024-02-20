const addUser = (id, user_name, discriminator, time_joined) =>  {
    return `
    INSERT INTO users (id, user_name, discriminator, time_joined) VALUES ('${id}', '${user_name}','${discriminator}', '${time_joined}')`
}

module.exports = addUser;