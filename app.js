const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/skillsDB", {useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
}


const Language = mongoose.model("Language", articleSchema);

// 

app.route("/articles")

.get(function(req,res) {
    Language.find(function(err,results) {
        if(!err) {
        res.send(results)
        }
        else {
            res.send(err)
        }
    })
})
.post(function(req,res) {
    const newSkill = new Language({
        title: req.body.title,
        content: req.body.content
    })
    newSkill.save(function(err) {
        if(!err) {
            res.send("New skill is written to the database")
        }
        else {
            res.send(err)
        }
    })
})
.delete(function(req,res) {
    Language.deleteMany(function(err) {
        if(!err) {
            res.send("All documents are deleted from collection!")
        }
        else {
            res.send(err)
        }
    })
});

// Route for specific endpoints

app.route("/articles/:skillName")
.get(function(req,res) {
    
    Language.findOne({title: req.params.skillName}, function(err,foundSkill) {
        if(foundSkill) {
            res.send(foundSkill)
        }
        else {
            res.send("I don't have skill you are searching for. May be in the future?")
        }
    })
})
.put(function(req,res) {
    Language.update(
        {title:req.params.skillName},
        {
            title:req.body.title,
            content: req.body.content
        },
        {overwrite: true},
        function(err,results){
            if(results){
                res.send("Document is updated successfully");
            }
            else{
                res.send("Error happened during update")
            }
        }
    )
})
.patch(function(req,res) {
    Language.update(
        {title:req.params.skillName},
        {$set: req.body},
        function(err,results){
            if(results){
                res.send("Your update is executed")
            }
            else{
                res.send(err)
            }
        }
    )
})
.delete(function(req,res) {
    Language.deleteOne(
        {title: req.params.skillName},
        function(err) {
            if(!err) {
                res.send("Document is deleted successfully")
            }
            else{
                res.send("Error happened!")
            }
        })
    }
    )



app.listen(3000, function() {
  console.log("Server started on port 3000");
});