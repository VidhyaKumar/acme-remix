export function getRandomColor() {
  // Generating random values for red, green, and blue components
  const red = Math.floor(Math.random() * 256) // Random number between 0 and 255
  const green = Math.floor(Math.random() * 256) // Random number between 0 and 255
  const blue = Math.floor(Math.random() * 256) // Random number between 0 and 255

  // Combining red, green, and blue components to create a hexadecimal color code
  const hexColor =
    "#" +
    red.toString(16).padStart(2, "0") +
    green.toString(16).padStart(2, "0") +
    blue.toString(16).padStart(2, "0")

  return hexColor
}
