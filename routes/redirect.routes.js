const { Router } = require("express");
const Link = require("../models/Link");
const router = Router();

router.get("/:code", async (req, res) => {
  try {
    // Unique code link must match req.params.code in our URL.
    const link = await Link.findOne({ code: req.params.code });

    if (link) {
      // Add to 1 link count
      link.clicks++;
      // Save changes
      await link.save();
      // Redirect to an initial link
      return res.redirect(link.from);
    }
    console.log(link);
    res.status(404).json("Link is not found");
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
