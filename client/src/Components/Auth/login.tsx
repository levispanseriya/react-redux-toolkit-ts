import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginAsync, selectAuth } from './authSlice';
import styles from './auth.module.scss';

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { error } = useAppSelector(selectAuth);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    setLoading(true);

    dispatch(loginAsync({ username, password }))
      .unwrap()
      .then(() => {
        setLoading(true);
        navigate('/');
        window.location.reload();
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <main className={styles.body}>
        <div className={styles.loginBox}>
          <div className={styles.title}>Login</div>
          <div className={styles.error}>{error}</div>
          <form onSubmit={handleSubmit}>
            <input
              className={styles.loginInput}
              type="text"
              name="username"
              placeholder="Username"
              required
            ></input>
            <input
              className={styles.loginInput}
              type="password"
              name="password"
              placeholder="Password"
              required
            ></input>
            <button className={styles.loginButton}>Log in</button>
            <div className={styles.linkText}>
              Don’t have an account yet?{' '}
              <Link className={styles.link} to="/register">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}