const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT
      movie_name
    FROM
      movie
      ORDER BY
      movie_name;`;
  const moviesArray = await db.all(getMovieQuery);
  response.send(moviesArray);


  app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const {
    directorId,
    movieName,
    leadActor,
   
  } = movieDetails;
  const addMovieQuery = `
    INSERT INTO
      book ()
    VALUES
      (
        '${ directorId}',
         ${movieName},
         ${leadActor},
         
      );`;

  const dbResponse = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});


app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT
      *
    FROM
     movie
    WHERE
      movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(movie);
});



app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const {
      movieId,
    directorId,
    movieName,
    leadActor,
   
  } = movieDetails;
  const updateMovieQuery = `
    UPDATE
      movie
    SET
       movie_id = '${movieId}',
      director_id='${directorId}',
      author_id=${movieName},
      rating=${leadActor},
      
    WHERE
       movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});



app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});



app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `
    SELECT
      *
    FROM
      director
      ORDER BY
     director_id ;`;
  const directorArray = await db.all(getDirectorQuery);
  response.send(directorArray);



  app.get("/directors/:directorId/movies/", async (request, response) => {
  const getDirectorQuery = `
    SELECT
      movie.movie_name AS  movieName 
    FROM
      movie INNER JOIN director ON movie.director_id = director.director_id
      ORDER BY
     movieName;`;
  const directorArray = await db.all(getDirectorQuery);
  response.send(directorArray);

module.exports = app;
