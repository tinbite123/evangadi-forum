const express = require('express')
const router = express.Router()

const { postAnswer, getAnswers } = require('../controller/answerController')

// get answers for a Question
router.get("/:questionid", getAnswers)

// post answer for a Question
router.post("/", postAnswer)

module.exports = router