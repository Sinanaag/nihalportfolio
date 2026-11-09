const portrait = document.querySelector("[data-magnetic]");
if (portrait) {
  portrait.addEventListener("mousemove", e => {
    const rect = portrait.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 25;
    portrait.style.transform = `translateX(-50%) translate3d(${x}px,${y}px,0)`;
  });
  portrait.addEventListener("mouseleave", () => {
    portrait.style.transform = "translateX(-50%) translate3d(0,0,0)";
  });
}

const revealItems = document.querySelectorAll(".section-head,.skill-card,.service-list article,.process-grid>div,.contact-inner");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.12});

revealItems.forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(35px)";
  el.style.transition = "opacity .8s ease, transform .8s cubic-bezier(.25,.1,.25,1)";
  observer.observe(el);
});

const style = document.createElement("style");
style.textContent = ".visible{opacity:1!important;transform:translateY(0)!important}";
document.head.appendChild(style);
