// Pro Straps Icon System — Hugeicons wrapper
// All icons re-exported from @hugeicons/core-free-icons via @hugeicons/react
// Usage: import { SearchIcon, HeartIcon } from "@/lib/icons"

import { HugeiconsIcon } from "@hugeicons/react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconData = any;

// ─── Icon Data Imports ────────────────────────────────────────────────
import {
  Search01Icon as _Search,
  HeartIcon as _Heart,
  User02Icon as _User,
  ShoppingBag01Icon as _ShoppingBag,
  Menu01Icon as _Menu,
  Cancel01Icon as _Cancel,
  ArrowDown01Icon as _ArrowDown,
  ArrowRight01Icon as _ArrowRight,
  ArrowUp01Icon as _ArrowUp,
  Sun01Icon as _Sun,
  Moon01Icon as _Moon,
  MinusSignIcon as _Minus,
  Add01Icon as _Plus,
  Clock01Icon as _Clock,
  TrendingUpDownIcon as _TrendingUp,
  DeliveryTruck01Icon as _Truck,
  RefreshIcon as _Refresh,
  Shield01Icon as _Shield,
  Award01Icon as _Award,
  Tick01Icon as _Tick,
  ZoomInAreaIcon as _ZoomIn,
  SlidersHorizontalIcon as _Sliders,
  StarAward01Icon as _Star,
  PencilEdit02Icon as _Edit,
  Watch01Icon as _Watch,
  MailSend01Icon as _Send,
  Loading02Icon as _Loading,
  Alert01Icon as _Alert,
  InformationCircleIcon as _Info,
  Home01Icon as _Home,
  Logout02Icon as _Logout,
  EyeIcon as _Eye,
  Delete02Icon as _Delete,
  Copy01Icon as _Copy,
  Share01Icon as _Share,
  Mail01Icon as _Mail,
  Location01Icon as _Location,
  Calendar03Icon as _Calendar,
  Notification01Icon as _Bell,
  Bookmark01Icon as _Bookmark,
  LockIcon as _Lock,
  Settings02Icon as _Settings,
  HelpCircleIcon as _Help,
  PackageIcon as _Package,
  Tag02Icon as _Tag,
  HandFistIcon as _Hand,
  RulerIcon as _Ruler,
  CheckmarkCircle01Icon as _CheckCircle,
  QuoteUpIcon as _Quote,
  Grid02Icon as _Grid,
  ListViewIcon as _List,
  SortByDownIcon as _SortDown,
  SortByUpIcon as _SortUp,
  FilterIcon as _Filter,
  ChevronDownIcon as _ChevronDown,
  ChevronRightIcon as _ChevronRight,
  ChevronLeftIcon as _ChevronLeft,
  SeparatorHorizontalIcon as _Separator,
  ArrowLeft01Icon as _ArrowLeft,
  SmartphoneChargingIcon as _Smartphone,
  ZoomIcon as _Zoom,
  SendToBackIcon as _SendToBack,
  ThumbsUpIcon as _ThumbsUp,
  CheckmarkCircle02Icon as _CheckCircle2,
  ArrowLeft02Icon as _ArrowLeft2,
  ArrowRight02Icon as _ArrowRight2,
} from "@hugeicons/core-free-icons";

// ─── Icon Component Wrapper ───────────────────────────────────────────

interface ProStrapsIconProps {
  size?: number;
  className?: string;
  "aria-label"?: string;
}

function makeIcon(data: IconData) {
  const Icon = ({ size = 18, className, ...props }: ProStrapsIconProps) => (
    <HugeiconsIcon
      icon={data}
      size={size}
      className={className}
      {...props}
    />
  );
    Icon.displayName = "ProStrapsIcon";
  return Icon;
}

// ─── Exported Icons ────────────────────────────────────────────────────

