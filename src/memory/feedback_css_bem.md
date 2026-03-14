---
name: CSS methodology preference
description: User wants no CSS Modules — use plain SCSS with BEM naming and rethink- prefix for all classes
type: feedback
---

Do NOT use CSS Modules (`.module.scss` files with `import styles from`). All styling must be plain SCSS files imported globally.

**Why:** User prefers BEM naming convention with a `rethink-` prefix for all class names, making styles globally accessible and readable.

**How to apply:**
- Class names follow BEM: `rethink-[block]__[element]--[modifier]`
- SCSS files go in `src/styles/components/` and are imported from `globals.scss`
- In TSX/JSX, use plain string class names: `className="rethink-hero-banner__inner"` instead of `className={styles.inner}`
- For conditional classes: use template literals or ternary — `className={\`rethink-catalog__page-btn${active ? ' rethink-catalog__page-btn--active' : ''}\`}`
