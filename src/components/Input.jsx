export const Input = ({
    field,
    label,
    value,
    onChangeHandler,
    type,
    showErrorMessage,
    validationMessage,
    onBlurHandler,
    textarea,
    disabled
}) => {
    const handleValueChange = (event) => {
        onChangeHandler(event.target.value, field);
    };

    const handleInputBlur = (event) => {
        onBlurHandler(event.target.value, field);
    };

    return (
        <div className="input-group-createUser">
            <label className="auth-form-label">{label}</label>
            {textarea ? (
                <textarea
                    type={type}
                    value={value}
                    onChange={handleValueChange}
                    onBlur={handleInputBlur}
                    rows={5}
                    className="auth-form-input"
                    disabled={disabled}
                />
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={handleValueChange}
                    onBlur={handleInputBlur}
                    className="auth-form-input"
                    disabled={disabled}
                />
            )}
            <span
                className={`auth-form-validations-message ${
                    showErrorMessage ? "show" : ""
                }`}
            >
                {validationMessage}
            </span>
        </div>
    );
};