export const SearchIcon = makeIcon(_Search);
export const HeartIcon = makeIcon(_Heart);
export const UserIcon = makeIcon(_User);
export const ShoppingBagIcon = makeIcon(_ShoppingBag);
export const MenuIcon = makeIcon(_Menu);
export const CloseIcon = makeIcon(_Cancel);
export const XIcon = makeIcon(_Cancel);
export const ArrowDownIcon = makeIcon(_ArrowDown);
export const ArrowRightIcon = makeIcon(_ArrowRight);
export const ArrowUpIcon = makeIcon(_ArrowUp);
export const ArrowLeftIcon = makeIcon(_ArrowLeft);
export const SunIcon = makeIcon(_Sun);
export const MoonIcon = makeIcon(_Moon);
export const MinusIcon = makeIcon(_Minus);
export const PlusIcon = makeIcon(_Plus);
export const ClockIcon = makeIcon(_Clock);
export const TrendingUpIcon = makeIcon(_TrendingUp);
export const TruckIcon = makeIcon(_Truck);
export const RefreshCwIcon = makeIcon(_Refresh);
export const ShieldIcon = makeIcon(_Shield);
export const AwardIcon = makeIcon(_Award);
export const CheckIcon = makeIcon(_Tick);
export const ZoomInIcon = makeIcon(_ZoomIn);
export const SlidersHorizontalIcon = makeIcon(_Sliders);
export const StarIcon = makeIcon(_Star);
export const EditIcon = makeIcon(_Edit);
export const WatchIcon = makeIcon(_Watch);
export const SendIcon = makeIcon(_Send);
export const LoadingIcon = makeIcon(_Loading);
export const AlertIcon = makeIcon(_Alert);
export const InfoIcon = makeIcon(_Info);
export const HomeIcon = makeIcon(_Home);
export const LogoutIcon = makeIcon(_Logout);
export const EyeIcon = makeIcon(_Eye);
export const TrashIcon = makeIcon(_Delete);
export const CopyIcon = makeIcon(_Copy);
export const ShareIcon = makeIcon(_Share);
export const MailIcon = makeIcon(_Mail);
export const LocationIcon = makeIcon(_Location);
export const CalendarIcon = makeIcon(_Calendar);
export const BellIcon = makeIcon(_Bell);
export const BookmarkIcon = makeIcon(_Bookmark);
export const LockIcon = makeIcon(_Lock);
export const SettingsIcon = makeIcon(_Settings);
export const HelpIcon = makeIcon(_Help);
export const PackageIcon = makeIcon(_Package);
export const TagIcon = makeIcon(_Tag);
export const HandIcon = makeIcon(_Hand);
export const RulerIcon = makeIcon(_Ruler);
export const CheckCircleIcon = makeIcon(_CheckCircle);
export const QuoteIcon = makeIcon(_Quote);
export const GridIcon = makeIcon(_Grid);
export const ListIcon = makeIcon(_List);
export const SortDownIcon = makeIcon(_SortDown);
export const SortUpIcon = makeIcon(_SortUp);
export const FilterIcon = makeIcon(_Filter);
export const ChevronDownIcon = makeIcon(_ChevronDown);
export const ChevronRightIcon = makeIcon(_ChevronRight);
export const ChevronLeftIcon = makeIcon(_ChevronLeft);
export const SeparatorIcon = makeIcon(_Separator);
export const SmartphoneIcon = makeIcon(_Smartphone);
export const ZoomIcon = makeIcon(_Zoom);
export const ThumbsUpIcon = makeIcon(_ThumbsUp);
export const CheckCircle2Icon = makeIcon(_CheckCircle2);
export const ArrowLeft2Icon = makeIcon(_ArrowLeft2);
export const ArrowRight2Icon = makeIcon(_ArrowRight2);

// ─── Social Icons ─────────────────────────────────────────────────────
// Hugeicons doesn't have brand icons, so we create minimal SVG wrappers
function makeBrandIcon(path: string) {
  const Icon = ({ size = 18, className, ...props }: ProStrapsIconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  );
  return Icon;
}

function makeBrandLogo(path: string) {
  const Icon = ({ size = 18, className, ...props }: ProStrapsIconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  );
  return Icon;
}

export const GoogleIcon = makeBrandLogo(
  "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
);
export const AppleIcon = makeBrandLogo(
  "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z"
);
export const InstagramIcon = makeBrandLogo(
  "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z"
);
export const TwitterIcon = makeBrandLogo(
  "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
);
export const FacebookIcon = makeBrandLogo(
  "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
);
export const YoutubeIcon = makeBrandLogo(
  "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43ZM9.75 15.02V8.48l5.75 3.27-5.75 3.27Z"
);
export const LinkedinIcon = makeBrandLogo(
  "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
);
export const GithubIcon = makeBrandLogo(
  "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
);
export const PhoneIcon = makeBrandIcon(
  "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
);
export const CreditCardIcon = makeBrandIcon(
  "M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM1 10h22M6 14h4"
);