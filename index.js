import mongoose from "mongoose";
import express from "express";
import bodyParser from 'body-parser';

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

const articleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.route("/articles").get(async (req, res) => {
    try {
        const articles = await Article.find();

        res.send(articles);
    } catch (err) {
        res.status(500).send(err);
    }
}).post(async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    try {
        const article = new Article({
            title: title,
            content: content
        });
    
        article.save();
    
        res.send(article);
    } catch (err) {
        res.status(500).send(err);
    }
}).delete(async (req, res) => {
    try {
        await Article.deleteMany();

        res.status(200).send("Successfully deleted all articles.");
    } catch (err) {
        res.status(500).send(err);
    }
});

app.route("/articles/:articleTitle").get(async (req, res) => {
    try {
        const articleTitle = req.params.articleTitle;

        const article = await Article.findOne({title: articleTitle});

        if(article){
            res.send(article);
        }
        else{
            res.status(200).send("Not found");
        }
    } catch (err) {
        res.status(500).send(err);
    }
}).put(async (req, res) => {
    try {
        const title = req.body.title;
        const content = req.body.content;

        const article = await Article.findOneAndUpdate({title: req.params.articleTitle}, {
            title: title, 
            content: content
        }, { overwrite: true });

        if(article){
            res.send("Successfully updated");
        }
        else{
            res.send("Not found!");
        }
    } catch (err) {
        res.status(500).send(err);
    }
}).patch(async (req, res) => {
    try {
        const article = await Article.findOneAndUpdate({title: req.params.articleTitle}, {$set: req.body});

        if(article){
            res.send("Successfully updated");
        }
        else{
            res.send("Not found!");
        }
    } catch (err) {
        res.status(500).send(err);
    }
}).delete(async (req, res) => {
    try {
        const article = await Article.deleteOne({title: req.params.articleTitle});

        if(article.deletedCount != 0){
            res.send("Successfully deleted");
        }else{
            res.send("Not found!");
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, (req, res) => {
    console.log(`Server running on port: ${port}`);
});