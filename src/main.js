import rickaptcha from './lib';

const content = document.querySelector('main');
content.style.display = 'none';

rickaptcha('#left', 'https://youtu.be/dQw4w9WgXcQ', { mobile: false }).then(() => {
  content.style.display = 'block';
});
rickaptcha('#right', 'https://youtu.be/dQw4w9WgXcQ', { mobile: true }).then(() => {
  content.style.display = 'block';
});
