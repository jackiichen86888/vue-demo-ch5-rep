<template>
  <div class="home">
    <h1>This is an Home Page</h1>
    <!-- 引用 HelloWorld 組件 -->
    <HelloWorld />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  setup() {
    // 取得路由控制器實例
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const isLogin = ref(false);

    onMounted(async () => {
      let email = localStorage.getItem("email");
      let password = localStorage.getItem("password");
      if (email != "admin" || password != "1234") {
        // 修正 2：使用 useRouter 的實例進行頁面跳轉
        router.push("/login");
      }
    });

    return { email, password, isLogin };
  },
};
</script>
