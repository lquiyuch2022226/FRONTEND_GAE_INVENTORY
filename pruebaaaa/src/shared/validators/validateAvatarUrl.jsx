export const validateAvatarUrl = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/

    return regex.test(url)
}

export const avatarUrlValidationMessage = 'Por favor ingresa una URL  válida'