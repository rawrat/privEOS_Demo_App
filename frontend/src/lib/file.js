export function read(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            return resolve(reader.result)
        })
        reader.readAsText(file)
    })
}