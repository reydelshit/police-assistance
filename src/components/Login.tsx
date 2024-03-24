import axios from 'axios';
import CryptoJS from 'crypto-js';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from './ui/button';

type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

export default function Login() {
  // const [username, setUsername] = useState<string>('');
  // const [password, setPassword] = useState<string>('');

  const police_token = localStorage.getItem('police_token');
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
    if (!credentials.username || !credentials.password)
      return setErrorInput('Please fill in all fields');

    console.log(credentials.username, credentials.password);
    axios
      .get(`${import.meta.env.VITE_POLICE_ASSISTANCE}/login.php`, {
        params: credentials,
      })
      .then((res) => {
        console.log(res.data);
        encrypt(res.data[0].user_id.toString());
        localStorage.setItem('police_reauth', '0');

        if (res.data[0].user_id) {
          window.location.href = '/home';
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
          <span>
            <a href="/register">Create account</a>
          </span>
          <Button
            onClick={handleLogin}
            className="p-2 bg-white  text-black rounded-md w-[10rem]"
          >
            Login
          </Button>

          {errorInput && (
            <p className="text-primary-red border-2 bg-white p-2 rounded-md font-semibold">
              {errorInput}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
