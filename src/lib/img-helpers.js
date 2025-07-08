export const compressImg = file => new Promise(res => {
  const img = new Image();
  img.onload = () => {
    const MAX = 800;
    const s   = Math.min(1, MAX / Math.max(img.width, img.height));
    const c   = document.createElement('canvas');
    c.width   = img.width  * s;
    c.height  = img.height * s;
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    res(c.toDataURL('image/jpeg', .7));
  };
  img.src = URL.createObjectURL(file);
});
