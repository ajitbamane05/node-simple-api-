const express = require("express");
const router = express.Router();
const userService = require("./user.service");
const auth = require("./authorizationmiddleware");
const IP = require("ip");

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/", auth, getAll);
router.get("/current", auth, getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);
router.post("/logout/:id", logout);

module.exports = router;

function authenticate(req, res, next) {
  const ipAddress = IP.address();
  const clientIp = ipAddress;
  const username = req.body.username;
  const password = req.body.password;

  userService
    .authenticate({ username, password, clientIp })
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}
function logout(req, res, next) {
  userService
    .logout(req.params.id)
    .then((message) => {
      message ? res.send(message) : res.status(400);
    })
    .catch((err) => next(err));
}
function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
