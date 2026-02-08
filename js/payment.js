const paymentModal=document.getElementById("payment-modal");
const successModal=document.getElementById("success-modal");

window.onclick=function (event){
  if (event.target===paymentModal){
    paymentModal.style.display="none";
  }
};

const paymentForm=document.getElementById("payment-form");
paymentForm?.addEventListener("submit",(event)=>{
  event.preventDefault();

  const cardNumber=document.getElementById("card-number").value;
  const expirationDate=document.getElementById("expiration-date").value;
  const cvv=document.getElementById("cvv").value;

  const cardNumberValidation=/^[0-9]{16}$/;
  if (!cardNumberValidation.test(cardNumber.replace(/\s+/g,""))){
    alert("Please enter a valid 16-digit card number");
    return;
  }

  const expirationDateValidation=/^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expirationDateValidation.test(expirationDate)){
    alert("Please enter a valid expiration date (MM/YY)");
    return;
  }

  const cvvValidation=/^[0-9]{3}$/;
  if (!cvvValidation.test(cvv)){
    alert("Please enter a valid 3-digit CVV");
    return;
  }

  showSuccessModal();
  paymentModal.style.display="none";
});

const cardNumberInput=document.getElementById("card-number");
cardNumberInput?.addEventListener("input",(event)=>{
  let input=event.target.value.replace(/\D/g,"");
  input=input.substring(0,16);
  const formatted=input.match(/.{1,4}/g)?.join(" ") || input;
  event.target.value=formatted;
});

const expirationDateInput=document.getElementById("expiration-date");
expirationDateInput?.addEventListener("input",(event)=>{
  let input=event.target.value.replace(/\D/g,"");
  input=input.substring(0,4);
  if (input.length>=3){
    event.target.value=`${input.substring(0,2)}/${input.substring(2)}`;
  }else{
    event.target.value=input;
  }
});

const cvvInput=document.getElementById("cvv");
cvvInput?.addEventListener("input",(event)=>{
  let input=event.target.value.replace(/\D/g,"");
  input=input.substring(0,3);
  event.target.value=input;
});

function showSuccessModal(){
  successModal.style.display="flex";
  clearCartItems();
  setTimeout(()=>{ successModal.style.display="none"; }, 2500);
}

function clearCartItems(){
  localStorage.removeItem("cart");
  // these functions exist in menu.js
  if (typeof updateCartBadge === "function") updateCartBadge();
  if (typeof renderInvoice === "function") renderInvoice();
}
