import React, {useEffect, useState, useRef} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { HiArrowCircleRight } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import axios from '../axios';
import { useAppData } from '../App'

function PostAnswer() {
    const navigate = useNavigate();

    const { state, dispatch } = useAppData();

    const token = localStorage.getItem("token");
    const { id } = useParams();

    const [ answer, setAnswer ] = useState([])

    const [ questions, setQuestions ] = useState([])

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const  inputDom = useRef();

    const fetchQuestions = async () => {
        try {
            const { data } = await axios.get(`/questions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setQuestions(data.question)
        } catch ({ response}) {
            localStorage.setItem("token", "")
            dispatch({ 
                type: "LOGOUT" 
            })
            navigate("/")
            console.log(response.data);
        }
    };

    const fetchAnswers = async () => {
        try {
            const { data } = await axios.get(`/answers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            setAnswer(data.answers)
        } catch ({ response}) {
            localStorage.setItem("token", "")
            console.log(response.data);
            dispatch({ 
                type: "LOGOUT" 
            })
            navigate("/")
        }
    };

    const PostAnswer = async e => {
        setMessage("")
        inputDom.current.style.backgroundColor = "#fff"
        const value = inputDom.current?.value
        e.preventDefault();
        if (!value) {
            inputDom.current.style.backgroundColor = "#fee6e6"
            inputDom.current.focus();
            return;
        }
        try {
            setLoading(true)
            const { data } = await axios.post(
                `/answers`, 
                {
                    questionid: id, 
                    answer: value,
            }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        setLoading(false)
        inputDom.current.style.backgroundColor = "#fff"
        inputDom.current.value = ""
        setMessage("Answer posted successfully")
        setTimeout(() => {
            setMessage("")
        }, 5173)
        fetchAnswers();
    } catch ({ response }) {
            setMessage("")
            setLoading(false)
            inputDom.current.style.backgroundColor = "#fff"
            localStorage.setItem("token", "");
            dispatch({ type: "LOGOUT" })
            navigate("/");
                console.log(response.data);
        } 
    };
    
    useEffect(() => {
        fetchQuestions();
        fetchAnswers();
    }, []);

    return (
        <Wrapper>
            <div className='container'>
                <div className='question mb-5'>
                    <h2 className='mb-3'>QUESTION</h2>
                    <div className='title mb-2 text'>
                        <span>
                            <HiArrowCircleRight />
                        </span>
                            {questions[0]?.title}
                            <div className='line'></div>
                        </div>
                        <div className='description'>
                        <p>{questions[0]?.description}</p>
                    </div>
                    <hr />
                    <h1>Answers from the community</h1>
                    <hr />
                    <div className='answer-container my-5 w-md-75 mx-auto'>
                        {answer.map((el, i) => {
                            return (
                                <div key={i} className='row'>
                                    <div className='col-3 col-md-2 col-lg-1 user'>
                                        <FaUser />
                                    </div>
                                    <div className='username'>
                                        {el.username}
                                    </div>
                                    <div className='col-md-9 col-8'>
                                        <p className='answer'>{el.answer}</p>
                                    </div>
                                    <hr className='w-75 mt-2'/>
                                </div>
                            )
                        })}
                    </div>
                    <div className='post mx-auto w-md-75 '>
                        <p className='text-success '>{message}</p>
                        <form onSubmit={PostAnswer}>
                            <textarea
                                ref={inputDom}
                                rows={5}
                                placeholder='Your Answer ...'
                                className=' w-100 px-3 pt-3 d-block mb-3'
                            ></textarea>
                            <button disabled={loading} className='btn btn-primary'>
                                POST ANSWER
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.section `
    background-color: #fafafa;
    padding-top: 120px;
    padding-bottom: 50px;

    .question {
        .title {
            span {
                font-size: 2.2rem;
                margin-right: 5px;
                color: #516cf0;
            }
            color: #482602;
            font-weight: 900;
            font-family: cursive;
            font-size: 1.6rem;
            text-transform: capitalize;
            .line {
                height: 3px;
                background-color: #fe8082;
                margin-left: 50px;
                width: 180px;
            }
        }
        .description {
            margin-left: 45px;
            font-weight: 600;
            font-size: #1.2rem;
            font-family: monospace;
        }
    }
    .answer-container {
        border-radius: 2px;
        box-shadow: inset 2px 1px 2px rgba(170, 174, 197, 0.2);
        background-color: #f5f5f5;
        padding-left: 25px;
        max-height: 300px;
        overflow-y: scroll;
        .avatar {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            color: white;
            background-color: #022553;
        }
        .username {
            font-size: 0.8rem;
        }
    }
    textarea {
        border: 0.5px solid #35355e;
        border-radius: 5px;
    }
`;

export default PostAnswer
