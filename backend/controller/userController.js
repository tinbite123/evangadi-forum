// db controller

const dbConnection = require('../db/dbConfig');

const bcrypt = require('bcrypt');
const { StatusCodes } = require('http-status-codes');

const jwt = require('jsonwebtoken')


async function register(req, res) {
    const { username, firstname, lastname, email, password } = req.body;

    if (!email || !password || !firstname || !lastname || !username) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "please provide all required fields"})
    }

    try {
        const [user] = await dbConnection.query("select username, userid from users where username = ? or email = ?", [username, email])
        if (user.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "user already existed"})
        }
        if (password.length<8) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "password must be at least 8 characters"})
        }

        // encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await dbConnection.query("INSERT INTO users (username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)", [username, firstname, lastname, email, hashedPassword])
        const [registerdUser] = await dbConnection.query("select username,userid from users where username = ? or email =? ", [username, email])

        const token = jwt.sign({ username: registerdUser[0].username, userid: registerdUser[0].userid }, process.env.JWT_SECRET,{ expiresIn: '1d' })

        //const token = createToken(registerdUser[0].username, registerdUser[0].userid);
        return res.status(StatusCodes.CREATED).json({ msg: "user created successfully", username: registerdUser[0].username, token });

    } 
    catch (error) {
        console.log(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "something went wrong, try again later!" })
    }
}

async function login(req, res) {   
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({message: "please provide all required fields"})
    }
    try { 
        const [user] = await dbConnection.query("select username, userid, password from users where email = ?", [email])
        if (user.length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "invalid credentials"});
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user[0].password)
        if (!isMatch) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: "invalid credentials password"});
        }

        const username = user[0].username
        const userid = user[0].userid
        const token = jwt.sign({ username, userid }, process.env.JWT_SECRET,{ expiresIn: '1d' })

        return res.status(StatusCodes.OK).json({ message: "user logged in successfully", token, username })

    }
    catch (error) {
        console.log(error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "something went wrong, try again later!" })
    }
}

async function checkUser(req, res) {
    const username = req.user.username
    const userid = req.user
    res.status(StatusCodes.OK).json({message: "vaild user", username, userid})
}

module.exports = {
    register,
    login,
    checkUser
}