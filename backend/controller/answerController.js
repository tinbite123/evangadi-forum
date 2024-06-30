const db = require('../db/dbConfig');
const { StatusCodes } = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');

const postAnswer = async (req, res) => {
    const { questionid, answer } = req.body
    const userid = req.user.userid

    if (!questionid || !answer) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "please provide all required fields"
        })
    }

    try {
        const answerid = uuidv4()

        await db.query("INSERT INTO answers (answerid, userid, questionid, answer) VALUES (?, ?, ?, ?)", [answerid, userid, questionid, answer])
        return res.status(StatusCodes.CREATED).json({
            message: "answer posted successfully"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some error occurred. Please try again!" 
        })
    }
}

const getAnswers = async (req, res) => {
    const { questionid } = req.params
    console.log("HI",questionid);
    try {
        const allAnswersForQuestion= `
            SELECT username, answer FROM
            answers JOIN users
            ON answers.userid = users.userid
            WHERE answers.questionid = ?`
        
        const [ answers ] = await db.query(allAnswersForQuestion, [questionid])
        return res.status(StatusCodes.OK).json({answers})
    } catch (error) {
        console.log(error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Some error occurred. Please try again!" 
        })
    }
}

module.exports = { postAnswer, getAnswers }