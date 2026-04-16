# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/tllobregat/zply/compare/v1.2.0...v1.3.0) (2026-04-16)


### Features

* **app-manifest:** add web app manifest and update icons for improved PWA support ([df81e8b](https://github.com/tllobregat/zply/commit/df81e8b3ebec550bd340f574ddf4fb5c74b4761f))
* **certificate-decoder:** add new tool for decoding X.509 certificates with detailed views ([e6ecec5](https://github.com/tllobregat/zply/commit/e6ecec574db1de8feac23a9943736addaed37f85))
* **dashboard:** enhance navigation and layout for category exploration ([7bb7c5a](https://github.com/tllobregat/zply/commit/7bb7c5a087972adf51825bbe56515d63509c9e8a))
* **markdown-editor:** add header shifting functionality to toolbar and editor actions ([be24a32](https://github.com/tllobregat/zply/commit/be24a32de2ad2363acdff168cdcfa55444d3ec79))
* **markdown-editor:** add KaTeX support for mathematical formulas in markdown ([5b1ce60](https://github.com/tllobregat/zply/commit/5b1ce60aae958a40a7d4e75968171e8e042f2648))
* **markdown-editor:** enhance markdown validation with comprehensive linting and add quick fixes ([458c373](https://github.com/tllobregat/zply/commit/458c37349779635f49c713a4da205549c628b657))
* **markdown-editor:** improve layout responsiveness and add customizable mobile breakpoint ([c0f0b62](https://github.com/tllobregat/zply/commit/c0f0b62b7d7772f583d4074bd0db66c50083ec10))
* **markdown-editor:** update feature set with KaTeX, structural analysis, and smart preview ([ce59de3](https://github.com/tllobregat/zply/commit/ce59de3c68896263600fa1c1dde7f60d3d4942d6))
* **not-found:** add localized 404 page with interactive navigation options ([5d8efe1](https://github.com/tllobregat/zply/commit/5d8efe12369cf6cf47805a12dd1f3d50e082b75d))


### Bug Fixes

* **markdown-editor:** fix cursor jumping while writing bug ([ba1330d](https://github.com/tllobregat/zply/commit/ba1330db52451e041bfcd86cf9e6d10aad7c7fc4))
* **metadata:** ensure localized URLs are set correctly for all pages ([c0686aa](https://github.com/tllobregat/zply/commit/c0686aa7522ed8ed260abf7086dab44acc2714dd))
* **metadata:** fix opengraph-image 404 and metadata routing ([63b9a2b](https://github.com/tllobregat/zply/commit/63b9a2bf7d4a724a57945701195d967b3d49ffbc))
* **ui:** diverse small ui improvements ([b883f6b](https://github.com/tllobregat/zply/commit/b883f6b20459384e5330fe5d4aeb4910fdf5b348))

## [1.2.0](https://github.com/tllobregat/zply/compare/v1.1.0...v1.2.0) (2026-04-11)


### Features

* **i18n:** add internationalization support for en & fr ([2aeabd1](https://github.com/tllobregat/zply/commit/2aeabd19b43e544bb1aae21e43d9c57033eb9b4f))
* **markdown-editor:** add file upload support to MarkdownToolbar ([b5f06aa](https://github.com/tllobregat/zply/commit/b5f06aa3341c2fad796bdb69c51f8f44e5db150e))
* **markdown-editor:** add PDF export functionality with print styles and toolbar integration ([e8dcb69](https://github.com/tllobregat/zply/commit/e8dcb6952f9caea42549d2399d1c5c3c311e3965))
* **privacy:** add dedicated privacy policy page with multilingual support and enhanced content ([b2f703a](https://github.com/tllobregat/zply/commit/b2f703a3d769ba07001d8733ce9b81fe712f7783))
* **tool-pages:** enhance metadata generation and add feature lists to tool pages ([2995a99](https://github.com/tllobregat/zply/commit/2995a99c0e54d55b14e5898ba14bb40849b5580a))
* **ui:** add reset-dashboard event and refine sidebar navigation ([7d29077](https://github.com/tllobregat/zply/commit/7d2907796201f1427c615c51b9f4906e475e0291))
* **ui:** implement animated full-page mobile menu with portal and dev-tool hide feature ([5d5c399](https://github.com/tllobregat/zply/commit/5d5c3999f2e3d1094fa63218bbfe539258df7734))
* **ui:** review dashboard ui ([92947cd](https://github.com/tllobregat/zply/commit/92947cd886750c61500dc0d31eee778ae5167e4f))


### Bug Fixes

* **clipboard:** improve clipboard fallback handling and error logging ([23d2853](https://github.com/tllobregat/zply/commit/23d2853619ac0bebf006f30de840e6aea30f3bef))
* **dashboard:** enhance tagline ([f2c593a](https://github.com/tllobregat/zply/commit/f2c593a8a697c4c6c6185c0aa366f9a2117d09e9))
* **dashboard:** review route navigation methods ([9728ea6](https://github.com/tllobregat/zply/commit/9728ea69d2ae0fbfe1d7f3073809dee306d9bdbd))
* **text-compare:** add unified/split diff mode and standardize labels ([d267937](https://github.com/tllobregat/zply/commit/d267937bdc1f098b70bb87b000e2cab311ce414a))
* **ui:** add `cursor-pointer` to interactive elements for better UX ([2b3b9b4](https://github.com/tllobregat/zply/commit/2b3b9b44c0caf29c15f1830227763da2a8e64f6a))
* **ui:** fix CopyButton style for IpInfoManualGuide sections ([8316885](https://github.com/tllobregat/zply/commit/83168855fec105b38a9bd16d0e6b63407f79d815))
* **ui:** resolve mobile bottom bar overlap and standardize icon sizes ([70db95a](https://github.com/tllobregat/zply/commit/70db95a3ae397f22c6017bdc686632bd62ad6da9))
* **ui:** standardize `workspaceClassName` styles across tools for responsive layout handling ([cf9fa69](https://github.com/tllobregat/zply/commit/cf9fa69d16cd4e154ff211c96192f5e52a4f3e32))
* **ui:** standardize border-radius and shadow styles across components ([2e7d5c5](https://github.com/tllobregat/zply/commit/2e7d5c5dba35c889a0f28b8e564ab51a323d1fc0))

## 1.1.0 (2026-04-06)


### Features

* **analytics:** add Vercel Analytics component ([49f5ecb](https://github.com/tllobregat/zply/commit/49f5ecb316fbdcd5bbb22c3cfadac252d969b251))


### Bug Fixes

* **a11y:** add accessible names to buttons for screen readers ([45b5ed8](https://github.com/tllobregat/zply/commit/45b5ed8d43694c0ab26b801dc08b3b85adb050e2))
* **a11y:** add descriptive aria-labels to icon-only buttons ([9ff71e1](https://github.com/tllobregat/zply/commit/9ff71e1ad6c9c9d749564d8b03114ebe9e0a52cb))
