export const displayMessage = (message, type) => {
    return `<div class="alert alert-${type}" role="alert">${message}</div>`;
};