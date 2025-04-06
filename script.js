function showImage(el) {
    // Find the closest container (section)
    const container = el.closest(".container");
  
    // Find the main preview image within this section
    const main = container.querySelector("img[id^='mainPreview']");
  
    // Get thumbnails only inside this section
    const thumbnails = container.querySelectorAll(".thumbnail-gallery img");
  
    // Transition effect
    main.style.opacity = 0;
    setTimeout(() => {
      main.src = el.src;
      main.style.opacity = 1;
    }, 150);
  
    // Remove active from all, add to clicked
    thumbnails.forEach(img => img.classList.remove("active-thumb"));
    el.classList.add("active-thumb");
  }
  