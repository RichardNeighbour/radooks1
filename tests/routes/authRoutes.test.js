const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const expect = chai.expect;
const User = require("../../models/User");

chai.use(chaiHttp);

describe("Authentication Routes", function() {
  before(async function() {
    // Ensure the test user does not exist before starting tests
    await User.deleteMany({ username: "testUser" });
  });

  after(async function() {
    // Clean up by deleting the test user after tests complete
    await User.deleteMany({ username: "testUser" });
  });

  it("should register a new user and return 200 status", function(done) {
    chai.request(server)
      .post("/auth/register")
      .send({username: "testUser", password: "password"})
      .end(function(err, res) {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "User registered successfully");
        done();
      });
  });

  it("should login the user and return a success message", function(done) {
    chai.request(server)
      .post("/auth/login")
      .send({username: "testUser", password: "password"})
      .end(function(err, res) {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "User logged in successfully");
        done();
      });
  });

  it("should logout the user and return a redirect status", function(done) {
    chai.request(server)
      .get("/auth/logout")
      .end(function(err, res) {
        if (err) done(err);
        expect(res).to.have.status(302); // Assuming logout redirects to the login page or another page
        done();
      });
  });
});