function SmartHref(name){
    window.location = "../"+name
}

function SmartHref2(name){
    window.location = "../../"+name
}

function SmartHome(){
    window.location = "Wacky/Home/index.html"
}

// Something Else Lol //
function ChangeFunFact(){
    

    const FunFactArray = [
        "Wolfy is NOT appart of this website.",
        "Wacky Burger Jr. is the son of Wacky Burger!",
        "Freaky French Fries is not the bad kind of freaky. Hes freaking good.",
        "Yummers Lettuce is made with 200% more fresh lettuce locally sourced.",
        "Titanic burger is related to the Titanic.",
        "Tomater Hater is for you to show your tomato hating friends! Or if you love tomatos.",
        "Caleb owes me lunch money. :(",
        "Owen is spelled like O w e m. Trust!"
    ]

    var AL = FunFactArray.length
    var RandomNumber = Math.round(Math.random()*AL)
    var Fact = FunFactArray.slice(RandomNumber, RandomNumber+1)

    if (document.getElementById("FunFact") !== null)
        document.getElementById("FunFact").innerHTML = Fact;
}

ChangeFunFact()

function SmartCheckout()
{
    window.location = "../Checkout/"
}