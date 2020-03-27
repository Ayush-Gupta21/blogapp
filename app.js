var express          = require("express"),
	app              = express(),
	bodyParser       = require("body-parser"),
	mongoose         = require("mongoose"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer");
	
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect(process.env.DATABASEURL);
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{
		type:Date,
		default:Date.now
	}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"Mussoorie",
// 	image:"https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c7d2b7ed5974fc151_340.jpg",
// 	body:"This is Mussorrie. It is a very beautiful place to live and enjoy everywhere where you want to."
// },function(err,blog){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log("blog created......");
// 		console.log(blog);
// 	}
// });

app.get("/",function(req,res){
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
	Blog.find({},function(err,foundBlogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:foundBlogs});	
		}
	})
});

app.get("/blogs/new",function(req,res){
	res.render("new");
});

app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,blog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	})
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog});
		}
	})
});

//EDIT
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs/"+req.params.id);
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

app.put("/blogs/:id",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//DELETE
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,deleted){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("BlogApp server has started !");
});

    