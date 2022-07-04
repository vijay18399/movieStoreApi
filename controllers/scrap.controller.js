const request = require("request");
const cheerio = require("cheerio");
exports.scrap = (req, res, next) => {
  _id = req.params.movieId;
  const url = `https://www.imdb.com/title/${_id}/`;
  String.prototype.rsplit = function (sep, maxsplit) {
    var split = this.split(sep);
    return maxsplit
      ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit))
      : split;
  };
  request(url, (err, rs, body) => {
    if (err) {
      return res.status(404).send({
        message: "IMBD id " + req.params.movieId + "Not Found",
      });
    } else {
      const $ = cheerio.load(body);
      genres = [];
      directors = [];
      actors = [];
      $("div.sc-18baf029-7").each(function (index) {
        let actor = $(this).find("div:nth-child(2) > a:nth-child(1)").text();
        actors.push(actor);
      });
      $("a.sc-16ede01-3").each(function (index) {
        let genre = $(this).text();
        genres.push(genre);
      });
      $(
        "ul.ipc-metadata-list:nth-child(3) > li:nth-child(1) > div:nth-child(2) > ul > li.ipc-inline-list__item"
      ).each(function (index) {
        let director = $(this).text();
        directors.push(director);
      });
      poster = $(".ipc-media--poster-l > img:nth-child(1)").attr("src");
      if (poster.includes("@.")) {
        poster = poster.rsplit("@.")[0] + "@.jpg";
      } else {
        x = poster.split(".");
        x = x.splice(0, x.length - 2);
        console.log(x.join("."));
        poster = x.join(".") + ".jpg";
        if (poster == "https://m.media-amazon.jpg") {
          poster = "";
        }
      }

      const movie = {
        lq_poster: $(".ipc-media--poster-l > img:nth-child(1)").attr("src"),
        poster: poster,
        runtime: $(".sc-8c396aa2-0 > li:nth-child(3)").text(),
        audience_rating: $(
          ".sc-8c396aa2-0 > li:nth-child(2) > span:nth-child(2)"
        ).text(),
        year: $(".sc-8c396aa2-0 > li:nth-child(1) > span:nth-child(2)").text(),
        name: $(".sc-b73cd867-0").text(), // the name of the movie
        plot: $(".sc-16ede01-0").text(), // the rating of the movie
        genres: genres,
        directors: directors,
        actors: actors,
        rating: $(
          ".sc-910a7330-12 > div:nth-child(1) > div:nth-child(1) > a:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > span:nth-child(1)"
        ).text(),
      };
      res.status(200).json(movie);
    }
  });
};
