export const validateUsername = (username) => {
    const regex = /^\S{3,8}$/

    return regex.test(username)
}

export const validateUsernameMessage = 'El username debe de contener entre 3 y 8 caracteres, sin espacios'