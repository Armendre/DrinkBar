function subscribeUser(event){
  event.preventDefault();

  const email=document.getElementById("subscriberEmail").value;
  const isSubscribe=document.getElementById("checkbox").checked;

  if (!email || !email.includes("@")){
    Toastify({
      text:"Please enter a valid email address.",
      duration:2500,
      position:"center",
      gravity:"top",
      backgroundColor:"red"
    }).showToast();
    return;
  }

  localStorage.setItem("subscriber", JSON.stringify({ email, subscribed:isSubscribe }));

  Toastify({
    text:"Subscription successful. You are now subscribed.",
    duration:2500,
    position:"center",
    gravity:"top",
    backgroundColor:"var(--primary-color)"
  }).showToast();
}

function checkSubscriptionStatus(){
  const sub = JSON.parse(localStorage.getItem("subscriber"));
  if (sub && sub.subscribed){
    document.getElementById("subscriberEmail").value = sub.email;
    Toastify({
      text:`Welcome back ${sub.email}`,
      duration:2000,
      position:"center",
      gravity:"top",
      backgroundColor:"var(--primary-color)"
    }).showToast();
  }
}

document.getElementById("subscribeForm")?.addEventListener("submit", subscribeUser);
document.addEventListener("DOMContentLoaded", checkSubscriptionStatus);
