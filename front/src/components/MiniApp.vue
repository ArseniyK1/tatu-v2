<template>
  <div class="mini-app">
    <header class="app-header">
      <h1>🎨 Тату-мастер Дарья</h1>
      <p>Добро пожаловать в мое мини-приложение!</p>
    </header>

    <main class="app-content">
      <div class="welcome-card">
        <h2>Привет!</h2>
        <p>Я Дарья - тату-мастер. Здесь вы можете:</p>
        <ul>
          <li>Посмотреть мое портфолио</li>
          <li>Записаться на сеанс</li>
          <li>Узнать больше о моих услугах</li>
        </ul>
      </div>

      <div class="user-info" v-if="user">
        <h3>Ваш профиль:</h3>
        <p>Имя: {{ user.firstName }}</p>
        <p v-if="user.username">Username: @{{ user.username }}</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface User {
  id: number;
  firstName: string;
  username?: string;
  photoUrl?: string;
}

const user = ref<User | null>(null);

const fetchUser = async () => {
  try {
    const response = await fetch("/api/mini-app/user");
    const data = await response.json();

    if (!data.error) {
      user.value = data;
    }
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<style scoped>
.mini-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
}

.app-header p {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.app-content {
  padding: 30px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.welcome-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.welcome-card h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 24px;
}

.welcome-card p {
  margin: 0 0 15px 0;
  color: #666;
  line-height: 1.6;
}

.welcome-card ul {
  margin: 0;
  padding-left: 20px;
  color: #555;
}

.welcome-card li {
  margin-bottom: 8px;
}

.user-info {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-info h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.user-info p {
  margin: 5px 0;
  color: #666;
}
</style>
