const expect = require("chai").expect;
const app = require("../app");
const request = require("supertest")(app);

describe("GET /suggestions", function() {
  describe("with a non-existent city", function() {
    let response;

    before(function(done) {
      request
        .get("/suggestions?q=SomeRandomCityInTheMiddleOfNowhere")
        .end(function(err, res) {
          response = res;
          response.json = JSON.parse(res.text);
          done(err);
        });
    });

    it("returns a 404", function() {
      expect(response.statusCode).to.equal(404);
    });

    it("returns an empty array of suggestions", function() {
      expect(response.json.suggestions).to.be.instanceof(Array);
      expect(response.json.suggestions).to.have.length(0);
    });
  });

  describe("with a valid city", function() {
    let response;

    before(function(done) {
      request.get("/suggestions?q=london").end(function(err, res) {
        response = res;

        response.json = JSON.parse(res.text);
        done(err);
      });
    });

    it("returns a 200", function() {
      expect(response.statusCode).to.equal(200);
    });

    it("returns an array of suggestions", function() {
      expect(response.json.suggestions).to.be.instanceof(Array);
      expect(response.json.suggestions).to.have.length.above(0);
    });

    it("contains a match", function() {
      expect(response.json.suggestions).to.satisfy(function(suggestions) {
        return suggestions.some(function(suggestion) {
          return suggestion.name.match(/london/i);
        });
      });
    });

    it("contains latitudes and longitudes", function() {
      expect(response.json.suggestions).to.satisfy(function(suggestions) {
        return suggestions.every(function(suggestion) {
          return suggestion.latitude && suggestion.longitude;
        });
      });
    });
    it("contains scores", function() {
      expect(response.json.suggestions).to.satisfy(function(suggestions) {
        return suggestions.every(function(suggestion) {
          return suggestion.score;
        });
      });
    });
  });
});
