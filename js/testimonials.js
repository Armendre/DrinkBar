document.addEventListener("DOMContentLoaded",()=>{
  const leftArrow=document.querySelector(".left-arrow-testimonial");
  const rightArrow=document.querySelector(".right-arrow-testimonial");
  const dotsContainer=document.querySelector(".carousel-indicators");

  let currentIndex=0;
  let data=[];

  fetch("js/testimonials.json")
    .then(r=>r.json())
    .then((d)=>{
      data=d;
      createDots(data.length);
      updateTestimonials(data,currentIndex);
    });

  function createDots(len){
    dotsContainer.innerHTML="";
    for (let i=0;i<len;i++){
      const dot=document.createElement("span");
      dot.classList.add("dot");
      if (i===0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    }
    document.querySelectorAll(".dot").forEach((dot,idx)=>{
      dot.addEventListener("click",()=>{
        currentIndex=idx;
        updateTestimonials(data,currentIndex);
        updateDots(currentIndex);
      });
    });
  }

  function updateTestimonials(list,idx){
    const cards=[
      {container:document.querySelector(".testimonial-card-first"), data:list[idx % list.length]},
      {container:document.querySelector(".testimonial-card-middle"), data:list[(idx+1) % list.length]},
      {container:document.querySelector(".testimonial-card-third"), data:list[(idx+2) % list.length]},
    ];
    cards.forEach(({container,data})=>{
      if (!container) return;
      container.querySelector(".testimonial-image img").src=data.image;
      container.querySelector(".testimonial-name").textContent=data.name;
      container.querySelector(".testimonial-role").textContent=data.role;
      container.querySelector(".testimonial-text").textContent=data.text;
    });
  }

  leftArrow?.addEventListener("click",()=>{
    currentIndex=currentIndex>0?currentIndex-1:data.length-1;
    updateTestimonials(data,currentIndex);
    updateDots(currentIndex);
  });

  rightArrow?.addEventListener("click",()=>{
    currentIndex=currentIndex < data.length-1 ? currentIndex + 1 : 0;
    updateTestimonials(data,currentIndex);
    updateDots(currentIndex);
  });

  function updateDots(idx){
    document.querySelectorAll(".dot").forEach((dot,pos)=>{
      dot.classList.toggle("active", pos===idx);
    });
  }
});
