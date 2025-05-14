const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const placeholder = document.getElementById('placeholder');
const ctx = canvas.getContext('2d');
let stream = null;
let brilhoInterval = null;

function abrirWebcam() {
  if (stream) return;

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(mediaStream => {
      stream = mediaStream;
      video.srcObject = stream;
      checkBrightness(); // Inicia verificação de brilho
    })
    .catch(error => {
      console.error("Erro ao acessar a câmera:", error);
    });
}

function fecharWebcam() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
    video.srcObject = null;
    clearInterval(brilhoInterval);
    video.style.display = 'none';
    placeholder.style.display = 'none';
  }
}

function tirarFoto() {
  if (!stream) return alert("Webcam não está ativa!");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const link = document.createElement('a');
  link.download = 'foto.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function checkBrightness() {
  brilhoInterval = setInterval(() => {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let brightness = 0;

    for (let i = 0; i < frame.data.length; i += 4) {
      brightness += (frame.data[i] + frame.data[i + 1] + frame.data[i + 2]) / 3;
    }

    brightness /= (canvas.width * canvas.height);

    if (brightness < 10) {
      video.style.display = 'none';
      placeholder.style.display = 'block';
    } else {
      video.style.display = 'block';
      placeholder.style.display = 'none';
    }
  }, 1000);
}
