import  {useRef} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import axios from '../axiosConfige'

function register() {
    const navigate  = useNavigate()
    const usernameDom = useRef()
    const firstnameDom = useRef()
    const lastnameDom = useRef()
    const emailDom = useRef()
    const passwordDom = useRef()

    async function handleSubmit(e) {
        e.preventDefault()
        const username = usernameDom.current.value
        const firstname = firstnameDom.current.value
        const lastname = lastnameDom.current.value
        const email = emailDom.current.value
        const password = passwordDom.current.value
        if (
            !username ||
            !firstname ||
            !lastname ||
            !email ||
            !password
        ) {
            alert("please provide all required information")
            return;
        }
        try {
            await axios.post('/users/register', {
                username: usernameValue ,
                firstname: firstnameValue,
                lastname: lastnameValue,
                email: emailValue,
                password: passwordValue,
            })
            alert("register success, please login")
            navigate('/login')
        } catch (error) {
            alert("something went wrong!")
            console.log(error.response);
        }
    }
    return (
    <section>
        <form onSubmit={handleSubmit}>
            <div>
                <span>username :---</span>
                <input 
                    ref={usernameDom}
                    type="text" 
                    placeholder='username' 
                />
            </div>
            <br />
            <div>
                <span>firstname :---</span>
                <input 
                    ref={firstnameDom}
                    type="text" 
                    placeholder='firstname' 
                />
            </div>
            <br />
            <div>
                <span>lastname :---</span>
                <input 
                    ref={lastnameDom}
                    type="text" 
                    placeholder='lastname' 
                />
            </div>
            <br />
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
                    ref={passwordDom }
                    type="password" 
                    placeholder='password' 
                />
            </div>
            <br />
            <button type="submit">register</button>
        </form>
        <Link to="/login">login</Link>
    </section>
  )
}

export default register