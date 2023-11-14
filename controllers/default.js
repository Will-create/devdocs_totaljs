exports.install = function() {
    ROUTE('GET /', home);
    ROUTE('GET /{library}/', lib);
    ROUTE('GET /{library}/{doc}/{page}', doc);
}

function home() {
    var self = this;
    DATA.find('nosql/libraries').callback(function(err, response) {
        self.view('index', { docs: response});
    });
}

async function lib(lib) {
    var self = this;
    var reader = U.reader(MAIN.db);
    var reader2 = U.reader(MAIN.db);
    var item = await DATA.one('nosql/libraries').where('linker', lib).promise();
    if (!item) {
        self.view('404', { error: 'Library is not found'});
        return;
    }

    var docs  = await reader.find().where('kind', 'page').where('libraryid', item.id).sort('sortindex', true).promise();

    if (!docs) {
        self.view('404', { error: 'Page not found' });
        return;
    }

    FUNC.group(docs, async function(output) {
        var items = await reader2.find().where('libraryid', item.id).where('kind', 'item').rule('doc.pageid.includes(arg.id)', { id: output.active.id }).promise();
        FUNC.merge_pages(items,async function(str) {
           output.html = await FUNC.md2html(str);
           output.lib = lib;
           self.view('doc', output);
        });
    });
};

async function doc(lib, doc, page) {
    var self = this;
    var reader = U.reader(MAIN.db);
    var reader2 = U.reader(MAIN.db);
    var reader3 = U.reader(MAIN.db);
    var item = await DATA.one('nosql/libraries').where('linker', lib).promise();
    if (!item) {
        self.view('404', { error: 'Library is not found'});
        return;
    }

    var docs  = await reader.find().where('kind', 'page').where('libraryid', item.id).sort('sortindex', true).promise();

    if (!docs) {
        self.view('404', { error: 'Page not found' });
        return;
    }

    var page = await reader3.read().where('libraryid', item.id).where('kind', 'page').where('linker', page).promise();

    FUNC.group(docs, async function(output) {
        var items = await reader2.find().where('libraryid', item.id).where('kind', 'item').rule('doc.pageid.includes(arg.id)', { id: page.id }).promise();

        FUNC.merge_pages(items, async function(str) {
           output.html = await FUNC.md2html(str);
           output.lib = lib;
           self.view('doc', output);
        });
    });
}


