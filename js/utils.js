// =============================================================================
// UTILS.JS — Shared Utility Functions
// =============================================================================
//
// Common helper functions used across all Chemify Lab modules.
// This module provides reusable utilities for:
//   - DOM manipulation helpers (query, create, toggle)
//   - String formatting (capitalize, slugify, truncate)
//   - Number formatting (with units, significant figures)
//   - Debounce / throttle for event handlers
//   - Component loader (fetch and inject navbar/footer HTML snippets)
//   - Local storage helpers (save/load reaction history)
//   - Chemistry-specific helpers (format formulas with subscripts, etc.)
//
// Usage:
//   import { debounce, formatFormula, loadComponent } from '../js/utils.js';
//
// Dependencies: None (pure utility module)
// =============================================================================


// --- DOM Helpers ---
// TODO: export function $(selector) — shorthand for querySelector
// TODO: export function $$(selector) — shorthand for querySelectorAll
// TODO: export function createElement(tag, classes, text) — create element helper


// --- String Formatting ---
// TODO: export function capitalize(str) — capitalize first letter
// TODO: export function slugify(str) — convert to URL-safe slug
// TODO: export function truncate(str, maxLen) — truncate with ellipsis


// --- Number Formatting ---
// TODO: export function formatNumber(num, decimals) — format with locale
// TODO: export function toSignificantFigures(num, sigFigs) — round to sig figs
// TODO: export function withUnit(value, unit) — append unit string


// --- Event Helpers ---
// TODO: export function debounce(fn, delay) — debounce wrapper
// TODO: export function throttle(fn, limit) — throttle wrapper


// --- Component Loader ---
// TODO: export async function loadComponent(selector, path) — fetch HTML snippet and inject


// --- Local Storage ---
// TODO: export function saveToStorage(key, data) — JSON stringify and save
// TODO: export function loadFromStorage(key) — load and JSON parse


// --- Chemistry Helpers ---
// TODO: export function formatFormula(formula) — convert H2O to H₂O with subscripts
// TODO: export function getElementColor(category) — return color for element category
// TODO: export function formatMolarMass(mass) — format with g/mol unit
