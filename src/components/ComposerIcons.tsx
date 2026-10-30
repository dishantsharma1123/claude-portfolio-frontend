import type { ReactNode } from "react";

// Lucide-style 24px line icons used by the composer, home screen and sidebar menus.
function Icon({ size = 16, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type IconProps = { size?: number };

export const AddIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const SlidersIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4" />
  </Icon>
);

export const ClockIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Icon>
);

export const ChevronDownIcon = ({ size = 14 }: IconProps) => (
  <Icon size={size}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const CheckIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M20 6 9 17l-5-5" />
  </Icon>
);

export const CloseIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const PaperclipIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </Icon>
);

export const LinkedInIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </Icon>
);

export const MailIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </Icon>
);

export const CodeIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
  </Icon>
);

export const BriefcaseIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Icon>
);

export const LayersIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </Icon>
);

export const LightbulbIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4" />
  </Icon>
);

export const FolderIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </Icon>
);

export const FileTextIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" />
  </Icon>
);

export const MicIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <rect x="9" y="2" width="6" height="13" rx="3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
  </Icon>
);

export const MicOffIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="m2 2 20 20M18.89 13.23A7 7 0 0 0 19 12v-2M5 10v2a7 7 0 0 0 12 5M15 9.34V5a3 3 0 0 0-5.68-1.33M9 9v3a3 3 0 0 0 5.12 2.12M12 19v3" />
  </Icon>
);

/** Claude's "voice mode" button (audio lines) */
export const WaveformIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M2 10v3M6 6v11M10 3v18M14 8v7M18 5v13M22 10v3" />
  </Icon>
);

export const ChatBubbleIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </Icon>
);

export const SearchIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const DownloadIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </Icon>
);

/** Claude's incognito-chat ghost */
export const GhostIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
  </Icon>
);

export const PencilIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M21.17 6.81a2.83 2.83 0 0 0-4-4L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5zM15 5l4 4" />
  </Icon>
);

/** Claude's "Artifacts" shapes icon, used for the tech stack page */
export const ShapesIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M8.3 10a.7.7 0 0 1-.63-1.07l3.7-6.2a.7.7 0 0 1 1.21 0l3.7 6.2A.7.7 0 0 1 15.7 10z" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <circle cx="17.5" cy="17.5" r="3.5" />
  </Icon>
);

/** Claude's "Customize" toolbox icon */
export const ToolboxIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20M8 11v4M16 11v4" />
  </Icon>
);

export const SettingsIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const GlobeIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20" />
  </Icon>
);

export const HelpIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </Icon>
);

/** Claude's "Upgrade plan" arrow, used for "Hire Dishant" */
export const ArrowUpCircleIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16 12-4-4-4 4M12 16V8" />
  </Icon>
);

export const InfoIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </Icon>
);

export const LogOutIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </Icon>
);

export const LogInIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
  </Icon>
);

export const ChevronRightIcon = ({ size = 14 }: IconProps) => (
  <Icon size={size}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

export const ChevronLeftIcon = ({ size = 14 }: IconProps) => (
  <Icon size={size}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);

export const ExternalIcon = ({ size = 14 }: IconProps) => (
  <Icon size={size}>
    <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </Icon>
);
