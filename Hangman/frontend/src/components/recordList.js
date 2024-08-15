import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
 
const Highscores = (props) => (
 <tr>
   <td>{props.highscore.numLetters}</td>
   <td></td>
   <td></td>
   <td>{props.highscore.score}</td>
   <td></td>
   <td>{props.highscore.player}</td>
 </tr>
);
 
export default function ScoreList({givenNumber}) {
 const [highscores, setScores] = useState([]);
 // This method fetches the records from the database.
 useEffect(() => {
   async function getScores(number=3) {
     const response = await fetch('http://localhost:4000/highscores');
 
     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
     
     let highscores = await response.json();
     highscores = highscores.filter(function (x) {
      return x.numLetters >= number && x.numLetters <= number
     });
     highscores = highscores.sort((a,b) => {
      if (a.score < b.score)
        return -1
     });
     setScores(highscores);
   }
   getScores(givenNumber);
 
   return;
 }, [highscores.length]);
 
 
 // This method will map out the records on the table
 function scoreList() {
   return highscores.slice([0], [10]).map((highscore) => {
     return (
       <Highscores
         highscore={highscore}
         key={highscore._id}
       />
     );
   });
 }
 
 // This following section will display the table with the records of individuals.
 return (
   <div>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Number of Letters</th>
           <th></th>
           <th></th>
           <th>High Score</th>
           <th></th>
           <th>Player</th>
         </tr>
       </thead>
       <tbody>{scoreList()}</tbody>
     </table>
   </div>
 );
}