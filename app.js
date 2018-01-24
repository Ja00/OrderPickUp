var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
var Item = require("./models/item");
var Comment = require("./models/comment");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

app.use(express.static(__dirname));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/order_pickup", {useMongoClient: true});
mongoose.Promise = global.Promise;


    
var cart = [];

app.get("/", function(req, res) {
   res.render("homepage");
});


app.get("/create", function(req, res) {
   res.render("create"); 
});

app.post("/create", function(req, res) {
//   console.log(req.body.item);
    Item.create(req.body.item, function(err, newItem) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/menu");
        }
    });
});


app.get("/menu", function(req, res){
    Item.find({}, function(err, items) {
       if(err) {
           console.log(err);
       } else {
           res.render("menu", {items: items});
       }
    });
});
//add item to cart ROUTE
app.post("/item/:id/add", function(req, res) {
    //add cart logic
    Item.findById(req.params.id, function(err, foundItem) {
        if(err) {
            console.log(err);
        } else {
            var order = {
                item: foundItem,
                number: req.body.number
            }
            cart.push(order);
            //tell user added successfully
            res.redirect("/menu");
        }
    });

});

//New comment page 
app.get("/item/:id/comments/new", function(req, res) {
    Item.findById(req.params.id, function(err, foundItem) {
        if(err) {
            console.log(err);
        } else {
            res.render("newcomment", {item: foundItem}); 
        }
    });
});

//Create New Comment ROUTE
app.post("/item/:id/comments", function(req, res) {
    
    Comment.create(req.body.comment, function(err, comment) {
       if(err) {
           console.log(err);
       } else {
           Item.findById(req.params.id, function(err, foundItem) {
              if(err) {
                  console.log(err);
              } else {
                  foundItem.comments.push(comment);
                  foundItem.save(function(err, data) {
                      if(err) {
                          console.log(err);
                      } else {
                          res.redirect("/item/" + foundItem._id);
                      }
                  })
              }
           });
       }
    });
    
    // Item.findById(req.params.id, function(err, foundItem) {
    //   if(err) {
    //       console.log(err);
    //   } else {
    //       console.log(req.body.comment);
    //       Comment.create(req.body.comment, function(err, comment) {
    //           if(err) {
    //               console.log(err);
    //           } else {
    //               console.log(comment);
    //               comment.save();
    //               foundItem.comments.push(comment);
    //               foundItem.save();
    //               res.redirect("/item/" + foundItem._id);
    //           }
    //       });
    //   }
    // });
});

app.get("/viewcart", function(req, res) {
    res.render("cart", {cart: cart});
});
//when using DB, it will be changed to :id
app.get("/item/:id", function(req, res) {
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem) {
        if(err) {
            console.log(err);
        } else {
            console.log(foundItem.comments);
            res.render("show", {item: foundItem});
        }
    });
});

//EDIT ROUTE
app.get("/item/:id/edit", function(req, res) {
   Item.findById(req.params.id, function(err, foundItem) {
      if(err) {
          console.log(err);
      } else {
          res.render("edit", {item: foundItem});
      }
   }); 
});


//UPDATE ROUTE
app.put("/item/:id", function(req, res) {
  Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem) {
      if(err) {
          res.redirect("menu");
          console.log("update failed");
      } else {
          res.redirect("/item/" + updatedItem._id);
      }
  });
});



app.get("/paid", function(req, res) {
    //might need to create an order Collection in DB, to track the info of it,
    //so that the app can provide waiting-time to the user.
   res.render("paid"); 
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("CONNECTED!"); 
});