<template>
  <!-- 當前路徑不是登入頁 (path !== '/') 時才顯示導覽列與登出按鈕 -->
  <nav v-if="$route.path !== '/'">
    <router-link to="/home">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <input type="button" value="登出" @click="logout" />
  </nav>
  <router-view />
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "App",
  setup() {
    const router = useRouter();

    function logout() {
      // 1. 清除登入紀錄
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      // 2. 跳轉回登入頁 (方案 B 登入頁名稱為 'login'，路徑為 '/')
      router.push({ name: "login" });
    }

    return { logout };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
