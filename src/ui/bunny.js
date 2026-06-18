export function initBunnies() {
  const track = document.createElement('div');
  track.className = 'bunny-track';
  document.body.appendChild(track);

  function spawn() {
    const dur     = 7000 + Math.random() * 10000;
    const hop     = 300  + Math.random() * 220;
    const goRight = Math.random() > 0.5;

    const runner = document.createElement('div');
    runner.className = `bunny-runner ${goRight ? 'go-right' : 'go-left'}`;
    runner.style.setProperty('--dur', dur + 'ms');

    const px = document.createElement('div');
    px.className = 'pixel-bunny';
    px.style.setProperty('--hop', hop + 'ms');

    runner.appendChild(px);
    track.appendChild(runner);

    setTimeout(() => {
      runner.remove();
      setTimeout(spawn, 1500 + Math.random() * 4000);
    }, dur + 200);
  }

  spawn();
  setTimeout(spawn, 3000 + Math.random() * 2000);
  setTimeout(spawn, 7000 + Math.random() * 3000);
}
