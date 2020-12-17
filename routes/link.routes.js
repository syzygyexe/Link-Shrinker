const { Router } = require("express");
const {} = require("express");
const config = require("config");
const shortid = require("shortid");
const Link = require("../models/Link");
const auth = require("../middleware/auth.middleware");

const router = Router();

// auth middleware is protecting our end point from an unauthorized users
router.post("/generate", auth, async (req, res) => {
  try {
    const baseUrl = config.get("baseUrl");
    // Initial link which we receive on our front-end.
    const { from } = req.body;

    // npm extension which generates shortid
    const code = shortid.generate();

    const existing = await Link.findOne({ from });
    // If the unique link already exists, no need to generate short version for it again.
    if (existing) {
      return res.json({ link: existing });
    }

    const to = baseUrl + "/t/" + code;

    const link = new Link({
      code,
      to,
      from,
      owner: req.user.userId,
    });

    await link.save();
    // 201 created
    res.status(201).json({ link });
  } catch (e) {
    // 500 server error
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

// get request to get all links
// auth middleware is protecting our end point from an unauthorized users
router.get("/", auth, async (req, res) => {
  try {
    // Find all links for current user
    // userId is taken from "./auth.routes" const token
    const links = await Link.find({ owner: req.user.userId });
    // return all of them in json format
    res.json(links);
  } catch (e) {
    // 500 server error
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

// get request to get a certain link
// auth middleware is protecting our end point from an unauthorized users
router.get("/:id", auth, async (req, res) => {
  try {
    // Find a certain link for current user
    const link = await Link.findById(req.params.id);
    // return it in json format
    res.json(link);
  } catch (e) {
    // 500 server error
    res.status(500).json({ message: "Something went wrong, try again" });
  }
});

module.exports = router;

