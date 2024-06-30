const db = require('../db/dbConfig');
const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');

const postQuestion = async (req, res) => {
    const { title, description } = req.body
    console.log(title, description);
    if (!title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "all fields required"
        })
    }
    try {
        const questionid = uuidv4()

        await db.query("Insert into questions (questionid, title, description, userid) VALUES (?, ?, ?, ?)", [questionid, title, description, req.user.userid])
        return res.status(StatusCodes.CREATED).json({message: "Question added successfully"})
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some error occurred. Please try again!" })
    }
}

const allQuestions = async (req, res) => {
    try {
        const [questions] = await db.query(`SELECT title, description, questionid, username FROM questions JOIN users ON users.userid = questions.userid ORDER BY id DESC `)
        return res.status(StatusCodes.OK).json({ questions })
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some error occurred. Please try again!" 
        })
    }
}


const singleQuestion = async (req, res) => {
    const id = req.params.id
    try {
        const [question] = await db.query(`SELECT * FROM questions WHERE questionid = ?`, [id])
        if (question.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "question not found"})
        }
        return res.status(StatusCodes.OK).json({ question })
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some error occurred. Please try again!" })
    }
}

module.exports = {  allQuestions, singleQuestion, postQuestion }