var api_endpoint = "https://data.thejeshgn.com/blogring/";
var max_blogs = 14;

function embed_blogring(data){
    content = "I recommend <a target='_blank' href='" + data["url"] + "'>" + data["title"] + "</a>. ";
    content = content + data["description"]; 
    content = content + "&nbsp;<span onclick ='refresh_blogring()' title='Get New Blog' style='cursor: pointer;'>♻️</span>"    
    document.getElementById("blog_ring").innerHTML = content;
}

function refresh_blogring(){
  var random_blog = Math.floor( (Math.random() * max_blogs) + 1) ;
  fetch(api_endpoint+random_blog)
    .then(response => response.json())
    .then(
          data => embed_blogring(data)
      );
}

refresh_blogring();

