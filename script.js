// ===============================
// FORMAT INR
// ===============================
function formatINR(amount){
    return new Intl.NumberFormat('en-IN',{
        style:'currency',
        currency:'INR'
    }).format(amount);
}

// ===============================
// 40 PRODUCTS
// ===============================
const products = [

{ id:1, name:"Tomato 1kg", price:40, img:"images/tomato.jpg" },
{ id:2, name:"Onion 1kg", price:35, img:"images/onion.jpg" },
{ id:3, name:"Potato 1kg", price:30, img:"images/potato.jpg" },
{ id:4, name:"Carrot 1kg", price:50, img:"images/carrot.jpg" },
{ id:5, name:"Beans 1kg", price:60, img:"images/beans.jpeg" },
{ id:6, name:"Cabbage", price:25, img:"images/cabbage.jpg" },
{ id:7, name:"Cauliflower", price:30, img:"images/cauliflower.jpg" },
{ id:8, name:"Spinach", price:20, img:"images/spinach.jpg" },
{ id:9, name:"Drumstick", price:70, img:"images/drumstick.jpg" },
{ id:10, name:"Brinjal", price:45, img:"images/brinjal.jpg" },

{ id:11, name:"Country Chicken 1kg", price:450, img:"images/country-chicken.jpg" },
{ id:12, name:"Broiler Chicken 1kg", price:250, img:"images/broiler-chicken.jpeg" },
{ id:13, name:"Chicken Wings", price:300, img:"images/chicken-wings.jpg" },
{ id:14, name:"Chicken Breast", price:380, img:"images/chicken-breast.jpg" },
{ id:15, name:"Farm Eggs (12)", price:90, img:"images/eggs.jpeg" },
{ id:16, name:"Country Eggs", price:120, img:"images/country-eggs.jpg" },
{ id:17, name:"Duck Eggs", price:150, img:"images/duck-eggs.jpeg" },

{ id:18, name:"Fresh Cow Milk 1L", price:55, img:"images/milk.jpeg" },
{ id:19, name:"Buffalo Milk 1L", price:65, img:"images/buffalo-milk.jpeg" },
{ id:20, name:"Curd 500g", price:40, img:"images/curd.jpg" },
{ id:21, name:"Paneer 250g", price:90, img:"images/paneer.jpeg" },
{ id:22, name:"Butter 200g", price:110, img:"images/butter.jpeg" },
{ id:23, name:"Ghee 500ml", price:350, img:"images/ghee.jpg" },

{ id:24, name:"Banana Dozen", price:60, img:"images/banana.jpeg" },
{ id:25, name:"Apple 1kg", price:150, img:"images/apple.jpg" },
{ id:26, name:"Orange 1kg", price:90, img:"images/orange.jpg" },
{ id:27, name:"Papaya", price:50, img:"images/papaya.jpg" },
{ id:28, name:"Watermelon", price:80, img:"images/watermelon.jpeg" },

{ id:29, name:"Green Chilli", price:20, img:"images/greenchilli.jpg" },
{ id:30, name:"Garlic 250g", price:35, img:"images/garlic.jpg" },
{ id:31, name:"Ginger 250g", price:30, img:"images/ginger.jpg" },
{ id:32, name:"Coriander", price:15, img:"images/coriander.jpeg" },
{ id:33, name:"Mint Leaves", price:15, img:"images/mint.jpg" },

{ id:34, name:"Farm Honey", price:180, img:"images/honey.jpg" },
{ id:35, name:"Goat Milk 1L", price:90, img:"images/goat-milk.jpeg" },
{ id:36, name:"Sweet Corn", price:60, img:"images/sweet-corn.jpeg" },
{ id:37, name:"Organic Rice 1kg", price:85, img:"images/rice.jpg" },
{ id:38, name:"Brown Eggs", price:70, img:"images/brown-eggs.jpeg" },
{ id:39, name:"Chicken Liver", price:150, img:"images/chicken-liver.jpeg" },
{ id:40, name:"Chicken Leg Pieces", price:320, img:"images/chicken-leg.jpg" }

];

// ===============================
// CART VARIABLES
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let deliveryCharge = 0;
let discount = 0;

// ===============================
// PRODUCT PAGE
// ===============================
if(document.getElementById("productList")){
    const list = document.getElementById("productList");
    products.forEach(p=>{
        list.innerHTML += `
        <div class="card">
            <img src="${p.img}">
            <h4>${p.name}</h4>
            <p>${formatINR(p.price)}</p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>`;
    });
}

// ===============================
// ADD TO CART
// ===============================
function addToCart(id){
    const item = products.find(p=>p.id===id);
    const existing = cart.find(p=>p.id===id);

    if(existing){
        existing.qty = (existing.qty || 1) + 1;
    } else {
        item.qty = 1;
        cart.push(item);
    }

    localStorage.setItem("cart",JSON.stringify(cart));
    updateCartCount();
    alert("Added to Cart");
}

