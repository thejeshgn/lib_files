let api_endpoint = "https://data.thejeshgn.com/blogring/";
let max_blogs = 5;
var random_blog = Math.floor( (Math.random() * max_blogs) + 1) ;

function embed_blogring(data){
    content = "I recomend <a href='"+data["title"]+"'>"+data["title"]+"</a>.";
    content = content +"<br/>"+data["description"];
    document.getElementById("blog_ring").innerHTML = content;
}

fetch(api_endpoint+random_blog)
  .then(response => response.json())
  .then(
        data => embed_blogring(data)
    );

