/**
 * The cells missing after `gone` articles have dropped out, when they drop out in `order`
 * (cell indices, row-major). Each count keeps the holes of every smaller count.
 */
export const holesFor = (order: readonly number[], gone: number): ReadonlySet<number> => new Set(order.slice(0, gone));
