# Security

The playground accepts bounded JSON and draws text to Canvas. It does not evaluate scripts, import remote images/fonts, execute diagram instructions, or upload diagrams. Exports are built in a Web Worker. The development and CLI servers bind to loopback only.

Do not put credentials or private architecture in examples, screenshots, exported images, or public bug reports. This is an illustration tool, not a secret detector. The initial app download is served by the hosting provider; network metadata from that request is outside the local processing guarantee.

The browser CLI loads only the app's local build. Keep dependencies and browsers up to date. This initial release is tested primarily in Chromium; it is not an independently audited security product.

For sensitive findings, use the repository's private vulnerability reporting feature rather than posting exploit details or credentials in an issue: https://github.com/jeffrog-256k1/wiremotion/security/advisories/new
