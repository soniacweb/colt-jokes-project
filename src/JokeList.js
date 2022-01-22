import React, { useState, useEffect } from "react";

import axios from "axios";
import Joke from "./Joke";
import "./Jokelist.css";
import { v4 as uuidv4 } from "uuid";

const JokeList = ({ numJokes }) => {
  const [jokes, setJokes] = useState(
    JSON.parse(window.localStorage.getItem("jokes") || "[]")
  );
  const [loading, setLoading] = useState(false);
  let seenJokes = new Set(jokes.map((joke) => joke.text));
  console.log(seenJokes);

  const dadJokes = async () => {
    let jokesArray = [];
    if (jokesArray.length === 0) {
      try {
        while (jokesArray.length < numJokes) {
          let jokeRes = await axios.get("https://icanhazdadjoke.com/", {
            headers: { Accept: "application/json" },
          });
          let newJoke = jokeRes.data.joke;
          if (!seenJokes.has(newJoke)) {
            jokesArray.push({ id: uuidv4(), text: newJoke, votes: 0 });
            console.log(jokesArray);
          } else {
            console.log("FOUND A DUPLICATE!");
            console.log(newJoke);
          }
        }
        setJokes([...jokesArray, { votes: 0 }]);
        setLoading(false);
        setJokes(() => [...jokes, ...jokesArray]);
      } catch (e) {
        console.log(`Axios request failed! : ${e}`);
        setLoading(false);
        return e;
      }
    }
  };

  // creating a new object if its equal to the id passed in containing old jokes (previous state) and updating the votes
  const handleVote = (id, delta) => {
    setJokes(() =>
      jokes.map((joke) =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    );
  };

  useEffect(() => {
    window.localStorage.setItem("jokes", JSON.stringify(jokes));
  });

  const handleClick = () => {
    setLoading(true);
    dadJokes();
  };

  let orderedJokes = jokes.sort((a, b) => b.votes - a.votes);

  if (loading) {
    return (
      <div className="JokeList-spinner">
        <i className="far fa-8x fa-laugh fa-spin" />
        <h1 className="JokeList-title">Loading...</h1>
      </div>
    );
  } else
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad </span>Jokes
          </h1>
          <img
            src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg"
            alt="emoji smile"
          ></img>
          <button className="JokeList-getmore" onClick={handleClick}>
            Fetch jokes
          </button>
        </div>

        <div className="JokeList-jokes">
          {orderedJokes.map((joke) =>
            joke.text ? (
              <Joke
                key={joke.id}
                votes={joke.votes}
                text={joke.text}
                upVote={() => handleVote(joke.id, 1)}
                downVote={() => handleVote(joke.id, -1)}
              />
            ) : (
              ""
            )
          )}
        </div>
      </div>
    );
};

JokeList.defaultProps = {
  numJokes: 7,
};

export default JokeList;
