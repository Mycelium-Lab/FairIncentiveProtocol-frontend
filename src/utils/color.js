export function getRandomRGBAColor() {
    const randomValue = () => Math.floor(Math.random() * 256); // Генерируем случайное значение от 0 до 255
    const red = randomValue();
    const green = randomValue();
    const blue = randomValue();
    const alpha = Math.random(); // Генерируем случайное значение для альфа-канала от 0 до 1
    return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(1)})`;
}