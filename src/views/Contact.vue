
<template>

  <div class="container">
    <form>
      <div class="mb-3">
        <label for="email" class="form-label">メールアドレス</label>
        <input type="email" class="form-control" id="email" placeholder="example@example.com">
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">パスワード</label>
        <input type="password" class="form-control" id="password" placeholder="******">
      </div>
      <button type="submit" class="btn btn-primary">送信</button>
    </form>
  </div>
</template>
<script setup></script>