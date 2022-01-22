import React, { useState, useEffect } from "react";

import axios from "axios";
import Joke from "./Joke";
import "./Jokelist.css";
import { v4 as uuidv4 } from "uuid";

const JokeList = ({ numJokes }) => {
  // const [jokes, setJokes] = useState([{ votes: 0, text: "" }]);
  const [jokes, setJokes] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return jokes.length === 0 && dadJokes();
  });

  const dadJokes = async () => {
    let jokes = [];
    try {
      while (jokes.length < numJokes) {
        let jokeRes = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" },
        });
        let newJoke = jokeRes.data.joke;
        // if (!seenJokes.has(newJoke)) {
        jokes.push({ id: uuidv4(), text: newJoke, votes: 0 });
        // } else {
        //   console.log("FOUND A DUPLICATE!");
        //   console.log(newJoke);
        // }
      }

      setJokes([...jokes, { votes: 0 }]);
      setLoading(false);
    } catch (e) {
      console.log(`Axios request failed! : ${e}`);
      setLoading(false);
      return e;
    }
  };

  dadJokes();

  // creating a new object if its equal to the id passed in containing old jokes (previous state) and updating the votes
  const handleVote = (id, delta) => {
    setJokes(() =>
      jokes.map((joke) =>
        joke.id === id ? { ...joke, votes: joke.votes + delta } : joke
      )
    );
  };

  // console.log("jokessss", jokes);

  const handleClick = () => {
    setLoading(true, dadJokes);
  };

  //   let orderedJokes = jokes[0].sort((a, b) => b.votes - a.votes);
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
          {jokes.map((joke) =>
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
