window.addEventListener("DOMContentLoaded", () => {
  const { CafeData, CafeUtils } = window;
  const categoryJump = document.querySelector("#categoryJump");
  const categorySections = document.querySelector("#categorySections");
  const scrollTopButton = document.querySelector("#scrollTopButton");

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function easeOutCubic(progress) {
    return 1 - Math.pow(1 - progress, 3);
  }

  function smoothScrollTo(targetTop, duration = 650) {
    const startTop = window.scrollY;
    const distance = targetTop - startTop;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const nextTop = startTop + distance * easeOutCubic(progress);

      window.scrollTo(0, nextTop);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function getHeaderOffset() {
    const header = document.querySelector(".site-header");
    return (header?.offsetHeight || 0) + 24;
  }

  function renderMenuCard(menu) {
    const category = CafeUtils.findCategoryById(menu.categoryId);

    return `
      <article class="menu-card ${menu.isSoldOut ? "is-sold-out" : ""}">
        <a href="./detail.html?id=${encodeURIComponent(menu.id)}">
          <div class="menu-image">
            <img src="${escapeHtml(menu.image)}" alt="${escapeHtml(menu.name)}" />
          </div>
          <div class="menu-body">
            <div class="menu-title">
              <div>
                <h3>${escapeHtml(menu.name)}</h3>
                <p>${escapeHtml(menu.englishName)}</p>
              </div>
              <span class="price">${CafeUtils.formatPrice(menu.price)}</span>
            </div>
            <p class="menu-description">${escapeHtml(menu.description)}</p>
            <div class="tag-row">
              <span class="tag">${escapeHtml(category?.label || category?.name || "기타")}</span>
              ${menu.isRecommended ? '<span class="tag warning">추천</span>' : ""}
              ${menu.isSoldOut ? '<span class="tag danger">품절</span>' : ""}
            </div>
          </div>
        </a>
      </article>
    `;
  }

  function renderCategoryJump() {
    const menus = CafeUtils.getMenus();
    const items = CafeData.categories
      .filter((category) => menus.some((menu) => menu.categoryId === category.id))
      .map(
        (category) =>
          `<a href="#category-${escapeHtml(category.id)}">${escapeHtml(category.label || category.name)}</a>`,
      );

    categoryJump.innerHTML = items.join("");
  }

  function renderCategorySections() {
    const menus = CafeUtils.getMenus();
    const sections = CafeData.categories
      .map((category) => {
        const categoryMenus = menus.filter((menu) => menu.categoryId === category.id);

        if (categoryMenus.length === 0) {
          return "";
        }

        return `
          <section class="category-block" aria-labelledby="category-${escapeHtml(category.id)}">
            <div class="category-heading">
              <div>
                <p class="category-group">${escapeHtml(category.group || "Menu")}</p>
                <h3 id="category-${escapeHtml(category.id)}">${escapeHtml(category.label || category.name)}</h3>
              </div>
              <span class="count-badge">${categoryMenus.length}개</span>
            </div>
            <div class="menu-grid category-grid">
              ${categoryMenus.map(renderMenuCard).join("")}
            </div>
          </section>
        `;
      })
      .filter(Boolean);

    categorySections.innerHTML =
      sections.join("") || '<p class="empty-state">등록된 메뉴가 없습니다.</p>';
  }

  renderCategoryJump();
  renderCategorySections();

  categoryJump.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (!link) {
      return;
    }

    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();

    const targetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    smoothScrollTo(Math.max(targetTop, 0));
  });

  scrollTopButton.addEventListener("click", () => {
    smoothScrollTo(0);
  });
});
