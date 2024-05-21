console.log("hello hello");

let pageTitle = document.querySelector("#page-title")
// Javascript Timeout changes h1 title after 3 seconds
setTimeout(function () {
    pageTitle.style.color = "#faffb8";
    // console.log("timeout worked!");
}, 3000);

// Click event on header changes background color
document.querySelector("header").onclick = function () {
    // console.log("clicked header");
    document.querySelector("body").style.backgroundColor = "white";
}

//image click appear
document.querySelector("#image-0").addEventListener("click", function(){
    document.querySelector("#image-1").classList.remove("hidden");
    alert("MOODS")
})

document.querySelector("#image-1").addEventListener("click", function(){
    document.querySelector("#image-2").classList.remove("hidden");
    
})

document.querySelector("#image-2").addEventListener("click", function(){
    document.querySelector("#image-3").classList.remove("hidden");
    
})