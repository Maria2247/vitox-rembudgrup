import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';
import './css/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  new Accordion('.accordion-container', {
    openOnInit: [0],
    showMultiple: false,
  });
});

const burgerBtn = document.getElementById('burger-btn');
const decorDots = document.getElementsByClassName('.nav-dots');
const openMenu = document.getElementById('nav-menu');
const closeBtn = document.getElementById('close-btn');
const navLink = document.querySelectorAll('.nav-item a');

burgerBtn.addEventListener('click', () => {
  openMenu.classList.add('is-open');
  closeBtn.classList.add('is-open');
  decorDots.classList.add('is-open');
});

function closeMobileNav(e) {
  openMenu.classList.remove('is-open');
  closeBtn.classList.remove('is-open');
}

closeBtn.addEventListener('click', closeMobileNav);

navLink.forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

openMenu.addEventListener('click', e => {
  if (e.target === openMenu) {
    closeMobileNav();
  }
});