// ===============================
// CART PAGE
// ===============================
if(document.getElementById("cartItems")){
    showCart();
    getLocation();
}

function showCart(){
    let subtotal = 0;
    const div = document.getElementById("cartItems");
    div.innerHTML = "";

    cart.forEach((item,index)=>{
        const qty = item.qty || 1;
        subtotal += item.price * qty;

        div.innerHTML += `
        <div class="cart-card">
            <img src="${item.img}" width="80">
            <div>
                <h4>${item.name}</h4>
                <p>${formatINR(item.price)}</p>

                <div class="qty-box">
                    <button onclick="changeQty(${index},-1)">-</button>
                    <span>${qty}</span>
                    <button onclick="changeQty(${index},1)">+</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>`;
    });

    document.getElementById("subtotal").innerText =
    "Subtotal: " + formatINR(subtotal);

    calculateTotal();
}

// ===============================
// QTY CHANGE
// ===============================
function changeQty(index,change){
    cart[index].qty = (cart[index].qty || 1) + change;

    if(cart[index].qty <= 0){
        cart.splice(index,1);
    }

    localStorage.setItem("cart",JSON.stringify(cart));
    showCart();
    updateCartCount();
}

function removeItem(index){
    cart.splice(index,1);
    localStorage.setItem("cart",JSON.stringify(cart));
    showCart();
    updateCartCount();
}

// ===============================
// DELIVERY (HOSUR)
// ===============================
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position=>{

            const farmLat = 12.7409;
            const farmLon = 77.8253;

            const distance = calculateDistance(
                farmLat,farmLon,
                position.coords.latitude,
                position.coords.longitude
            );

            let deliveryTime="";

            if(distance<=5){
                deliveryCharge=20; deliveryTime="30 Minutes";
            }
            else if(distance<=15){
                deliveryCharge=40; deliveryTime="45 Minutes";
            }
            else if(distance<=30){
                deliveryCharge=70; deliveryTime="60 Minutes";
            }
            else{
                deliveryCharge=120; deliveryTime="90-120 Minutes";
            }

            document.getElementById("deliveryCharge").innerText =
            "Delivery Charge: " + formatINR(deliveryCharge);

            document.getElementById("deliveryTime").innerText =
            "Estimated Delivery: " + deliveryTime;

            calculateTotal();
        });
    }
}

function calculateDistance(lat1,lon1,lat2,lon2){
    const R=6371;
    const dLat=(lat2-lat1)*Math.PI/180;
    const dLon=(lon2-lon1)*Math.PI/180;
    const a=Math.sin(dLat/2)**2+
    Math.cos(lat1*Math.PI/180)*
    Math.cos(lat2*Math.PI/180)*
    Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

// ===============================
// COUPON
// ===============================
function applyCoupon(){
    const code=document.getElementById("coupon").value;

    if(localStorage.getItem("firstOrder")==null && code==="FARM20"){
        discount=0.2;
        document.getElementById("couponMsg").innerText="20% Discount Applied!";
    } else {
        document.getElementById("couponMsg").innerText="Invalid/Used Coupon";
    }

    calculateTotal();
}

// ===============================
// TOTAL
// ===============================
function calculateTotal(){
    let subtotal = cart.reduce((sum,item)=>
        sum + (item.price*(item.qty||1)),0);

    let total = subtotal - (subtotal*discount) + deliveryCharge;

    if(document.getElementById("total")){
        document.getElementById("total").innerText =
        "Final Total: " + formatINR(total);
    }
}

// ===============================
// PAYMENT
// ===============================
function payNow(){
    let subtotal = cart.reduce((sum,item)=>
        sum + (item.price*(item.qty||1)),0);

    let total = subtotal - (subtotal*discount) + deliveryCharge;

    let orders=JSON.parse(localStorage.getItem("orders"))||[];

    orders.push({
        items:cart,
        total:total,
        status:"Preparing"
    });

    localStorage.setItem("orders",JSON.stringify(orders));
    localStorage.setItem("firstOrder","done");
    localStorage.removeItem("cart");

    alert("Payment Successful (Demo)");
}

// ===============================
// CART BADGE
// ===============================
function updateCartCount(){
    const count = cart.reduce((sum,item)=>
        sum + (item.qty||1),0);

    const badge = document.getElementById("cartCount");
    if(badge) badge.innerText = count;
}

updateCartCount();
function updateCartCount(){

    let savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const count = savedCart.reduce((sum,item)=>
        sum + (item.qty || 1),0);

    const badge = document.getElementById("cartCount");

    if(badge){
        badge.innerText = count;
        badge.style.display = count > 0 ? "flex" : "none";
    }
}
document.addEventListener("DOMContentLoaded", function(){
    updateCartCount();
});