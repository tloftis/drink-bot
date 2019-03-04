(function () {
    let libs = [
        '/socket.io/socket.io.js',
//        '/public/libs/bootstrap-3.3.7-dist/js/bootstrap.min.js',
        '/public/libs/noty/noty.min.js',
        '/public/libs/sweetalert2/sweetalert2.all.min.js'
    ];

    for(let i = 0, lib = libs[i]; i < libs.length; i++, lib = libs[i]) {
        let script = document.createElement('script');
        script.setAttribute('src', lib);
        document.head.appendChild(script);
    }
})();

let loaders = [];

window.addOnLoad = function (load) {
    loaders.push(load);
};

window.onload = function () {
    loaders.forEach(load => {
        load();
    });
};
