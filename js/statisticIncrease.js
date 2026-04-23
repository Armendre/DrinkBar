function animateValue(element,start,end,duration){
  let startTime=null;
  const step=(timestamp)=>{
    if (!startTime) startTime=timestamp;
    const progress=timestamp-startTime;
    const currentValue=Math.min(Math.floor((progress/duration)*(end-start)+start), end);
    element.textContent=currentValue;
    if (currentValue<end) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

function initObserver(){
  const options={root:null,threshold:0.7};
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach((entry)=>{
      if (entry.isIntersecting){
        const statValues=entry.target.querySelectorAll(".stat-value");
        statValues.forEach((stat)=>{
          const endValue=parseInt(stat.getAttribute("data-target"));
          animateValue(stat,0,endValue,2000);
        });
        obs.unobserve(entry.target);
      }
    });
  },options);
  const target=document.querySelector(".statistics-section");
  if (target) observer.observe(target);
}

document.addEventListener("DOMContentLoaded", initObserver);
