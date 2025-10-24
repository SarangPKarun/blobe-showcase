const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
  hamburger.classList.toggle('active'); // toggle X animation
});

// Close menu on link click (fade + close button revert)
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    hamburger.classList.remove('active'); // revert to hamburger
  });
});


window.onload = function() {
  window.scrollTo(0, 0); // Always go to top
};