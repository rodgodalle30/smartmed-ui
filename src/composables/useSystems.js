import { ref } from "vue";
import axios from "axios";

const systems = ref([]);
const loading = ref(false);
const loaded = ref(false);

export function useSystems() {
  const getSystems = async (force = false) => {
    if (loading.value) return;
    if (loaded.value && !force) return;
    loading.value = true;

    try {
      const response = await axios.get("/systems?active=1");

      if (!response.data?.success) {
        console.error(response.data?.message ?? "Failed to load systems");
        return;
      }

      systems.value = response.data?.data ?? [];
      loaded.value = true;
    } catch (e) {
      console.error("Failed to load systems", e);
    } finally {
      loading.value = false;
    }
  };

  return { systems, loading, loaded, getSystems };
}
