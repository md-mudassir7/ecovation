// script.js
function showImage(el) {
    const main = document.getElementById("mainPreview");
    const thumbnails = document.querySelectorAll(".thumbnail-gallery img");
  
    main.style.opacity = 0;
    setTimeout(() => {
      main.src = el.src;
      main.style.opacity = 1;
    }, 150);
  
    thumbnails.forEach(img => img.classList.remove("active-thumb"));
    el.classList.add("active-thumb");
  }
  
  