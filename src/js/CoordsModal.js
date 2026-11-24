import parseCoords from "./parseCoords";

export default class CoordsModal {
  open() {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "modal-overlay";
      overlay.innerHTML = `
        <form class="modal" novalidate>
          <h2 class="modal-title">Что-то пошло не так</h2>
          <p class="modal-text">К сожалению, нам не удалось определить ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную.</p>
          <label class="modal-label" for="coords-input">Широта и долгота через запятую</label>
          <input class="modal-input" id="coords-input" name="coords" placeholder="51.50851, -0.12572" autocomplete="off" />
          <div class="modal-error"></div>
          <div class="modal-buttons">
            <button type="button" class="button" data-action="cancel">Отмена</button>
            <button type="submit" class="button">OK</button>
          </div>
        </form>
      `;
      const form = overlay.querySelector("form");
      const input = form.elements.coords;
      const error = overlay.querySelector(".modal-error");

      const close = (result) => {
        overlay.remove();
        resolve(result);
      };

      input.addEventListener("input", () => {
        input.setCustomValidity("");
        input.classList.remove("invalid");
        error.textContent = "";
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        try {
          close(parseCoords(input.value));
        } catch (e) {
          input.setCustomValidity(e.message);
          input.classList.add("invalid");
          error.textContent = e.message;
          input.focus();
        }
      });

      form
        .querySelector('[data-action="cancel"]')
        .addEventListener("click", () => close(null));

      document.body.append(overlay);
      input.focus();
    });
  }
}
