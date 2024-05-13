import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function Login() {
  // const [username, setUsername] = useState<string>('');
  // const [password, setPassword] = useState<string>('');

  const police_token = localStorage.getItem('police_token');
  const defaultRandomString = Math.random().toString(36).substring(7);
  const [randomString, setRandomString] = useState<string>(defaultRandomString);
  const [randomStringInput, setRandomStringInput] = useState<string>('');

  const [disabledFiveMinutes, setDisabledFiveMinutes] =
    useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (remainingTime > 0) {
      setDisabledFiveMinutes(true);
      const timer = setTimeout(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setDisabledFiveMinutes(false);
      localStorage.removeItem('login_attempt');
    }
  }, [remainingTime]);

  const generateRandomString = () => {
    const randomString = Math.random().toString(36).substring(7);
    setRandomString(randomString);
  };

  const secretKey = 'heart_secretkey';
  if (police_token) {
    return <Navigate to="/" replace={true} />;
  }

  const [errorInput, setErrorInput] = useState<string>('');

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent) => {
    const { name, value } = e.target;

    setCredentials((values) => ({ ...values, [name]: value }));

    console.log(credentials);
  };
  const encrypt = (encrypt: string) => {
    const ciphertext = CryptoJS.AES.encrypt(encrypt, secretKey).toString();

    localStorage.setItem('police_token', ciphertext);
  };

  // reydelshit
  // reydelshitp
  const handleLogin = () => {
    console.log('re');
    if (randomStringInput !== randomString) {
      return setErrorInput('Verification failed. Please try again.');
    }

    const loginAttempt = localStorage.getItem('login_attempt');

    if (!credentials.username || !credentials.password) {
      return setErrorInput('Please fill up all fields.');
    }
    axios
      .get(`${import.meta.env.VITE_POLICE_ASSISTANCE}/login.php`, {
        params: credentials,
      })
      .then((res) => {
        if (res.data.length === 0) {
          if (loginAttempt) {
            const newLoginAttempt = parseInt(loginAttempt) + 1;
            localStorage.setItem('login_attempt', newLoginAttempt.toString());
            if (newLoginAttempt > 3) {
              alert(
                'You have reached the maximum login attempt. Please try again after 1 minute.',
              );
              setDisabledFiveMinutes(true);
              setRemainingTime(20);
            } else {
              alert('Invalid username or password');
            }
          } else {
            localStorage.setItem('login_attempt', '1');
            alert('Invalid username or password');
          }
        } else {
          console.log(res.data);
          encrypt(res.data[0].user_id.toString());
          localStorage.setItem('police_reauth', '0');

          if (res.data[0].user_id) {
            window.location.href = '/home';
          }
        }
      })
      .catch((error) => {
        console.error('Error occurred during login:', error);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="w-fit border-2 p-4 bg-[#125B50] rounded-lg text-white">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-3xl font-bold uppercase">
            POLICE ASSISTANCE MONITORING SYSTEM
          </h1>
          <p className="text-lg">Please login to continue</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 mt-5  w-[40rem] p-4 ">
          <input
            onChange={handleChange}
            type="text"
            placeholder="Username"
            name="username"
            className="p-2 border-2 rounded-md outline-none w-[20rem] text-black"
          />
          <input
            onChange={handleChange}
            type="password"
            placeholder="Password"
            name="password"
            className="p-2 border-2 rounded-md outline-none w-[20rem] text-black"
          />

          <div>
            <div className="flex bg-gray-200 my-4 items-center justify-between rounded-md p-2 text-black">
              <span className="font-semibold text-2xl tracking-[1.5rem]">
                {randomString}
              </span>
              <Button onClick={() => generateRandomString()}>Refresh</Button>
            </div>

            <Input
              className="p-2 border-2 rounded-md outline-none w-[20rem] text-black bg-white"
              type="text"
              onChange={(e) => setRandomStringInput(e.target.value)}
              placeholder="Verify"
              required
            />
          </div>

          <span>
            <a href="/register">Create account</a>
          </span>
          <Button
            disabled={disabledFiveMinutes}
            onClick={handleLogin}
            className={`p-2 bg-white text-black rounded-md w-[10rem] ${
              disabledFiveMinutes && 'cursor-not-allowed'
            }`}
          >
            Login
          </Button>

          {errorInput && (
            <p className="text-red-400 border-2 bg-white p-2 rounded-md font-semibold">
              {errorInput}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
