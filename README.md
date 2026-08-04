# Zply 🚀

**Zply** is a high-quality, ultra-fast, and privacy-focused toolset. The Swiss Army Knife for Your Daily Tasks, it brings all your essential transformation, encoding, and visualization tools into a single, sleek, and high-performance "operating system" interface.

Built for professionals who value privacy and speed.

🌐 **Live Demo:** [zply.dev](https://zply.dev)

---

## 📑 Table of Contents

- [✨ Key Principles](#-key-principles)
- [🛠️ Available Tools](#-available-tools)
    - [🎨 Visualization](#-visualisation)
    - [📄 Data & Text](#-data--text)
    - [🔐 Security](#-security)
    - [🔢 Encoding & Conversion](#-encoding--conversion)
    - [🕒 Time & Calendars](#-time--calendars)
    - [🌐 Network](#-network)
- [🏗️ Tech Stack](#-tech-stack)
- [🚦 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📊 Analytics & Privacy](#-analytics--privacy)
- [⚖️ License](#-license)
- [💜 Community & Support](#-community--support)
- [☕ Support the Project](#-support-the-project)

---

## ✨ Key Principles

- **🔒 Zero Backend:** Every tool runs 100% in your browser. No user-input data is ever sent to a server.
- **🍪 Zero Cookies:** We do not use cookies or persistent identifiers. Your browsing remains private and storage-free.
- **🛡️ Privacy-First Telemetry:** We use anonymous, cookieless telemetry to monitor site health. (See [Analytics & Privacy](#-analytics--privacy) for details).
- **💾 URI Persistence:** Share your workspace state instantly. We use **MessagePack + Zlib** compression to store your current state directly in the `window.location.hash`, ensuring your data stays in the browser and never touches the network.
- **⚡ High Performance:** Built with Next.js (SSG) for sub-second load times and a fluid, "Island-based" UI architecture.

---

## 🛠 Available Tools

### 🎨 Visualisation
- **[PlantUML Editor](https://zply.dev/plantuml-editor)**: Create UML diagrams via text with real-time preview.
- **[Markdown Editor](https://zply.dev/markdown-editor)**: Ultra-fast GFM (GitHub Flavored) editor with split-screen preview.
- **[Mermaid.js Maker](https://zply.dev/mermaid-maker)**: Create lightweight flowcharts and sequence diagrams.
- **SVG Optimizer** (`Coming Soon`): Visualize and clean up SVG code using SVGO.
- **[SQL & DB Visualizer](https://zply.dev/sql-database-visualizer)**: Generate ER diagrams from SQL (PostgreSQL, MariaDB) or Prisma.
- **Excalidraw Canvas** (`Coming Soon`): Smooth hand-drawn sketching and diagrams.

### 📊 Data & Text
- **[JSON Utils](https://zply.dev/json-utils)**: Instant indentation, validation, and minification.
- **[Text Compare](https://zply.dev/text-compare)**: Visual diff tool with split or unified views.
- **Regex Tester** (`Coming Soon`): Test regular expressions with real-time explanations.
- **[Data Transformer](https://zply.dev/data-transformer)**: Convert between JSON, YAML, CSV, XML, and TypeScript.
- **SQL Formatter** (`Coming Soon`): Beautify and standardize complex SQL queries.

### 🔐 Security
- **[JWT Debugger](https://zply.dev/jwt-debugger)**: Secure, local decoding of JWT claims and payloads.
- **[Hash Generator](https://zply.dev/hash-generator)**: Generate SHA-256, SHA-512, and MD5 hashes (Web Crypto API).
- **[Password Generator](https://zply.dev/password-generator)**: Generate secure passwords with customizable character sets and strength evaluation.
- **[Certificate Decoder](https://zply.dev/certificate-decoder)**: Decode X.509 certificates to view their details, including subject, issuer, validity, and extensions.
- **RSA Key Pair Gen** (`Coming Soon`): Generate public/private RSA key pairs.

### 🔤 Encoding & Conversion
- **[Base64 Encoder/Decoder](https://zply.dev/base64-encoder-decoder)**: Encode and decode text or files to Base64 instantly.
- **URL Encoder/Decoder** (`Coming Soon`): Secure management of URI special characters.
- **HTML Entities** (`Coming Soon`): Escape and unescape HTML characters.
- **Binary Converter** (`Coming Soon`): Convert text to binary and back.
- **Color Converter** (`Coming Soon`): Convert between HEX, RGB, HSL, and CMYK.
- **Unicode Escape** (`Coming Soon`): Convert text to Unicode escape sequences.

### 🕒 Time & Calendars
- **[Epoch Converter](https://zply.dev/epoch-converter)**: Convert timestamps to readable dates and handle UTC.
- **[Timezone Converter](https://zply.dev/timezone-converter)**: Compare times across different time zones.
- **Cron Parser** (`Coming Soon`): Translate Cron expressions into natural language.
- **Stopwatch & Timer** (`Coming Soon`): Track time with a precise stopwatch, lap management, and customizable countdowns.

### 🌐 Network
- **[My IP Info](https://zply.dev/my-ip-info)**: Detailed information about your public IP address.
- **CIDR Calculator** (`Coming Soon`): Calculate IP ranges and subnet masks.
- **HTTP Headers** (`Coming Soon`): Analyze HTTP response headers.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Primitives:** [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **State Compression:** [MessagePack](https://msgpack.org/) + [Zlib](https://en.wikipedia.org/wiki/Zlib) (via `fflate`)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Graphs & Diagrams:** [React Flow](https://reactflow.dev/), [Dagre](https://github.com/dagrejs/dagre) & [Mermaid](https://mermaid.js.org/)
- **Time:** [Day.js](https://day.js.org/)

---

## 🛠 Getting Started

### Prerequisites

- Node.js 22.x (LTS)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tllobregat/zply.git
   cd zply
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

We welcome contributions! Zply is an open-source project, and we are happy to accept:

- **Bug Fixes:** Found a glitch? Open an issue or submit a PR.
- **New Tools:** Have an idea for a "Zero Backend" tool? We'd love to see it.
- **UI/UX Improvements:** Help us make Zply even more polished.

### How to Contribute

1.  **Ticket First**: Search for an existing issue or [open a new one](https://github.com/tllobregat/zply/issues) to discuss your proposed change or tool. This ensures alignment with the project's vision and avoids duplicate work.
2.  **Fork & Branch**: Fork the repository and create a descriptive branch:
    -   For features: `git checkout -b feature/amazing-tool`
    -   For bug fixes: `git checkout -b fix/issue-description`
3.  **Development**: Implement your changes following the coding standards defined in `GEMINI.md`.
4.  **PR with Link**: Submit a Pull Request and **link it to the original issue** (e.g., `Closes #123`).
5.  **Validation**: Ensure the CI pipeline passes (Build, Lint, and Type Check).

We value clean, well-documented, and highly-typed contributions!

### 🛠️ Commit Convention

This project uses **Husky** and **commitlint** to enforce the [Conventional Commits](https://www.conventionalcommits.org/) specification. This ensures a clean, readable history and allows for automated changelogs.

#### Message Format
Each commit message must follow this structure:
`<type>(<scope>): <description>`

#### Common Types
- **feat**: A new tool or user-facing feature.
- **fix**: A bug fix.
- **docs**: Documentation changes only.
- **style**: Changes that do not affect the meaning of the code (formatting, missing semi-colons, etc).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **chore**: Updating build tasks, package manager configs, or tools.

#### 💡 Local Enforcement
When you run `git commit`, Husky will automatically trigger a check. If your message does not follow the convention, the commit will be **rejected**.

**Example of a valid commit:**
`feat(json): add nested key validation`

---

## 📊 Analytics & Privacy

Zply is built on a **Privacy-First** philosophy. We do not use cookies, and we do not collect any Personally Identifiable Information (PII).

### 🛡️ Cookieless Telemetry
To monitor site health and performance, we use **Vercel Web Analytics**. This integration is strictly for anonymous telemetry and does not track individual users.

* **No Cookies:** No data is stored on your device's persistent storage.
* **No PII:** Your IP address is hashed and discarded immediately; we never see who you are.
* **Short-lived Hashes:** Visitor identification is rotated every 24 hours, making cross-day tracking impossible.
* **Full Transparency:** You can verify Vercel's privacy-first architecture in their [Official Documentation](https://vercel.com/docs/analytics/privacy-policy) and [GDPR Compliance Guide](https://vercel.com/docs/analytics/gdpr).

### 🔒 Zero Backend Data
Even with telemetry enabled, your **data remains yours**.
The contents of your editors (JSON, SQL, JWTs, etc.) are processed 100% locally in your browser. Because Zply uses **URI Persistence** (MessagePack + Zlib compression in the `window.location.hash`), your sensitive inputs never touch a server—not even Vercel's.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](https://github.com/tllobregat/zply/blob/main/LICENSE) for more information.

---

## 💜 Community & Support

Zply is built for the community. If you find it useful, consider starring the repo! ⭐️

[![GitHub stars](https://img.shields.io/github/stars/tllobregat/zply.svg?style=social&label=Star&maxAge=2592000)](https://github.com/tllobregat/zply/stargazers)

---

## ☕ Support the Project

If Zply helps you in your daily workflow, consider supporting its development!

<a href="https://buymeacoffee.com/tllo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
