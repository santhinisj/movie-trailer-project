const express = require("express");
const path = require("path");
const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || "8880";

const imdb = "https://imdb-api.com/en/API";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//set up static path (for use with CSS, client-side JS, and image files)
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

const getMovieDetails = async (name) => {
  let response = await axios({
    url: `${imdb}/Search/${process.env.IMDB_API_KEY}/${name}`,
    method: "get",
  });

  let movie = response.data.results[0];

  return movie;
};

const getTrailerOfTheMovie = async (movie) => {
  let response = await axios({
    url: `${imdb}/YouTubeTrailer/${process.env.IMDB_API_KEY}/${movie.id}`,
    method: "get",
  });
  console.log("TRAILER - - - - -> \n", response.data);

  let trailer = response.data;
  return trailer;
};

const getReviewsOfTheMovie = async (movie) => {
  let response = await axios({
    url: `${imdb}/Reviews/${process.env.IMDB_API_KEY}/${movie.id}`,
    method: "get",
  });

  let reviews = response.data.items;
  console.log(reviews);
  return reviews;
};

app.get("/search", async (req, res) => {
  const searchquery = req.query.search;
  const movie = await getMovieDetails(searchquery);
  const trailer = await getTrailerOfTheMovie(movie);
  const reviews = await getReviewsOfTheMovie(movie);
  trailer.videoUrl = `https://www.youtube.com/embed/${
    trailer.videoUrl.split("?v=")[1]
  }?autoplay=1&origin=http://example.com"`;
  res.render("search", { movie, trailer, reviews });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

//HTTP server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
