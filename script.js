// Replace titles/categories here when final project names are supplied.
const projects = [
  { title: 'Short-form edit', category: 'REELS / SHORTS', url: 'https://www.youtube.com/shorts/mCxDOT4TP5I' },
  { title: 'Featured video edit', category: 'VIDEO EDITING', url: 'https://youtu.be/S_oJXJX4HLE' },
];

function videoSource(value) {
  const url = new URL(value, window.location.href);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported video URL');
  const host = url.hostname.replace(/^www\./, '');
  let id;
  if (host === 'youtu.be') id = url.pathname.slice(1);
  if (host === 'youtube.com' || host === 'm.youtube.com') id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
  if (id && /^[\w-]{11}$/.test(id)) return { embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0` };
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    id = url.pathname.match(/\/(\d+)(?:\/|$)/)?.[1];
    if (id) return { embed: `https://player.vimeo.com/video/${id}?autoplay=1` };
  }
  if (/\.(mp4|webm)$/i.test(url.pathname)) return { file: url.href };
  throw new Error('Use an MP4, WebM, YouTube or Vimeo URL');
}
const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#video-player');
document.querySelectorAll('[data-project]').forEach((card, index) => {
  const project = projects[index];
  card.querySelector('h3').textContent = project.title;
  card.querySelector('.project-category').textContent = project.category;
  const button = card.querySelector('button');
  button.disabled = false;
  button.setAttribute('aria-label', `Play ${project.title}`);
  card.querySelector('.project-status').textContent = 'PLAY FILM ↗';
  button.addEventListener('click', () => {
    try {
      const source = videoSource(project.url);
      const media = document.createElement(source.embed ? 'iframe' : 'video');
      media.src = source.embed || source.file;
      if (source.embed) {
        media.title = project.title;
        media.allow = 'autoplay; fullscreen; picture-in-picture';
        media.allowFullscreen = true;
        media.referrerPolicy = 'strict-origin-when-cross-origin';
      } else { media.controls = true; media.autoplay = true; media.playsInline = true; }
      player.replaceChildren(media);
      document.querySelector('#video-title').textContent = project.title;
      dialog.showModal();
    } catch (error) { card.querySelector('.project-status').textContent = error.message; }
  });
});
function closeVideo() { dialog.close(); player.replaceChildren(); }
document.querySelector('#close-video').addEventListener('click', closeVideo);
dialog.addEventListener('close', () => player.replaceChildren());
dialog.addEventListener('click', event => { if (event.target === dialog) closeVideo(); });
document.querySelector('#print-resume').addEventListener('click', () => window.print());
document.querySelector('#year').textContent = new Date().getFullYear();
