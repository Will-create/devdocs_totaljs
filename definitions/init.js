FUNC.init =  function() {
   !MAIN.db && F.Fs.readFile(PATH.databases('meta.json'), 'utf-8', function(err, data) {
        var db = data.parseJSON(true);
        MAIN.db = db.items;
    });
}
ON('ready', FUNC.init);