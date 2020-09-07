require('angular');
const { charsetChanger, Charset } = require('charset-changer');
const { dialog } = require('electron').remote;
const ls = localStorage;

const ROOT_PATH_DIALOG = { properties: ['openDirectory'] };

var app = angular.module("root", []);

app.controller("AppController", function ($scope, $interval) {
    let config = {};
    let listSize;
    
    function onStartController() {
        resetConfig();
    }

    function resetConfig() {
        config.debug = true;
        config.createBackup = false;
        config.search = '**/*';
        config.to = Charset.ISO8859_1;
        config.from = Charset.UTF8;
        config.onList = (list) => {
            listSize = list.length;
            setProgress(0);
        };
        config.onAfterConvert = (_path, _data, progress) => { setProgress(progress); return false; }
        config.onFinish = function () { console.log('onFinish', arguments); };
    }

    function toggleCharset() {
        let aux = config.to;
        config.to = config.from;
        config.from = aux;
    }

    function toggleBackup() {
        config.createBackup = !config.createBackup;
    }

    function getRootPath() {
        dialog.showOpenDialog(ROOT_PATH_DIALOG).then((response) => {
            response.canceled || $scope.$apply(() => { config.root = response.filePaths[0]; });
        })
    }

    function setProgress(progress) {
        $scope.$apply(() => { $scope.progress = (progress * 100 / listSize).toFixed(2); });
    }

    function convert() {
        setTimeout(() => charsetChanger(config), 500);
    }


    /* MODELS */
    $scope.config = config;
    $scope.progress = (0).toFixed(2);

    /* FUNCTIONS */
    $scope.resetConfig = resetConfig;
    $scope.toggleCharset = toggleCharset;
    $scope.toggleBackup = toggleBackup;
    $scope.getRootPath = getRootPath;
    $scope.convert = convert;

    onStartController();
});