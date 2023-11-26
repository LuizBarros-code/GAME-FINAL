// Cria um novo objeto AudioContext
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Use o método 'fetch' para carregar um arquivo de áudio
fetch('music/Bad Meets Evil - Fast Lane (Official Audio).mp3')
.then(response => response.arrayBuffer())
.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
.then(audioBuffer => {
  // Cria um novo AudioBufferSourceNode
  var source = audioContext.createBufferSource();
  
  // Define o buffer para o nosso AudioBufferSourceNode
  source.buffer = audioBuffer;
  
  // Conecta nosso AudioBufferSourceNode ao destino (os alto-falantes)
  source.connect(audioContext.destination);
  
  // Inicia a reprodução
  source.start();
});
