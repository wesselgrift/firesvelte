import { writable } from 'svelte/store';

export const lockScroll = writable<boolean>(false);
export const viewSidebar = writable<boolean>(false);
export const portals = writable<Record<string, boolean>>({});

