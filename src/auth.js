import { writable } from 'svelte/store';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://meciadb.pockethost.io/');
pb.autoCancellation(false)
const authStore = writable({
  user: pb.authStore.model,
  token: pb.authStore.token,
  isLoggedIn: pb.authStore.isValid
});



pb.authStore.onChange(() => {
  authStore.set({
    user: pb.authStore.model,

    token: pb.authStore.token,
    isLoggedIn: pb.authStore.isValid
  });
});
export { authStore, pb };