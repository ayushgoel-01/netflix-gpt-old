import React, { useState , useRef } from 'react'
import Header from './Header'
import { checkValidData } from '../utils/validate';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword , updateProfile } from "firebase/auth";
import { auth } from '../utils/firebase';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice'; 
import { USER_AVATAR } from '../utils/constants';

const Login = () => {

    const [isSignInForm,setIsSignInForm] = useState(true);
    const [errorMessage,setErrorMessage] = useState(null);
    const dispatch = useDispatch();

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);

    const handleButtonClick = () =>{
        // Validate the form data

        const message = checkValidData(email.current.value,password.current.value);
        setErrorMessage(message);
        if(message) return;

        // Sign in / Sign up Logic
        
        if(!isSignInForm){
            createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then((userCredential) => {
                const user = userCredential.user;

                updateProfile(user, {
                    displayName: name.current.value, photoURL: USER_AVATAR
                  })
                  .then(() => {
                    const {uid,email,displayName,photoURL} = auth.currentUser;
                dispatch(addUser({uid: uid, email: email, displayName: displayName, photoURL: photoURL}));
                  })
                  .catch((error) => {
                    setErrorMessage(error.message);
                  });
                
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorCode+" "+errorMessage);
            });
        }
        else{
            signInWithEmailAndPassword(auth, email.current.value, password.current.value)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMessage(errorCode+" "+errorMessage);
            });
        }
    }

    const toggleSignInFoem = () =>{
        setIsSignInForm(!isSignInForm);
    };

  return (
    <div>
        <Header/>

        <div className='absolute'>
            <img src='https://assets.nflxext.com/ffe/siteui/vlv3/04bef84d-51f6-401e-9b8e-4a521cbce3c5/null/IN-en-20240903-TRIFECTA-perspective_0d3aac9c-578f-4e3c-8aa8-bbf4a392269b_large.jpg'></img>
        </div>

        <form onSubmit={(e) => e.preventDefault()}
        className='w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80'>

            <h1 className='font-bold text-3xl py-4'>{isSignInForm ? "Sign In" : "Sign Up"}</h1>

            {!isSignInForm &&
            <input ref={name} type='text' placeholder='Full Name' className='p-4 my-4 w-full bg-gray-500'/>}

            <input ref={email} type='text' placeholder='Email Address' className='p-4 my-4 w-full bg-gray-500'/>

            <input ref={password} type='password' placeholder='Password' className='p-4 my-4 w-full bg-gray-500'/>

            <p className='text-red-600 text-lg py-3'>{errorMessage}</p>

            <button className='p-4 my-6 bg-red-700 w-full rounded-lg' onClick={handleButtonClick}>
                {isSignInForm ? "Sign In" : "Sign Up"}
            </button>

            <p className='py-4 cursor-pointer' onClick={toggleSignInFoem}>
                {isSignInForm ? " New to Netflix? Sign Up Now" : "Already registered? Sign In Now"}
            </p>

        </form>

    </div>
  )
}

export default Login