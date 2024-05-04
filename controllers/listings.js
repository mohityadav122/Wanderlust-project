const Listing = require("../modeles/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index =  async (req,res)=>{ 
    allListings = await Listing.find({});
    res.render("listingsIndex.ejs",{allListings});
   };

   module.exports.renderNewForm = async(req,res)=>{
    
    res.render("listingsNew.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews" , populate:{path: "author"},}).populate("owner");
    if(!listing){
     req.flash("error","your Listing does not exist !");
     res.redirect("/listings");
    }
    
    res.render("listingsShow.ejs",{listing});
};

module.exports.creatListing = async(req,res,next)=>{
 let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
    
  
  let url = req.file.path;
  let filename = req.file.filename;
  
   let listing = req.body.listing;
   let newListing = new Listing( listing);

   newListing.owner = req.user._id;
   newListing.image = {url , filename};

   newListing.geometry = response.body.features[0].geometry;

     await newListing .save();
    
   req.flash("success","New Listing created !");
   res.redirect("/listings");
   };

   module.exports.renderEditForm= async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let orginalImageUrl = listing.image.url;
    orginalImageUrl = orginalImageUrl.replace("/upload", "/upload/h_300,w_250");

    res.render("listingsEdit.ejs",{listing,orginalImageUrl});
};

module.exports.updetListing = async(req,res)=>{
    let {id} = req.params;
   
      let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
      if(typeof req.file !== "undefined"){ 
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url , filename};
      await listing.save();
      }
     req.flash("success","Listing Updeted !");
    res.redirect(`/listings/${id}`);
    };

    module.exports.destroyListing = async (req,res)=>{
        let {id} = req.params;
        let deleteListing = await Listing.findByIdAndDelete(id);
        
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
    };