const {secret} = require("../userConfig")
const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded.id;

    } catch (err) {

        console.error('Invalid token');
        return null;
    }
};

module.exports = decodeToken;
