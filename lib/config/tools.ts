import {
  Binary,
  Calendar,
  CaseSensitive,
  Clock,
  Code,
  Columns,
  Cpu,
  Database,
  FileCode,
  FileJson,
  FileText,
  Globe,
  Hash,
  Key,
  ListTree,
  Lock,
  LucideIcon,
  MapPin,
  Network,
  Palette,
  Pencil,
  Repeat,
  SearchCode,
  Share2,
  ShieldCheck,
  ShieldEllipsis,
  Timer
} from 'lucide-react';

export type ToolStatus = 'active' | 'coming-soon';

export enum Category {
  ALL = 'All',
  DIAGRAMS = 'Diagrams',
  DATA = 'Data',
  SECURITY = 'Security',
  ENCODING = 'Encoding',
  TIME = 'Time',
  NETWORK = 'Network',
}

export type CategoryWithoutAll = Exclude<Category, Category.ALL>;

export enum ToolId {
  // DIAGRAMS
  PLANTUML = 'plantuml-editor',
  MARKDOWN = 'markdown-editor',
  MERMAID = 'mermaid-maker',
  SVG_OPT = 'svg-optimizer',
  DB_SCHEMA = 'sql-database-visualizer',
  EXCALIDRAW = 'excalidraw-canvas',
  
  // DATA
  JSON_UTILS = 'json-utils',
  DATA_TRANSFORMER = 'data-transformer',
  SQL_FMT = 'sql-formatter',
  REGEX = 'regex-tester',
  TEXT_COMPARE = 'text-compare',
  
  // SECURITY
  JWT_DEC = 'jwt-debugger',
  HASH_GEN = 'hash-generator',
  CERT_DEC = 'certificate-decoder',
  RSA_GEN = 'rsa-key-pair-generator',
  PASSWORD_GEN = 'password-generator',

  // ENCODING
  URL_IO = 'url-encoder-decoder',
  BASE64 = 'base64-encoder-decoder',
  HTML_ENTITIES = 'html-entities-converter',
  BINARY_CONV = 'binary-converter',
  COLOR_CONV = 'color-converter',
  UNICODE_ESC = 'unicode-escape-sequences',


  // TIME
  EPOCH = 'epoch-converter',
  TZ_CONV = 'timezone-converter',
  CRON = 'cron-parser',
  TIME_TRACKER = 'time-tracker',
  
  // NETWORK
  CIDR = 'cidr-calculator',
  HTTP_HEADERS = 'http-headers-analyzer',
  MY_IP = 'my-ip-info',
}

export interface Library {
  name: string;
  url: string;
}

export interface ToolConfig {
  id: ToolId;
  href: string;
  icon: LucideIcon;
  status: ToolStatus;
  category: Exclude<Category, Category.ALL>;
  showInSidebar?: boolean;
  libs?: Library[];
}

