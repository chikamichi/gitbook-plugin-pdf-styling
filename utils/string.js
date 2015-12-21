/**
 * **Collection of utilities related to strings.**
 *
 * @module utils/string
 */

/**
 * Capitalize first letter within a string. Useful for ImageMagick -gravity.
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Escape spaces within a string. Useful for paths containing spaces.
 */
function escapeSpaces(str) {
  return str.replace(/ /g, '\\ ');
}

module.exports = {
  capitalizeFirst: capitalizeFirst,
  escapeSpaces: escapeSpaces
};
