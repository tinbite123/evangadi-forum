import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../axiosConfige'

function login() {
    const emailDom = useRef();
    const passwordDom = useRef();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault()
        const email = emailDom.current.value
        const password = passwordDom.current.value
        if (
            !email ||
            !password
        ) {
            alert("please provide all required information")
            return;
        }
        try {
            const {data} = await axios.post('/users/login', {
                email: emailValue,
                password: passwordValue,
            })
            alert("login successfully")
            navigate('/')

            localStorage.setItem('token', data.token)
             
            console.log(response);
        } catch (error) {
            alert(error?.response?.data?.msg)
            console.log(error.response.data);
        }
    }

    return (
        <section>
            <form onSubmit={handleSubmit}>
                <div>
                    <span>email :---</span>
                    <input
                    ref={emailDom}
                    type="email" 
                    placeholder='email' 
                    />
                </div>
                <br />
                <div>
                    <span>password :---</span>
                    <input 
                        ref={passwordDom}
                        type="password" 
                        placeholder='password' 
                    />
                </div>
                <br />
                <button type="submit">Login</button>
            </form>
            <Link to="/register">register</Link>
        </section>
        )
}

export default login