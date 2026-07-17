<script setup lang="ts">
import {
  NConfigProvider,
  NDialogProvider,
  NLayout,
  NLayoutContent,
  NLayoutHeader,
  NMessageProvider,
  ruRU,
  dateRuRU,
} from 'naive-ui'

import OrganizationProfile from '@/components/OrganizationProfile.vue'
import HomeView from '@/views/HomeView.vue'
</script>

<template>
  <NConfigProvider :locale="ruRU" :date-locale="dateRuRU">
    <NMessageProvider>
      <NDialogProvider>
        <NLayout class="layout">
          <NLayoutHeader bordered class="header">
            <span class="logo">Notes App</span>
            <OrganizationProfile />
          </NLayoutHeader>
          <NLayoutContent class="content">
            <HomeView />
          </NLayoutContent>
        </NLayout>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 1.5rem;
}

.logo {
  font-size: 1.1rem;
  font-weight: 600;
}

.content {
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 640px) {
  .header {
    padding: 0 0.75rem;
  }
}
</style>
