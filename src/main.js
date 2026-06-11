import rickaptcha from './lib';

const content = document.querySelector('main');
content.style.display = 'none';

rickaptcha('#app', 'https://youtu.be/dQw4w9WgXcQ').then(() => {
  content.style.display = 'block';
});
