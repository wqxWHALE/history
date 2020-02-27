const proFolderName='Admin';

const proHost='localhost';
//const proHost='192.168.0.109';
const serviceAddr='http://localhost:8090';
//const serviceAddr='http://192.168.0.109:8090';

exports.getProFolderName = function() {
    return proFolderName;
};

exports.getProHost = function() {
    return proHost;
};

exports.getServiceAddr = function() {
    return serviceAddr;
};
