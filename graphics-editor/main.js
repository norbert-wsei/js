const canvas = document.querySelector('#editor');
const imagesContainer = document.querySelector('#images');

const images = [
  './img1.jpg',
  './img2.jpg',
  './img3.jpg',
];

const ctx = canvas.getContext('2d');

const editorImage = new Image();
editorImage.src = images[0];
editorImage.addEventListener('load', () => {
  ctx.drawImage(editorImage, 0, 0, canvas.width, canvas.height);
});

// Render images
images.forEach(image => {
  const img = document.createElement('img');
  img.src = image;

  img.addEventListener('click', (event) => {
    editorImage.src = event.target.src;
  });

  imagesContainer.appendChild(img);
});
