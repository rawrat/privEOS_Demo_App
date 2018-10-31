export function read(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            return resolve(reader.result)
        })
        reader.readAsArrayBuffer(file)
    })
}

export function createFile(data, filename) {
    var file = new Blob([data]);
    if (window.navigator.msSaveOrOpenBlob){
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else {
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

export default {
    read,
    createFile
}