window.addEventListener("DOMContentLoaded", () => {
  const { CafeData, CafeUtils } = window;
  const recommendedGrid = document.querySelector("#recommendedGrid");
  const categoryList = document.querySelector("#categoryList");

  const categoryImages = {
    coffee: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
    ade: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80",
    tea: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=600&q=80",
    bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    cake: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80",
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderRecommended() {
    const recommended = CafeData.menus.filter((menu) => menu.isRecommended).slice(0, 4);

    if (recommended.length === 0) {
      recommendedGrid.innerHTML = '<p class="empty-state">추천 메뉴가 없습니다.</p>';
      return;
    }

    recommendedGrid.innerHTML = recommended
      .map((menu) => {
        const category = CafeUtils.findCategoryById(menu.categoryId);

        return `
          <article class="menu-card ${menu.isSoldOut ? "is-sold-out" : ""}">
            <a href="./menus/detail.html?id=${encodeURIComponent(menu.id)}">
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
                  <span class="tag warning">추천</span>
                  ${menu.isSoldOut ? '<span class="tag danger">품절</span>' : ""}
                </div>
              </div>
            </a>
          </article>
        `;
      })
      .join("");
  }

  function renderCategories() {
    categoryList.innerHTML = CafeData.categories
      .map(
        (category) => `
          <a class="category-card glass-card" href="./menus/list.html?category=${encodeURIComponent(category.id)}">
            <div class="category-image">
              <img src="${escapeHtml(categoryImages[category.id])}" alt="${escapeHtml(category.label || category.name)}" />
            </div>
            <span class="category-label">${escapeHtml(category.label || category.name)}</span>
          </a>
        `
      )
      .join("");
  }

  renderRecommended();
  renderCategories();
});