export const TOOLS: ToolConfig[] = [
  // DIAGRAMS
  {
    id: ToolId.DB_SCHEMA,
    href: '/sql-database-visualizer',
    icon: Database,
    status: 'active',
    category: Category.DIAGRAMS,
    libs: [
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' },
      { name: 'React Flow', url: 'https://reactflow.dev/' },
      { name: 'Dagre', url: 'https://github.com/dagrejs/dagre' },
      { name: 'Node SQL Parser', url: 'https://github.com/taozhi8833998/node-sql-parser' }
    ]
  },
  {
    id: ToolId.PLANTUML,
    href: '/plantuml-editor',
    icon: Code,
    status: 'active',
    category: Category.DIAGRAMS,
    showInSidebar: true,
    libs: [
      { name: 'plantuml-core', url: 'https://github.com/plantuml/plantuml-core' }
    ]
  },
  {
    id: ToolId.MARKDOWN,
    href: '/markdown-editor',
    icon: FileText,
    status: 'active',
    category: Category.DIAGRAMS,
    showInSidebar: true,
    libs: [
      { name: 'marked', url: 'https://github.com/markedjs/marked' },
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' },
      { name: 'turndown', url: 'https://github.com/mixmark-io/turndown' },
      { name: 'turndown-plugin-gfm', url: 'https://github.com/domchristie/turndown-plugin-gfm' }
    ]
  },
  {
    id: ToolId.MERMAID,
    href: '/mermaid-maker',
    icon: Share2,
    status: 'active',
    category: Category.DIAGRAMS,
    showInSidebar: true,
    libs: [
      { name: 'mermaid', url: 'https://github.com/mermaid-js/mermaid' }
    ]
  },
  {
    id: ToolId.SVG_OPT,
    href: '/svg-optimizer',
    icon: Columns,
    status: 'coming-soon',
    category: Category.DIAGRAMS,
    libs: [
      { name: 'svgo', url: 'https://github.com/svg/svgo' }
    ]
  },
  {
    id: ToolId.EXCALIDRAW,
    href: '/excalidraw-canvas',
    icon: Pencil,
    status: 'coming-soon',
    category: Category.DIAGRAMS,
    libs: [
      { name: 'excalidraw', url: 'https://github.com/excalidraw/excalidraw' }
    ]
  },

  // DATA
  {
    id: ToolId.DATA_TRANSFORMER,
    href: '/data-transformer',
    icon: Repeat,
    status: 'active',
    category: Category.DATA,
    showInSidebar: true,
    libs: [
      { name: 'js-yaml', url: 'https://github.com/nodeca/js-yaml' },
      { name: 'papaparse', url: 'https://github.com/mholt/PapaParse' },
      { name: 'fast-xml-parser', url: 'https://github.com/NaturalIntelligence/fast-xml-parser' },
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' }
    ]
  },
  {
    id: ToolId.JSON_UTILS,
    href: '/json-utils',
    icon: FileJson,
    status: 'active',
    category: Category.DATA,
    showInSidebar: true,
    libs: [
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' }
    ]
  },
  {
    id: ToolId.TEXT_COMPARE,
    href: '/text-compare',
    icon: Columns,
    status: 'active',
    category: Category.DATA,
    showInSidebar: true,
    libs: [
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' }
    ]
  },
  {
    id: ToolId.REGEX,
    href: '/regex-tester',
    icon: SearchCode,
    status: 'coming-soon',
    category: Category.DATA,
    showInSidebar: true
  },
  {
    id: ToolId.SQL_FMT,
    href: '/sql-formatter',
    icon: Database,
    status: 'coming-soon',
    category: Category.DATA
  },

  // SECURITY
  {
    id: ToolId.JWT_DEC,
    href: '/jwt-debugger',
    icon: Key,
    status: 'active',
    category: Category.SECURITY,
    showInSidebar: true,
    libs: [
      { name: 'jose', url: 'https://github.com/panva/jose' },
      { name: 'jwt-decode', url: 'https://github.com/auth0/jwt-decode' },
      { name: 'crypto-js', url: 'https://github.com/brix/crypto-js' },
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' }
    ]
  },
  {
    id: ToolId.HASH_GEN,
    href: '/hash-generator',
    icon: Hash,
    status: 'active',
    category: Category.SECURITY,
    showInSidebar: true,
    libs: [
      { name: 'crypto-js', url: 'https://github.com/brix/crypto-js' },
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' }
    ]
  },
  {
    id: ToolId.PASSWORD_GEN,
    href: '/password-generator',
    icon: Lock,
    status: 'active',
    category: Category.SECURITY,
    showInSidebar: true,
    libs: [
      { name: 'Web Crypto API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API' }
    ]
  },
  {
    id: ToolId.RSA_GEN,
    href: '/rsa-key-pair-generator',
    icon: ShieldEllipsis,
    status: 'coming-soon',
    category: Category.SECURITY
  },
  {
    id: ToolId.CERT_DEC,
    href: '/certificate-decoder',
    icon: ShieldCheck,
    status: 'active',
    category: Category.SECURITY,
    showInSidebar: true,
    libs: [
      { name: '@peculiar/x509', url: 'https://github.com/PeculiarVentures/x509' },
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' }
    ]
  },

  // ENCODING
  {
    id: ToolId.BASE64,
    href: '/base64-encoder-decoder',
    icon: Binary,
    status: 'active',
    category: Category.ENCODING,
    showInSidebar: true
  },
  {
    id: ToolId.URL_IO,
    href: '/url-encoder-decoder',
    icon: Globe,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.HTML_ENTITIES,
    href: '/html-entities-converter',
    icon: FileCode,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.BINARY_CONV,
    href: '/binary-converter',
    icon: Cpu,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.COLOR_CONV,
    href: '/color-converter',
    icon: Palette,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.UNICODE_ESC,
    href: '/unicode-escape-sequences',
    icon: CaseSensitive,
    status: 'coming-soon',
    category: Category.ENCODING
  },

  // TIME
  {
    id: ToolId.EPOCH,
    href: '/epoch-converter',
    icon: Clock,
    status: 'active',
    category: Category.TIME,
    showInSidebar: true,
    libs: [
      { name: 'dayjs', url: 'https://github.com/iamkun/dayjs' }
    ]
  },
  {
    id: ToolId.TZ_CONV,
    href: '/timezone-converter',
    icon: Globe,
    status: 'active',
    category: Category.TIME,
    showInSidebar: true,
    libs: [
      { name: 'dayjs', url: 'https://github.com/iamkun/dayjs' }
    ]
  },
  {
    id: ToolId.CRON,
    href: '/cron-parser',
    icon: Calendar,
    status: 'coming-soon',
    category: Category.TIME
  },
  {
    id: ToolId.TIME_TRACKER,
    href: '/stopwatch-and-timer',
    icon: Timer,
    status: 'coming-soon',
    category: Category.TIME
  },

  // NETWORK
  {
    id: ToolId.MY_IP,
    href: '/my-ip-info',
    icon: MapPin,
    status: 'active',
    category: Category.NETWORK,
    showInSidebar: true,
    libs: [
      { name: 'ipapi.co', url: 'https://ipapi.co/' }
    ]
  },
  {
    id: ToolId.CIDR,
    href: '/cidr-calculator',
    icon: Network,
    status: 'coming-soon',
    category: Category.NETWORK
  },
  {
    id: ToolId.HTTP_HEADERS,
    href: '/http-headers-analyzer',
    icon: ListTree,
    status: 'coming-soon',
    category: Category.NETWORK
  },
];

export const CATEGORIES: Category[] = [
  Category.ALL,
  Category.DIAGRAMS,
  Category.DATA,
  Category.SECURITY,
  Category.ENCODING,
  Category.TIME,
  Category.NETWORK,
];
