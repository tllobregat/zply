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
  VISUALISATION = 'Visualisation',
  DATA = 'Data',
  SECURITY = 'Security',
  ENCODING = 'Encoding',
  TIME = 'Time',
  NETWORK = 'Network',
}

export type CategoryWithoutAll = Exclude<Category, Category.ALL>;

export enum ToolId {
  // VISUALISATION
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
  RSA_GEN = 'rsa-key-pair-generator',
  SECRET_GEN = 'secret-generator',
  
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
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status: ToolStatus;
  category: Exclude<Category, 'All'>;
  showInSidebar?: boolean;
  libs?: Library[];
}

export const TOOLS: ToolConfig[] = [
  // VISUALISATION
  {
    id: ToolId.DB_SCHEMA,
    title: 'SQL & DB Visualizer',
    description: 'Generate interactive ER diagrams from SQL or Prisma locally and securely.',
    href: '/sql-database-visualizer',
    icon: Database,
    status: 'active',
    category: Category.VISUALISATION,
    libs: [
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' },
      { name: 'React Flow', url: 'https://reactflow.dev/' },
      { name: 'Dagre', url: 'https://github.com/dagrejs/dagre' },
      { name: 'Node SQL Parser', url: 'https://github.com/taozhi8833998/node-sql-parser' }
    ]
  },
  {
    id: ToolId.PLANTUML,
    title: 'PlantUML Editor',
    description: 'Design UML diagrams via text. Real-time preview and sharing by URI.',
    href: '/plantuml-editor',
    icon: Code,
    status: 'active',
    category: Category.VISUALISATION,
    showInSidebar: true,
    libs: [
      { name: 'plantuml-core', url: 'https://github.com/plantuml/plantuml-core' }
    ]
  },
  {
    id: ToolId.MARKDOWN,
    title: 'Markdown Editor',
    description: 'Ultra-fast GitHub Flavored Markdown (GFM) editor with split-screen preview.',
    href: '/markdown-editor',
    icon: FileText,
    status: 'active',
    category: Category.VISUALISATION,
    showInSidebar: true,
    libs: [
      { name: 'marked', url: 'https://github.com/markedjs/marked' },
      { name: 'Monaco Editor', url: 'https://github.com/microsoft/monaco-editor' }
    ]
  },
  {
    id: ToolId.MERMAID,
    title: 'Mermaid.js Maker',
    description: 'Create lightweight flowcharts and sequence diagrams.',
    href: '/mermaid-maker',
    icon: Share2,
    status: 'coming-soon',
    category: Category.VISUALISATION,
    libs: [
      { name: 'mermaid', url: 'https://github.com/mermaid-js/mermaid' }
    ]
  },
  {
    id: ToolId.SVG_OPT,
    title: 'SVG Optimizer',
    description: 'Visualize and optimize SVG code via SVGO.',
    href: '/svg-optimizer',
    icon: Columns,
    status: 'coming-soon',
    category: Category.VISUALISATION,
    libs: [
      { name: 'svgo', url: 'https://github.com/svg/svgo' }
    ]
  },
  {
    id: ToolId.EXCALIDRAW,
    title: 'Excalidraw Canvas',
    description: 'Ultra-smooth sketching and "hand-drawn" diagrams.',
    href: '/excalidraw-canvas',
    icon: Pencil,
    status: 'coming-soon',
    category: Category.VISUALISATION,
    libs: [
      { name: 'excalidraw', url: 'https://github.com/excalidraw/excalidraw' }
    ]
  },

  // DATA
  {
    id: ToolId.DATA_TRANSFORMER,
    title: 'Data Transformer',
    description: 'Convert between JSON, YAML, CSV, XML, and TypeScript formats instantly.',
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
    title: 'JSON Utils',
    description: 'Instant JSON visualization, indentation, validation, and minification.',
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
    title: 'Text Compare',
    description: 'Compare two texts and find differences. Split or Unified view.',
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
    title: 'Regex Tester',
    description: 'Regular expression tester with real-time explanations.',
    href: '/regex-tester',
    icon: SearchCode,
    status: 'coming-soon',
    category: Category.DATA,
    showInSidebar: true
  },
  {
    id: ToolId.SQL_FMT,
    title: 'SQL Formatter',
    description: 'Beautify and unify your complex SQL queries.',
    href: '/sql-formatter',
    icon: Database,
    status: 'coming-soon',
    category: Category.DATA
  },

  // SECURITY
  {
    id: ToolId.JWT_DEC,
    title: 'JWT Debugger',
    description: 'Secure and local decoding and encoding of JSON Web Tokens (JWT).',
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
    title: 'Hash Generator',
    description: 'Generate SHA-256, SHA-512, and MD5 hashes via Web Crypto API.',
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
    id: ToolId.SECRET_GEN,
    title: 'Password & Secret Generator',
    description: 'Generate secure passwords, API keys, and random tokens with strength evaluation.',
    href: '/secret-generator',
    icon: ShieldCheck,
    status: 'coming-soon',
    category: Category.SECURITY
  },
  {
    id: ToolId.RSA_GEN,
    title: 'RSA Key Pair Gen',
    description: 'Generate RSA public/private key pairs.',
    href: '/rsa-key-pair-generator',
    icon: ShieldEllipsis,
    status: 'coming-soon',
    category: Category.SECURITY
  },

  // ENCODING
  {
    id: ToolId.BASE64,
    title: 'Base64 Encoder/Decoder',
    description: 'Instant Base64 encoding and decoding for text or files.',
    href: '/base64-encoder-decoder',
    icon: Binary,
    status: 'active',
    category: Category.ENCODING,
    showInSidebar: true
  },
  {
    id: ToolId.URL_IO,
    title: 'URL Encoder/Decoder',
    description: 'Secure management of URI special characters.',
    href: '/url-encoder-decoder',
    icon: Globe,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.HTML_ENTITIES,
    title: 'HTML Entities',
    description: 'Escape and unescape your HTML characters.',
    href: '/html-entities-converter',
    icon: FileCode,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.BINARY_CONV,
    title: 'Binary Converter',
    description: 'Convert text to binary and vice versa.',
    href: '/binary-converter',
    icon: Cpu,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.COLOR_CONV,
    title: 'Color Converter',
    description: 'Conversion between HEX, RGB, HSL, and CMYK formats.',
    href: '/color-converter',
    icon: Palette,
    status: 'coming-soon',
    category: Category.ENCODING
  },
  {
    id: ToolId.UNICODE_ESC,
    title: 'Unicode Escape',
    description: 'Convert text to Unicode escape sequences.',
    href: '/unicode-escape-sequences',
    icon: CaseSensitive,
    status: 'coming-soon',
    category: Category.ENCODING
  },

  // TIME
  {
    id: ToolId.EPOCH,
    title: 'Epoch Converter',
    description: 'Timestamps to readable dates and UTC management.',
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
    title: 'Timezone Converter',
    description: 'Compare times between different time zones.',
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
    title: 'Cron Parser',
    description: 'Translate Cron expressions into natural text.',
    href: '/cron-parser',
    icon: Calendar,
    status: 'coming-soon',
    category: Category.TIME
  },
  {
    id: ToolId.TIME_TRACKER,
    title: 'Stopwatch & Timer',
    description: 'Track time with a precise stopwatch, lap management, and customizable countdowns.',
    href: '/stopwatch-and-timer',
    icon: Timer,
    status: 'coming-soon',
    category: Category.TIME
  },

  // NETWORK
  {
    id: ToolId.MY_IP,
    title: 'My IP Info',
    description: 'Get detailed information about your public IP address.',
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
    title: 'CIDR Calculator',
    description: 'Calculate IPs, ranges, and subnet masks.',
    href: '/cidr-calculator',
    icon: Network,
    status: 'coming-soon',
    category: Category.NETWORK
  },
  {
    id: ToolId.HTTP_HEADERS,
    title: 'HTTP Headers',
    description: 'Analyze HTTP response headers.',
    href: '/http-headers-analyzer',
    icon: ListTree,
    status: 'coming-soon',
    category: Category.NETWORK
  },
];

export const CATEGORIES: Category[] = [
  Category.ALL,
  Category.VISUALISATION,
  Category.DATA,
  Category.SECURITY,
  Category.ENCODING,
  Category.TIME,
  Category.NETWORK,
];
