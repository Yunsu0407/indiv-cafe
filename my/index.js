const { getOrders, formatPrice, getCurrentUser, logout, findMenuById, findCategoryById } =
  window.CafeUtils;

const statusLabels = {
  pending: "접수 대기",
  preparing: "제조 중",
  ready: "픽업 가능",
  completed: "완료",
  cancelled: "취소",
};

const tiers = [
  { min: 10, label: "골드 회원" },
  { min: 3, label: "실버 회원" },
  { min: 0, label: "일반 회원" },
];

function formatDate(value) {
  const date = value ? new Date(value) : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "날짜 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getTierLabel(orderCount) {
  return tiers.find((tier) => orderCount >= tier.min).label;
}

function getOrderTotal(orders) {
  return orders.reduce((total, order) => total + (Number(order.totalPrice) || 0), 0);
}

function getFavoriteCategoryLabel(orders) {
  const categoryCounts = new Map();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const menu = findMenuById(item.menuId);

      if (!menu) {
        return;
      }

      const count = categoryCounts.get(menu.categoryId) || 0;
      categoryCounts.set(menu.categoryId, count + (Number(item.quantity) || 1));
    });
  });

  const favorite = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0];

  if (!favorite) {
    return "아직 없음";
  }

  const category = findCategoryById(favorite[0]);
  return category?.label || category?.name || "기타";
}

function renderProfile(user, orders) {
  const tierLabel = getTierLabel(orders.length);
  const totalPrice = getOrderTotal(orders);

  document.getElementById("tier-badge").textContent = tierLabel;
  document.getElementById("profile-avatar").textContent = user.name.trim().charAt(0).toUpperCase();
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-desc").textContent =
    orders.length > 0
      ? `${formatPrice(totalPrice)} 만큼 Cafe Bada를 즐겼어요.`
      : "바다처럼 여유로운 첫 주문을 기다리고 있어요.";
}

function renderSummary(orders) {
  const totalPrice = getOrderTotal(orders);
  const points = Math.floor(totalPrice * 0.03);

  document.getElementById("total-orders").textContent = `${orders.length}건`;
  document.getElementById("member-points").textContent = `${points.toLocaleString("ko-KR")}P`;
  document.getElementById("favorite-category").textContent = getFavoriteCategoryLabel(orders);
}

function renderRecentOrderSummary(orders) {
  const summary = document.getElementById("recent-order-summary");
  const meta = document.getElementById("recent-order-meta");
  const latest = orders[0];

  if (!latest) {
    summary.textContent = "아직 주문 내역이 없습니다.";
    meta.textContent = "메뉴를 담고 첫 주문을 시작해보세요.";
    return;
  }

  const firstItem = latest.items?.[0];
  const extraCount = Math.max((latest.items?.length || 0) - 1, 0);
  const itemLabel = firstItem
    ? `${firstItem.name}${extraCount > 0 ? ` 외 ${extraCount}개` : ""}`
    : "주문 메뉴";

  summary.textContent = `${itemLabel} · ${formatPrice(latest.totalPrice)}`;
  meta.textContent = `${formatDate(latest.createdAt)} · ${
    statusLabels[latest.status] || latest.status || "상태 없음"
  }`;
}

function init() {
  const user = getCurrentUser();
  const guestView = document.getElementById("guest-view");
  const memberView = document.getElementById("member-view");

  if (!user) {
    window.location.href = "../auth/login.html?redirect=../my/index.html";
    return;
  }

  guestView.hidden = true;
  memberView.hidden = false;

  const orders = getOrders();
  renderProfile(user, orders);
  renderSummary(orders);
  renderRecentOrderSummary(orders);

  document.getElementById("btn-logout").addEventListener("click", () => {
    logout();
    window.location.href = "../auth/login.html";
  });
}

init();
