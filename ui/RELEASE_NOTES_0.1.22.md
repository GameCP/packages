# @gamecp/ui v0.1.22

## 🐛 Bug Fixes

### SharedTooltip
- **Fixed z-index issue**: Tooltips now properly appear on top of all UI elements
- Changed from Tailwind `z-50` class to inline style `zIndex: 9999`
- Prevents tooltips from being hidden behind buttons, modals, and other components

## 📦 What Changed
- `SharedTooltip.tsx`: Updated z-index implementation for better layering

## 🔄 Migration
No breaking changes. This is a drop-in replacement that fixes tooltip visibility issues.

## 📝 Related Changes
This release works in conjunction with `ActionButton` fixes in the main app to eliminate double-tooltip issues.

---

**Full Changelog**: https://github.com/GameCP/packages/compare/v0.1.21...v0.1.22
