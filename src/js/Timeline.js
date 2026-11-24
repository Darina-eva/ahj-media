import CoordsModal from "./CoordsModal";
import getPosition from "./geolocation";

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const pad = (value) => String(value).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${year} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatCoords({ latitude, longitude }) {
  return `[${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`;
}

export default class Timeline {
  constructor(container) {
    this.container = container;
    this.posts = [];
    this.modal = new CoordsModal();
  }

  init() {
    this.container.innerHTML = `
      <div class="timeline">
        <ul class="timeline-posts"></ul>
        <form class="timeline-form">
          <input class="timeline-input" name="text" placeholder="Напишите что-нибудь и нажмите Enter" autocomplete="off" />
        </form>
      </div>
    `;
    this.list = this.container.querySelector(".timeline-posts");
    this.form = this.container.querySelector(".timeline-form");
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.onSubmit();
    });
  }

  async onSubmit() {
    const input = this.form.elements.text;
    const text = input.value.trim();
    if (!text) {
      return;
    }
    const coords = await this.getCoords();
    if (!coords) {
      return;
    }
    this.addPost({ text, coords, created: Date.now() });
    input.value = "";
  }

  async getCoords() {
    try {
      return await getPosition();
    } catch {
      return this.modal.open();
    }
  }

  addPost(post) {
    this.posts.unshift(post);
    const element = document.createElement("li");
    element.className = "post";
    element.innerHTML = `
      <div class="post-date"></div>
      <div class="post-text"></div>
      <div class="post-coords"></div>
    `;
    element.querySelector(".post-date").textContent = formatDate(post.created);
    element.querySelector(".post-text").textContent = post.text;
    element.querySelector(".post-coords").textContent =
      `${formatCoords(post.coords)} 👁`;
    this.list.prepend(element);
  }
}
