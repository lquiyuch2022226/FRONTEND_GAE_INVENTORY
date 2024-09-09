export const logout = () => {
    localStorage.removeItem('token'),
    localStorage.removeItem('lastButtonClick')

    window.location.href = '/'
}