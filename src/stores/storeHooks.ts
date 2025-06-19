import type { CredentialStore } from './CredentialStore';
import type { ModalStore } from './ModalStore';
import type { NavigationStore } from './NavigationStore';
import type { SettingsStore } from './SettingsStore';
import { useStore } from './Store';
import type { TaskStore } from './TaskStore';
import type { TaskTableStore } from './TaskTableStore';
import type { ViewStore } from './ViewStore';

export const useTaskStore = (): TaskStore => useStore().taskStore;
export const useCredentialStore = (): CredentialStore => useStore().credentialStore;
export const useNavigationStore = (): NavigationStore => useStore().navigationStore;
export const useSettingsStore = (): SettingsStore => useStore().settingsStore;
export const useModalStore = (): ModalStore => useStore().modalStore;
export const useTaskTableStore = (): TaskTableStore => useStore().taskTableStore;
export const useViewStore = (): ViewStore => useStore().viewStore;