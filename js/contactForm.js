const contactUs=document.querySelector(".email-form");

contactUs?.addEventListener("submit",(event)=>{
  event.preventDefault();

  const name=document.getElementById("name").value;
  const email=document.getElementById("email").value;
  const subject=document.getElementById("subject").value;
  const message=document.getElementById("message").value;

  const nameRegex=/^[A-Za-zÀ-ÖØ-öø-ÿ’ -]+$/;
  if (!nameRegex.test(name.trim())){
    Toastify({text:"Please enter a valid name.",duration:2500,gravity:"top",position:"center",backgroundColor:"red"}).showToast();
    return;
  }

  const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())){
    Toastify({text:"Please enter a valid email.",duration:2500,gravity:"top",position:"center",backgroundColor:"red"}).showToast();
    return;
  }

  localStorage.setItem("contact", JSON.stringify({name,email,subject,message}));

  Toastify({
    text:"Thanks for reaching out. We'll reply as soon as possible.",
    duration:2500,
    gravity:"top",
    position:"center",
    backgroundColor:"#28a745"
  }).showToast();

  contactUs.reset();
});
