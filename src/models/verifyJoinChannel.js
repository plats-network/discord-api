 const verifyJoinChannel = (id) =>  {
    return `SELECT * FROM users WHERE id = '${id}'`
}

module.exports = verifyJoinChannel