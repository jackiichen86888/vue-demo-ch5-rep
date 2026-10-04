<template>
  <div class="login">
    <h1>Login</h1>
    <input type="text" placeholder="Email" v-model="email" /><br />
    <input type="password" placeholder="Password" v-model="password" /><br />
    <input type="button" value="送出" @click="submit" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "LoginView",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const isLogin = ref(false);

    onMounted(() => {
      email.value = localStorage.getItem("email") || "";
      password.value = localStorage.getItem("password") || "";
      checkLogin();

      // 如果打開頁面時發現原本就已經是登入狀態，直接導向 Home 頁面
      //   if (isLogin.value) {
      //     router.push({ name: "home" });
      //   }
    });

    function checkLogin() {
      if (email.value === "admin" && password.value === "1234") {
        isLogin.value = true;
      } else {
        isLogin.value = false;
      }
    }

    function submit() {
      console.log(email.value, password.value);
      localStorage.setItem("email", email.value);
      localStorage.setItem("password", password.value);
      checkLogin();

      if (!isLogin.value) {
        alert("登入失敗");
      } else {
        // 修正 1：移除 this，改用 Composition API 的 router 物件
        // 修正 2：登入成功後切換至 home 頁面（使用路由名稱）
        router.push({ name: "home" });
      }
    }

    return { email, password, isLogin, checkLogin, submit };
  },
};
</script>
