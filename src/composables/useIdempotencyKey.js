import { ref } from "vue";
import { generateUUID } from "../utils/uuid.js";

/**
 * Generates and manages a single idempotency key for one logical
 * "submission attempt" (a create action that may be retried).
 *
 * Usage:
 *   const { getHeaders, reset } = useIdempotencyKey();
 *   axios.post(url, data, { headers: getHeaders() });
 *   // on success:
 *   reset();
 *   // on error: do nothing — same key is reused on retry
 */
export function useIdempotencyKey() {
  const key = ref(null);

  function ensureKey() {
    key.value ??= generateUUID();
    return key.value;
  }

  function getHeaders() {
    return { "Idempotency-Key": ensureKey() };
  }

  function reset() {
    key.value = null;
  }

  return { key, getHeaders, reset };
}
