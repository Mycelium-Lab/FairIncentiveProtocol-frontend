const splitText = (text, separator) => {
    const splited = text.split(separator);
    splited.unshift(' ')
    splited.unshift(separator)
    return splited.join('')
}

export default splitText