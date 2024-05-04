const express = require("express");
const router = express.Router();
const Listing = require("../modeles/listings.js");
const wrapAsync    = require("../utils/wrapAsync.js");  
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn,isOwner, validateListing} = require("../middelware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })




router.route("/")
 // Index rout
 .get(wrapAsync(listingController.index))
 // creat Rout 
.post(isLoggedIn,
   upload.single('listing[image]'), 
   validateListing,
   
   wrapAsync( listingController.creatListing)  );

// New Rout
   router.get("/new", isLoggedIn,listingController.renderNewForm);
   
   router.route("/:id")
   // show Rout
   .get( wrapAsync( listingController.showListing))
    //update rout
   .put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing,  wrapAsync(listingController.updetListing))
   // delete rout
   .delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));
   
   //edit rout
   router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync( listingController.renderEditForm));
   
  module.exports = router;