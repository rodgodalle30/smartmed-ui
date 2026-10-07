import { DefineComponent } from "vue";

export const CheckboxInput: DefineComponent<{}, {}, any>;
export const ColorPickerInput: DefineComponent<{}, {}, any>;
export const CommandPaletteInput: DefineComponent<{}, {}, any>;
export const DateInput: DefineComponent<{}, {}, any>;
export const DatePicker: DefineComponent<{}, {}, any>;
export const DateTimeInput: DefineComponent<{}, {}, any>;
export const DateTimePicker: DefineComponent<{}, {}, any>;
export const DropdownInput: DefineComponent<{}, {}, any>;
export const EmailInput: DefineComponent<{}, {}, any>;
export const FileInput: DefineComponent<{}, {}, any>;
export const LabelWithHiddenInput: DefineComponent<{}, {}, any>;
export const NumberInput: DefineComponent<{}, {}, any>;
export const PasswordInput: DefineComponent<{}, {}, any>;
export const PriceInput: DefineComponent<{}, {}, any>;
export const RadioInput: DefineComponent<{}, {}, any>;
export const SignaturePad: DefineComponent<{}, {}, any>;
export const SwitchInput: DefineComponent<{}, {}, any>;
export const TextareaInput: DefineComponent<{}, {}, any>;
export const TextInput: DefineComponent<{}, {}, any>;
export const TimeInput: DefineComponent<{}, {}, any>;
export const CommandPaletteWithInfo: DefineComponent<{}, {}, any>;

// Templates
export const AccessDenied: DefineComponent<{}, {}, any>;
export const AlertWithDismissBtn: DefineComponent<{}, {}, any>;
export const Breadcrumbs: DefineComponent<{}, {}, any>;
export const Drawer: DefineComponent<{}, {}, any>;
export const JsonValueViewer: DefineComponent<{}, {}, any>;
export const Loading: DefineComponent<{}, {}, any>;
export const NotificationContainer: DefineComponent<{}, {}, any>;
export const NotificationAlert: DefineComponent<{}, {}, any>;
export const ShowRecords: DefineComponent<{}, {}, any>;
export const SkeletonLoader: DefineComponent<{}, {}, any>;
export const Tabs: DefineComponent<{}, {}, any>;

// Layouts
export const MasterLayout: DefineComponent<{}, {}, any>;
export const PageTitle: DefineComponent<{}, {}, any>;

// Main Components
export const ApplicationLogo: DefineComponent<{}, {}, any>;
export const Checkbox: DefineComponent<{}, {}, any>;
export const DangerButton: DefineComponent<{}, {}, any>;
export const Dropdown: DefineComponent<{}, {}, any>;
export const InputError: DefineComponent<{}, {}, any>;
export const InputLabel: DefineComponent<{}, {}, any>;
export const MarqueeText: DefineComponent<{}, {}, any>;
export const Modal: DefineComponent<{}, {}, any>;
export const PrimaryButton: DefineComponent<{}, {}, any>;
export const SecondaryButton: DefineComponent<{}, {}, any>;
export const TextInputBase: DefineComponent<{}, {}, any>;
export const ToastNotification: DefineComponent<{}, {}, any>;

// Constants
export const columnsDateFormat: string[];

// Directives
export const vMarquee: any;

// Composables
export const useNotification: any;
export const useIdempotencyKey: any;
export const useSystems: any;

// Utils
export const generateUUID: any;
export const getInitials: (name: unknown) => string;
export const DEFAULT_SYSTEM_COLOR: string;
export const applySystemTheme: (color?: string | null) => void;
export const cacheSystemColor: (color: string) => void;
export const clearCachedSystemColor: () => void;
export const getCachedSystemColor: () => string;
export const normalizeSystemColor: (color?: unknown) => string | null;

// Shared events
export const emitter: any;
