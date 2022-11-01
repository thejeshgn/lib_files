var app = new Vue({
    el: "#app",
    data:{
        message :"Hello World",
        visitor_name : "",
        visitors: []
    },
    methods : {
        sayHi: function(){
            this.message = "Hi";
            this.visitors.push(this.visitor_name);
            this.visitor_name = "";
        }
    },
    computed : {
        count: function(){
            return this.visitors.length;
        }
    }
    
})