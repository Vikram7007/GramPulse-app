const express = require("express");
const router = express.Router();

// destructuring import (IMPORTANT)
const {
  GramSabhaNotices,getdataGramSabha
} = require("../controllers/gramsabhanotice");

const {Villagelogin,VillageSignup,VillageChangePassword}=require("../controllers/VillageAuth");
const {signupGramSevak,loginGramSevak}=require("../controllers/GramsevakAuth")
// POST : Insert Gram Sabha Notice
router.post("/SabhaNotice", GramSabhaNotices);
router.get("/gramsabhanotices",getdataGramSabha)
router.post("/sarpanchlogin",Villagelogin);
router.post("/sarpanchSignup",VillageSignup)
router.put("/sarpanch/password",VillageChangePassword);
router.post("/signup",signupGramSevak);
router.post("/login",loginGramSevak)

module.exports = router;











