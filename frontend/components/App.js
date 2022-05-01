import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";
import { axiosWithAuth } from "../axios";
const axiosAuth = axiosWithAuth();

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */ navigate("/");
  };
  const redirectToArticles = () => {
    /* ✨ implement */ navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage("");
    setSpinnerOn(true);
    // and launch a request to the proper endpoint.
    axios
      .post(`http://localhost:9000/api/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        // On success, we should set the token to local storage in a 'token' key,
        localStorage.setItem("token", res.data.token);
        // put the server success message in its proper state, and redirect
        // to the Articles screen. Don't forget to turn off the spinner!
        setMessage(res.data.message);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => console.log({ err }));
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage("");
    setSpinnerOn(true);
    // and launch an authenticated request to the proper endpoint.
    axiosAuth
      .get("http://localhost:9000/api/articles")
      // On success, we should set the articles in their proper state and
      // put the server success message in its proper state.
      .then((res) => {
        console.log("articles", res);
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      // If something goes wrong, check the status of the response:
      // if it's a 401 the token might have gone bad, and we should redirect to login.
      // Don't forget to turn off the spinner!
      .catch((err) => console.log(err))
      .finally(() => setSpinnerOn(false));
  };

  const postArticle = (article) => {
    // ✨ implement
    setMessage("");
    setSpinnerOn(true);
    // The flow is very similar to the `getArticles` function.
   return axiosAuth
      .post("http://localhost:9000/api/articles", article)
      .then((res) => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
      })
      .finally(() => setSpinnerOn(false));
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    return axiosAuth
      .put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then((res) => {
        setArticles(
          articles.map((art) =>
            art.article_id === article_id ? res.data.article : art
          )
        );
        setMessage(res.data.message);
      })
      .finally(() => setSpinnerOn(false));
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setMessage("");
    setSpinnerOn(true);
    axiosAuth
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((res) => {
        console.log(res);
        setMessage(res.data.message);
        setArticles(articles.filter((art) => art.article_id !== article_id));
      })
      .catch((err) => console.log(err))
      .finally(() => setSpinnerOn(false));
  };

  const currentArticle = articles.find(
    (art) => art.article_id === currentArticleId
  );

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  currentArticle={currentArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
                <Articles
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  currentArticleId={currentArticleId}
                  setCurrentArticleId={setCurrentArticleId}
                  articles={articles}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  );
}
