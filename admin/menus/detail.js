(function () {
  const detailEl = document.getElementById("menu-detail");
  const notFoundEl = document.getElementById("not-found-message");

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderOptionList(label, values) {
    if (!values || !values.length) return "";
    return `
      <div class="menu-detail__option">
        <span>${escapeHtml(label)}</span>
        <strong>${values.map(escapeHtml).join(", ")}</strong>
      </div>
    `;
  }

  function renderMenu(menu) {
    const category = window.CafeUtils.findCategoryById(menu.categoryId);

    detailEl.innerHTML = `
      <div class="menu-detail__image">
        <img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" />
      </div>
      <div class="menu-detail__body">
        <div class="menu-detail__title">
          <h1>${escapeHtml(menu.name)}</h1>
          <span class="menu-detail__english">${escapeHtml(menu.englishName || "")}</span>
        </div>
        <div class="menu-detail__badges">
          <span class="badge badge--accent">${escapeHtml(category?.label || "미분류")}</span>
          ${
            menu.isSoldOut
              ? '<span class="badge badge--danger">품절</span>'
              : '<span class="badge badge--accent">판매중</span>'
          }
          ${menu.isRecommended ? '<span class="badge badge--warning">추천 메뉴</span>' : ""}
        </div>
        <p class="menu-detail__price">${window.CafeUtils.formatPrice(menu.price)}</p>
        <p class="menu-detail__desc">${escapeHtml(menu.description || "")}</p>
        ${renderOptionList("온도", menu.options?.temperature)}
        ${renderOptionList("사이즈", menu.options?.sizes)}
        ${renderOptionList("태그", menu.tags)}
        <div class="menu-detail__actions">
          <a class="btn btn--primary" href="/admin/menus/edit?id=${encodeURIComponent(menu.id)}">수정</a>
          <button type="button" class="btn btn--danger" id="delete-button">삭제</button>
        </div>
      </div>
    `;

    document.getElementById("delete-button").addEventListener("click", () => {
      const confirmed = window.confirm(`'${menu.name}' 메뉴를 삭제할까요?`);
      if (!confirmed) return;
      window.CafeUtils.deleteMenu(menu.id);
      window.location.href = "/admin/menus/list.html";
    });
  }

  const menuId = window.CafeUtils.getQueryParam("id");
  const menu = menuId ? window.CafeUtils.findMenuById(menuId) : null;

  if (menu) {
    renderMenu(menu);
  } else {
    detailEl.hidden = true;
    notFoundEl.hidden = false;
  }
})();
