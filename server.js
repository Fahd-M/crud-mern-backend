require('dotenv').config();
const path = require('path');
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .catch((err) => console.log(err));

//DB Schema and Model

const postSchema = mongoose.Schema({
  title: String,
  description: String,
});

const Post = mongoose.model("Post", postSchema);

app.post("/create", (req, res) => {
  Post.create({
    title: req.body.title,
    description: req.body.description,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

//  NOTE: for local Mongo to show this in format {
//         "_id" : ObjectId("638679736d213b15febe6e9b"),
//         "title" : "Test title",
//         "description" : "Test description",
//         "__v" : 0
//        }
// Follow commands/steps in bash: 1)mongo 2)show dbs 3)use myDB 4)show collections 5)db.posts.find().pretty()

app.get("/posts", (req, res) => {
  Post.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});

app.delete("/delete/:id", (req, res) => {
  //console.log(req.params); would give { id: abc }
  Post.findByIdAndDelete({ _id: req.params.id })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.put("/update/:id", (req, res) => {
  //console.log(req.params) gives { id: 'abc' }
  //console.log(req.body) gives { _id: 'abc', title: 'new post title', description:'new description', __v:0}

  Post.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      description: req.body.description,
    }
  )
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

//if in production environment we want express to use static client files and send main index.html file
// if (process.env.NODE_ENV === 'production'){
//   app.use(express.static("client/build"));
//   app.get("*", (req,res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// };

app.listen(process.env.PORT || 3001, function () {
  console.log(`Server is running`);
});
