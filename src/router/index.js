import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";

/*
什麼是 meta: { requiresAuth: true }？
在定義路由表（routes）時，每個頁面都可以設定一個字典物件叫 meta（元資料），用來存放該頁面的自訂屬性。
目的：打上標籤，區分出哪些是公開頁面（如登入頁、註冊頁），哪些是受保護頁面（如後台、個人設定、Home頁）。
*/
const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: { requiresAuth: true }, // 自訂欄位：代表進入此頁面「需要登入權限」
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
    meta: { requiresAuth: true }, // 自訂欄位：代表進入此頁面「需要登入權限」
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

/*
requiresAuth: true 在 router.beforeEach((to, from, next) => { ... }) 中的作用，
主要是透過存取傳入的 to 物件（即使用者「準備前往」的頁面路由資訊）來進行條件比對。

一、to 物件裡面有什麼？
當使用者點擊連結或切換網址時，beforeEach 的第一個參數 to 會包含該頁面的所有路由屬性。
你設定在路由表裏面的 meta 物件，會被掛載在 to.meta 上：
// 使用者準備切換到 /about 時，`to` 物件的結構範例：
to = {
  path: '/about',
  name: 'about',
  meta: {
    requiresAuth: true // <-- 就是你在 routes 設定的資料
  },
  params: {},
  query: {}
}

二、requiresAuth 在守衛中的運作步驟
以下是它在代碼中一步步執行的流程：S1, S2, S3, S4

三.總結
requiresAuth: true 就像是一張「通行許可證標籤」。
在 路由表 貼上標籤 (meta: { requiresAuth: true })。
在 beforeEach 守衛 檢查標籤 (to.meta.requiresAuth)。
守衛發現有標籤卻沒有通行證 (!isAuthenticated) 時，出示攔截牌，將使用者送回登入頁。

四. router.beforeEach 的三個參數
router.beforeEach 就像是專案的 「門衛 / 檢查站」。
每當使用者在畫面上點擊連結、輸入網址、或是呼叫 router.push() 準備切換到新頁面時，
Vue Router 都會先暫停頁面跳轉，觸發這個函式進行身分檢查。
函式裡的三個參數：
  to：即將要前往（目標）的路由物件資訊。
  from：目前正準備離開的路由物件資訊。
  next：用來決定 「是否放行」 或 「強制轉址」 的呼叫函式：
      next()：安全通過，正常載入頁面。
      next({ name: 'login' })：攔截跳轉，強制導向登入頁。
*/
// 全局前置守衛：每次切換頁面時自動觸發
router.beforeEach((to, from, next) => {
  // S1. 取得登入狀態 (布林值：true 代表已登入, false 代表未登入)
  // 1. 先去 LocalStorage 檢查目前的登入狀態
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const isAuthenticated = email === "admin" && password === "1234";

  // S2. 檢查準備前往的頁面 (to) 是否帶有 requiresAuth 標記
  // 情況 A：使用者想去受保護的頁面 (requiresAuth)，但「尚未登入」
  if (to.meta.requiresAuth && !isAuthenticated) {
    // S3. 條件解析：
    // to.meta.requiresAuth === true (該頁面需要權限)
    // && !isAuthenticated === true (使用者目前沒有登入)
    // 動作：觸發條件，攔截請求並強制重導向至登入頁
    next({ name: "login" }); // 攔截！強制彈回登入頁

    // 情況 B：使用者「已經登入」，卻又手動輸入網址想打開登入頁 (login)
  } else if (to.name === "login" && isAuthenticated) {
    next({ name: "home" }); // 攔截！直接送去 Home 頁面，不讓他重複登入

    // 情況 C：通過所有安全檢查（例如已登入看 Home，或未登入看公開頁面）
  } else {
    // S4.
    // 條件不成立（例如不需要權限的頁面，或者已登入的使用者）
    // 動作：放行安全通過
    next(); // 放行進入目標頁面
  }
});

export default router;
