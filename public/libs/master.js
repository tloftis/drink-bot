(function () {
    let libs = [
        '/socket.io/socket.io.js',
        '/public/libs/noty/noty.min.js',
        '/public/libs/sweetalert2/sweetalert2.all.min.js'
    ];

    for(let i = 0, lib = libs[i]; i < libs.length; i++, lib = libs[i]) {
        let script = document.createElement('script');
        script.setAttribute('src', lib);
        document.head.appendChild(script);
    }
})();

window.loaders = [];
window.isLoaded = false;

window.onload = function () {
    window.isLoaded = true;

    window.loaders.forEach(load => {
        load();
    });
};

window.addOnLoad = function (load) {
    window.loaders.push(load);
};

window.checkLoaded = function () {
    return new Promise((resolve) => {
        if (window.isLoaded) {
            return resolve();
        }

        window.addOnLoad(resolve);
    })
};
