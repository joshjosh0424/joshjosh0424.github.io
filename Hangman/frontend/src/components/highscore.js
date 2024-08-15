import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import ScoreList from "./recordList";

const Highscore = ({ givenNumLetter }, { onReset }) => {
  return (
    <div>
      <h1>Highscore Screen</h1>
      <p>Congratulations! You've made it to the high score screen.</p>
      <Routes>
       <Route exact path="/" element={<ScoreList givenNumber={givenNumLetter} />} />
     </Routes>
      <button onClick={onReset}>Play Again</button>
    </div>
  );
};

export default Highscore;
