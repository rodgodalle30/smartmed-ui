<template>
  <div class="fixed inset-0 pointer-events-none z-[9999] flex justify-end p-6">
    <div class="flex flex-col items-end gap-4 w-full max-w-sm">
      <transition-group
        name="notification"
        tag="div"
        class="flex flex-col items-end gap-4 w-full"
      >
        <NotificationAlert
          v-for="notification in notifications"
          :key="notification.id"
          :type="notification.type"
          :title="notification.title"
          :message="notification.message"
          :details="notification.details"
          :duration="notification.duration"
          :show="notification.show"
          :show-countdown="notification.showCountdown"
          @close="removeNotification(notification.id)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import NotificationAlert from "./NotificationAlert.vue";
import { useNotification } from "../../composables/useNotification";

const { notifications, removeNotification } = useNotification();
</script>

<style scoped>
/* Slide in from right animation */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

/* Smooth stacking animation */
.notification-move {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Ensure proper stacking */
.notification-leave-active {
  position: absolute;
  width: 100%;
}
</style>
