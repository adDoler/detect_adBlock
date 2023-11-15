function getRndString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function showMessage() {
  document.getElementById("ads").style.display = "none";
  document.getElementById("alt").style.display = "block";
}

const rndUrl = `https://${getRndString(10)}/?ev.adriver.ru`;

var image = new Image();
image.className = "content-list__ad-label ad banner adriver tracker analytics ads reklama ad-sidebar adsbox adblock-blocker";
image.id = "imgBanner"
image.src = rndUrl;
document.body.append(image);

setTimeout(() => {

  var element = document.querySelector(`img[src="${rndUrl}"]`);
  const style = window.getComputedStyle(element);

  if (style.display.indexOf("none") !== -1)
    showMessage();

}, 30);

