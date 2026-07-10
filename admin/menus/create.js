(function () {
  const formEl = document.getElementById("menu-form");
  const categorySelectEl = document.getElementById("category-select");
  const singleSizeLabel = formEl.querySelector('[data-size-option="single"]');
  const singleSizeInput = formEl.querySelector('input[name="sizes"][value="single"]');

  function isBeverageCategory(categoryId) {
    const category = window.CafeUtils.findCategoryById(categoryId);
    return category?.group === "Beverage";
  }

  function syncSizeOptions() {
    const hideSingle = isBeverageCategory(formEl.elements.categoryId.value);
    singleSizeLabel.hidden = hideSingle;

    if (hideSingle) {
      singleSizeInput.checked = false;
    }
  }

  function renderCategoryOptions() {
    const categories = window.CafeData?.categories || [];
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.label;
      categorySelectEl.appendChild(option);
    });
  }

  function getCheckedValues(formData, name) {
    return formData.getAll(name);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(formEl);
    const tags = (formData.get("tags") || "")
      .toString()
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const menuData = {
      name: formData.get("name").toString().trim(),
      englishName: formData.get("englishName").toString().trim(),
      categoryId: formData.get("categoryId"),
      price: Number(formData.get("price")) || 0,
      image:
        formData.get("image").toString().trim() ||
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
      description: formData.get("description").toString().trim(),
      tags,
      options: {
        temperature: getCheckedValues(formData, "temperature"),
        sizes: getCheckedValues(formData, "sizes"),
      },
      isRecommended: formData.get("isRecommended") === "on",
      isSoldOut: formData.get("isSoldOut") === "on",
    };

    if (!menuData.name || !menuData.categoryId || !menuData.price) {
      window.alert("메뉴명, 카테고리, 가격을 입력해주세요.");
      return;
    }

    if (isBeverageCategory(menuData.categoryId)) {
      menuData.options.sizes = menuData.options.sizes.filter((size) => size !== "single");
    }

    const newMenu = window.CafeUtils.addMenu(menuData);
    window.location.href = `/admin/menus/detail?id=${encodeURIComponent(newMenu.id)}`;
  }

  renderCategoryOptions();
  syncSizeOptions();
  categorySelectEl.addEventListener("change", syncSizeOptions);
  formEl.addEventListener("submit", handleSubmit);
})();
